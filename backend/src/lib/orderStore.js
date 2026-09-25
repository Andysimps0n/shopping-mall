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

/**
 * 세션 사용자의 DB 장바구니로 주문을 만든다.
 * body 안의 금액은 읽지 않는다.
 */
export async function createOrderFromCart(userId, body) {
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

  // 확인이 끝나기 전에 새 주문을 만들면 같은 장바구니로 두 번 결제될 수 있다.
  const confirming = await prisma.order.findFirst({
    where: { userId, status: "CONFIRMING" },
    select: { id: true },
  });
  if (confirming) {
    return {
      ok: false,
      status: 409,
      error: "payment_confirming",
      orderId: confirming.id,
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
 * 조회가 시간 초과되거나 설정이 없어도 주문은 CONFIRMING에 남고, 웹훅이 나중에 닫는다.
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
