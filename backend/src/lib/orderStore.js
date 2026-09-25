import crypto from "crypto";
import { prisma } from "../../lib/prisma.js";
import { parseShippingAddress } from "./address.js";
import { capQuantity, priceLines } from "./orderMath.js";
import { decidePaymentUpdate, rawFailureMessage } from "./paymentDecision.js";
import { fetchPortOnePayment, isPaymentNotFound } from "./portone.js";

export function serializeOrder(order, extras = {}) {
  return {
    id: order.id,
    status: order.status,
    itemsTotal: order.itemsTotal,
    shippingFee: order.shippingFee,
    totalAmount: order.totalAmount,
    recipientName: order.recipientName,
    phone: order.phone,
    postalCode: order.postalCode,
    address1: order.address1,
    address2: order.address2,
    memo: order.memo,
    payMethod: order.payMethod,
    paymentId: order.paymentId,
    orderName: order.orderName,
    failureMessage: order.failureMessage,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
    items: (order.items ?? []).map((item) => ({
      productId: item.productId,
      productName: item.productName,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    })),
    ...extras,
  };
}

const orderInclude = { items: { orderBy: { id: "asc" } } };

/** 확인이 이 시간보다 오래되면 PortOne에 다시 묻고, 그래도 안 끝나면 주문을 닫는다. */
export const DEFAULT_CONFIRM_TTL_MS = 15 * 60 * 1000;

export const AMOUNT_MISMATCH_MESSAGE = "결제 금액이 주문 금액과 다릅니다.";
export const CONFIRM_EXPIRED_MESSAGE = "결제 확인 시간이 지났습니다.";

export function confirmTtlMs() {
  const minutes = Number(process.env.ORDER_CONFIRM_TTL_MINUTES);
  if (!Number.isFinite(minutes) || minutes <= 0) return DEFAULT_CONFIRM_TTL_MS;
  return minutes * 60 * 1000;
}

/**
 * 결제창을 연 뒤 너무 오래 답이 없는 주문.
 * updatedAt은 CONFIRMING으로 바뀐 시각에 갱신된다.
 */
export function isOrderStale(order, now = new Date()) {
  const stamp = new Date(order.updatedAt ?? order.createdAt).getTime();
  const clock = now instanceof Date ? now.getTime() : new Date(now).getTime();
  return clock - stamp >= confirmTtlMs();
}

/**
 * 세션 사용자의 DB 장바구니로 주문을 만든다.
 * body 안의 금액은 읽지 않는다.
 */
export async function createOrderFromCart(userId, body, options = {}) {
  const address = parseShippingAddress(body);
  if (!address.ok) {
    return { ok: false, status: 400, error: address.error };
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: { include: { product: true } },
    },
  });

  const rows = (cart?.items ?? [])
    .filter((item) => item.product?.isActive)
    .map((item) => ({
      product: item.product,
      quantity: capQuantity(item.quantity),
    }))
    .filter((row) => row.quantity > 0);

  if (rows.length === 0) {
    return { ok: false, status: 400, error: "cart_empty" };
  }

  // 오래된 확인 중 주문은 PortOne에 다시 물은 뒤 닫는다. 닫히기 전에는 새 주문을 만들지 않는다.
  const released = await releaseStaleOpenOrders(userId, options);
  if (released.paidOrderId) {
    return {
      ok: false,
      status: 409,
      error: "already_paid",
      orderId: released.paidOrderId,
    };
  }

  const open = await prisma.order.findFirst({
    where: { userId, status: { in: ["PENDING", "CONFIRMING"] } },
    select: { id: true },
    orderBy: { createdAt: "desc" },
  });
  if (open) {
    return {
      ok: false,
      status: 409,
      error: "payment_confirming",
      orderId: open.id,
    };
  }

  const priced = priceLines(rows);
  const paymentId = `payment-${crypto.randomUUID()}`;

  const order = await prisma.order.create({
    data: {
      userId,
      status: "PENDING",
      itemsTotal: priced.itemsTotal,
      shippingFee: priced.shippingFee,
      totalAmount: priced.totalAmount,
      ...address.value,
      paymentId,
      orderName: priced.orderName,
      items: {
        create: priced.items,
      },
    },
    include: orderInclude,
  });

  return { ok: true, order };
}

async function applyDecision(order, payment, browserResult) {
  const decision = decidePaymentUpdate(order, payment, browserResult);

  if (decision.action === "mark_paid") {
    await prisma.$transaction(async (tx) => {
      // 결제창을 연 상태(PENDING, CONFIRMING)에서 처음 PAID가 될 때만 장바구니를 비운다.
      // 완료 요청과 웹훅이 동시에 와도 updateMany는 한 줄만 성공한다.
      const claimed = await tx.order.updateMany({
        where: { id: order.id, status: { in: ["PENDING", "CONFIRMING"] } },
        data: {
          status: "PAID",
          paidAt: new Date(),
          failureMessage: null,
        },
      });

      if (claimed.count === 1) {
        const cart = await tx.cart.findUnique({ where: { userId: order.userId } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
        return;
      }

      // 실패나 취소 뒤에 늦게 도착한 PAID는 주문만 결제됨으로 남긴다.
      // 손님이 그 사이 다시 담은 장바구니까지 지우지 않는다.
      await tx.order.updateMany({
        where: { id: order.id, status: { not: "PAID" } },
        data: {
          status: "PAID",
          paidAt: new Date(),
          failureMessage: null,
        },
      });
    });
  } else if (decision.action === "mark_failed" || decision.action === "mark_cancelled") {
    const status = decision.action === "mark_failed" ? "FAILED" : "CANCELLED";
    // 장바구니는 여기서 비우지 않는다. PAID로 처음 바뀔 때만 비운다.
    await prisma.order.updateMany({
      where: {
        id: order.id,
        status:
          status === "CANCELLED"
            ? { in: ["PENDING", "CONFIRMING", "PAID"] }
            : { in: ["PENDING", "CONFIRMING"] },
      },
      data: {
        status,
        failureMessage: rawFailureMessage(payment) || order.failureMessage,
      },
    });
  } else if (decision.action === "reject") {
    console.error("payment amount mismatch", {
      paymentId: order.paymentId,
      orderTotal: order.totalAmount,
      paidTotal: payment?.amount?.total ?? null,
      currency: payment?.currency ?? null,
    });
    // 금액이 다르면 PAID로 두지 않고 FAILED로 닫는다.
    // CONFIRMING에 남겨 두면 이 사용자는 다음 결제를 영원히 못 한다.
    await prisma.order.updateMany({
      where: { id: order.id, status: { in: ["PENDING", "CONFIRMING"] } },
      data: {
        status: "FAILED",
        failureMessage: AMOUNT_MISMATCH_MESSAGE,
      },
    });
  }

  const fresh = await prisma.order.findUnique({
    where: { id: order.id },
    include: orderInclude,
  });

  return { decision, order: fresh };
}

/**
 * paymentId로 주문을 찾고, PortOne 조회 결과와 금액이 같을 때만 PAID로 바꾼다.
 * 조회 전에 PENDING을 CONFIRMING으로 바꿔 둔다.
 * 조회가 시간 초과되거나 설정이 없어도, 만료 전에는 CONFIRMING에 남고 웹훅이 나중에 닫을 수 있다.
 * 만료 시각이 지난 뒤에 다시 물어도 결제가 아니면 FAILED로 닫아 다음 결제를 막지 않는다.
 * 이미 PAID면 다시 처리하지 않는다.
 * 장바구니는 PENDING 또는 CONFIRMING에서 처음 PAID가 될 때 한 번만 비운다.
 *
 * @param {string} paymentId
 * @param {{
 *   browserResult?: "cancelled" | "failed" | "returned" | null,
 *   source?: "browser" | "webhook",
 *   fetchPayment?: (paymentId: string) => Promise<unknown>
 * }} [options]
 * fetchPayment는 테스트에서 PortOne 조회만 바꿔 끼울 때 쓴다. 요청 처리에서는 비워 둔다.
 */
export async function syncOrderPayment(paymentId, options = {}) {
  const browserResult = options.browserResult ?? null;
  const source = options.source === "webhook" ? "webhook" : "browser";

  let order = await prisma.order.findUnique({
    where: { paymentId },
    include: orderInclude,
  });

  if (!order) {
    return { ok: false, status: 404, error: "not_found" };
  }

  if (order.status === "PENDING") {
    await prisma.order.updateMany({
      where: { id: order.id, status: "PENDING" },
      data: { status: "CONFIRMING" },
    });
    order = await prisma.order.findUnique({
      where: { id: order.id },
      include: orderInclude,
    });
  }

  const fetchPayment = options.fetchPayment ?? fetchPortOnePayment;
  let payment = null;
  try {
    payment = await fetchPayment(paymentId);
  } catch (error) {
    if (!isPaymentNotFound(error)) {
      const notConfigured = error?.code === "portone_not_configured";
      // 브라우저 완료 요청은 손님에게 "확인 중"을 보여 주고 끝낸다.
      // 웹훅은 5xx를 돌려 PortOne이 다시 보내게 한다.
      if (source === "webhook") {
        return {
          ok: false,
          status: notConfigured ? 503 : 500,
          error: notConfigured ? "portone_not_configured" : "portone_unavailable",
          order,
        };
      }
      return {
        ok: true,
        status: 200,
        error: notConfigured ? "portone_not_configured" : "confirming",
        order,
      };
    }
  }

  const result = await applyDecision(order, payment, browserResult);

  if (result.decision.action === "reject") {
    return {
      ok: false,
      status: 409,
      error: "amount_mismatch",
      order: result.order,
    };
  }

  if (result.order.status === "PAID") {
    return { ok: true, status: 200, order: result.order };
  }

  if (result.order.status === "FAILED" || result.order.status === "CANCELLED") {
    return { ok: true, status: 200, order: result.order };
  }

  if (source === "webhook") {
    return {
      ok: false,
      status: 409,
      error: "not_paid",
      order: result.order,
    };
  }

  return {
    ok: true,
    status: 200,
    error: "confirming",
    order: result.order,
  };
}

async function expireOrderIfStillOpen(orderId) {
  await prisma.order.updateMany({
    where: { id: orderId, status: { in: ["PENDING", "CONFIRMING"] } },
    data: {
      status: "FAILED",
      failureMessage: CONFIRM_EXPIRED_MESSAGE,
    },
  });
}

/**
 * 만료된 PENDING/CONFIRMING만 PortOne에 다시 묻고 닫는다.
 * 아직 기한 안인 주문은 건드리지 않는다. 그래야 같은 주문을 두 번 결제하지 않는다.
 * 다시 물어서 PAID가 되면 paidOrderId를 돌려주고, 호출하는 쪽이 새 주문을 만들지 않는다.
 *
 * @param {string} userId
 * @param {{ now?: Date, fetchPayment?: (paymentId: string) => Promise<unknown> }} [options]
 */
export async function releaseStaleOpenOrders(userId, options = {}) {
  const now = options.now ? new Date(options.now) : new Date();
  const openOrders = await prisma.order.findMany({
    where: { userId, status: { in: ["PENDING", "CONFIRMING"] } },
    orderBy: { createdAt: "asc" },
  });

  let paidOrderId = null;

  for (const order of openOrders) {
    if (!isOrderStale(order, now)) continue;

    await syncOrderPayment(order.paymentId, {
      source: "browser",
      browserResult: "returned",
      fetchPayment: options.fetchPayment,
    });

    const current = await prisma.order.findUnique({ where: { id: order.id } });
    if (!current) continue;
    if (current.status === "PAID") {
      paidOrderId = current.id;
      continue;
    }
    if (current.status === "PENDING" || current.status === "CONFIRMING") {
      await expireOrderIfStillOpen(current.id);
    }
  }

  return { paidOrderId };
}

/**
 * 확인 중 화면이 주기적으로 부른다. 같은 paymentId만 다시 조회한다.
 * 새 주문을 만들지 않으므로 같은 주문을 두 번 결제하지 않는다.
 * 기한이 지났는데도 결제가 아니면 FAILED로 닫는다.
 */
export async function refreshOwnedOrder(userId, orderId, options = {}) {
  const order = await getOwnedOrder(userId, orderId);
  if (!order) return null;
  if (order.status !== "PENDING" && order.status !== "CONFIRMING") {
    return order;
  }

  const now = options.now ? new Date(options.now) : new Date();
  const stale = isOrderStale(order, now);

  await syncOrderPayment(order.paymentId, {
    source: "browser",
    browserResult: "returned",
    fetchPayment: options.fetchPayment,
  });

  const mid = await getOwnedOrder(userId, orderId);
  if (!mid) return null;
  if (stale && (mid.status === "PENDING" || mid.status === "CONFIRMING")) {
    await expireOrderIfStillOpen(mid.id);
  }

  return getOwnedOrder(userId, orderId);
}

export async function getOwnedOrder(userId, orderId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  });

  if (!order || order.userId !== userId) return null;
  return order;
}

export async function listOwnedOrders(userId) {
  return prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function listPaidOrdersForAdmin() {
  return prisma.order.findMany({
    where: { status: "PAID" },
    include: {
      ...orderInclude,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
