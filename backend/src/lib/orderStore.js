import crypto from "crypto";
import { prisma } from "../../lib/prisma.js";
import { parseShippingAddress } from "./address.js";
import { capQuantity, priceLines } from "./orderMath.js";
import { decidePaymentUpdate, rawFailureMessage } from "./paymentDecision.js";
import {
  cancelPortOnePayment,
  fetchPortOnePayment,
  isPaymentAlreadyCancelled,
  isPaymentNotFound,
} from "./portone.js";

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
    refundStatus: order.refundStatus ?? null,
    refundMessage: order.refundMessage ?? null,
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
export const PAYMENT_NEVER_STARTED_MESSAGE = "결제를 시작하지 않아 주문을 닫았습니다.";
export const REFUND_REASON = "주문 금액과 결제 금액이 달라 전액 취소합니다.";
export const LATE_PAID_MESSAGE = "이미 결제된 주문이 있어 나중에 도착한 결제를 취소합니다.";
export const LATE_PAID_REFUND_REASON = "같은 장바구니로 이미 결제된 주문이 있어 전액 취소합니다.";
export const PAYMENT_NOT_FINISHED_MESSAGE = "결제를 마치지 않아 주문을 닫았습니다.";

/** 환불 취소 API를 최대 이 횟수만 부른다. 0부터 세면 세 번이다. */
export const REFUND_ATTEMPT_CAP = 3;

/**
 * 실패한 환불을 바로 다시 부르지 않는다.
 * 0번째 시도 전은 0, 1번 실패 후는 1분, 2번 실패 후는 5분. 그 다음은 더 부르지 않는다.
 *
 * @param {number} attempts
 * @returns {number | null}
 */
export function refundBackoffMs(attempts) {
  if (attempts <= 0) return 0;
  if (attempts === 1) return 60 * 1000;
  if (attempts === 2) return 5 * 60 * 1000;
  return null;
}

/**
 * @param {{ refundStatus?: string | null, refundAttempts?: number, refundAttemptAt?: Date | null }} order
 * @param {Date} [now]
 */
export function canAttemptRefund(order, now = new Date()) {
  if (order?.refundStatus === "SUCCEEDED") return false;
  const attempts = order?.refundAttempts ?? 0;
  if (attempts >= REFUND_ATTEMPT_CAP) return false;
  const wait = refundBackoffMs(attempts);
  if (wait == null) return false;
  if (attempts === 0 || !order?.refundAttemptAt) return true;
  const stamp = new Date(order.refundAttemptAt).getTime();
  const clock = now instanceof Date ? now.getTime() : new Date(now).getTime();
  return clock - stamp >= wait;
}

const OPEN_STATUSES = ["PENDING", "CONFIRMING"];

/** 주문 목록에서 한 번에 다시 묻는 오래된 주문의 상한. */
export const STALE_RECHECK_LIMIT = 3;

/**
 * 결제 건이 아직 없을 때, 결과 화면이 이 시간 뒤에도 없으면 주문을 닫는다.
 * 결제창을 막 연 직후에는 닫지 않는다.
 */
export const PAYMENT_MISSING_GRACE_MS = 60 * 1000;

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

export function isPastPaymentMissingGrace(order, now = new Date()) {
  const stamp = new Date(order.createdAt).getTime();
  const clock = now instanceof Date ? now.getTime() : new Date(now).getTime();
  return clock - stamp >= PAYMENT_MISSING_GRACE_MS;
}

/**
 * 목록 재확인에 넣을 주문만 고른다. 호출하는 쪽이 오래된 순으로 정렬해 둔다.
 *
 * @param {Array<{ updatedAt?: Date, createdAt?: Date }>} orders
 * @param {Date} [now]
 * @param {number} [limit]
 */
export function staleOrdersToRecheck(orders, now = new Date(), limit = STALE_RECHECK_LIMIT) {
  return orders.filter((order) => isOrderStale(order, now)).slice(0, limit);
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

  // 기한이 남았어도 바로 PortOne에 묻는다.
  // 결제 건이 없으면 닫고 새 주문을 만들고, 결제가 진행 중이면 그 주문으로 돌려보낸다.
  const reconciled = await reconcileOpenOrdersForCheckout(userId, options);
  if (reconciled.paidOrderId) {
    return {
      ok: false,
      status: 409,
      error: "already_paid",
      orderId: reconciled.paidOrderId,
    };
  }
  if (reconciled.resumeOrderId) {
    return {
      ok: false,
      status: 409,
      error: "payment_confirming",
      orderId: reconciled.resumeOrderId,
    };
  }

  const priced = priceLines(rows);
  const paymentId = `payment-${crypto.randomUUID()}`;

  const inserted = await insertSingleOpenOrder(userId, {
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
  });

  if (inserted.open) {
    return {
      ok: false,
      status: 409,
      error: "payment_confirming",
      orderId: inserted.open.id,
    };
  }

  return { ok: true, order: inserted.order };
}

/**
 * 열린 주문을 조회한 뒤 넣는 일을 한 트랜잭션으로 묶는다.
 * 부분 유니크 인덱스가 같은 사용자의 PENDING/CONFIRMING 두 건을 막는다.
 * PortOne HTTP는 이 잠금 안에서 하지 않는다.
 */
async function insertSingleOpenOrder(userId, data) {
  try {
    return await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`open-order:${userId}`}))::text AS locked`;
      const open = await tx.order.findFirst({
        where: { userId, status: { in: OPEN_STATUSES } },
        select: { id: true },
        orderBy: { createdAt: "desc" },
      });
      if (open) return { open };

      const order = await tx.order.create({ data, include: orderInclude });
      return { order };
    });
  } catch (error) {
    if (error?.code !== "P2002") throw error;
    const open = await prisma.order.findFirst({
      where: { userId, status: { in: OPEN_STATUSES } },
      select: { id: true },
      orderBy: { createdAt: "desc" },
    });
    if (open) return { open };
    throw error;
  }
}

async function applyDecision(order, payment, browserResult, options = {}) {
  const decision = decidePaymentUpdate(order, payment, browserResult);

  if (decision.action === "mark_paid") {
    const laterPaid = await findLaterPaidSameCart(order);
    if (laterPaid) {
      // 이미 닫힌 주문에 늦게 PAID가 오고, 같은 장바구니의 다른 주문은 결제됐다.
      // 이 결제는 배송하지 않고 전액 취소한다.
      await refundCapturedPayment(order, options, {
        failureMessage: LATE_PAID_MESSAGE,
        reason: LATE_PAID_REFUND_REASON,
      });
    } else {
      await markOrderPaid(order);
    }
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
    // 금액이 다르면 PAID로 두지 않는다. 이미 잡힌 돈은 PortOne 전액 취소로 돌린다.
    await recordAmountMismatch(order, options);
  }

  const fresh = await prisma.order.findUnique({
    where: { id: order.id },
    include: orderInclude,
  });

  return { decision, order: fresh };
}

function cartLineKey(items) {
  return [...(items ?? [])]
    .map((item) => `${item.productId}:${item.quantity}`)
    .sort()
    .join("|");
}

/**
 * 이 주문보다 나중에 만들어졌고, 같은 상품·수량으로 이미 PAID인 주문.
 * 이전 구매와 구분하려고 더 이른 주문은 보지 않는다.
 */
async function findLaterPaidSameCart(order) {
  if (order.status !== "FAILED" && order.status !== "CANCELLED") return null;
  const mine = cartLineKey(order.items);
  if (!mine) return null;

  const others = await prisma.order.findMany({
    where: {
      userId: order.userId,
      id: { not: order.id },
      status: "PAID",
      createdAt: { gte: order.createdAt },
    },
    include: { items: true },
  });
  return others.find((other) => cartLineKey(other.items) === mine) ?? null;
}

async function markOrderPaid(order) {
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
}

async function recordAmountMismatch(order, options) {
  await refundCapturedPayment(order, options, {
    failureMessage: AMOUNT_MISMATCH_MESSAGE,
    reason: REFUND_REASON,
  });
}

/**
 * 이미 잡힌 돈을 전액 취소한다. 성공한 환불은 다시 부르지 않고,
 * 실패한 환불은 횟수와 시각을 남긴 뒤 대기 시간이 지나야 다시 부른다.
 */
async function refundCapturedPayment(order, options, { failureMessage, reason }) {
  if (order.status !== "PAID") {
    await prisma.order.updateMany({
      where: {
        id: order.id,
        status: { in: ["PENDING", "CONFIRMING", "FAILED", "CANCELLED"] },
      },
      data: {
        status: "FAILED",
        failureMessage,
      },
    });
  }

  const current = await prisma.order.findUnique({ where: { id: order.id } });
  if (!current || current.status === "PAID" || current.refundStatus === "SUCCEEDED") return;

  const now = options.now ? new Date(options.now) : new Date();
  if (!canAttemptRefund(current, now)) return;

  const cancel = options.cancelPayment ?? ((paymentId) => cancelPortOnePayment(paymentId, reason));
  const attempt = {
    refundAttempts: { increment: 1 },
    refundAttemptAt: now,
  };
  try {
    await cancel(order.paymentId);
    await prisma.order.update({
      where: { id: order.id },
      data: { refundStatus: "SUCCEEDED", refundMessage: null, ...attempt },
    });
  } catch (error) {
    if (isPaymentAlreadyCancelled(error)) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          refundStatus: "SUCCEEDED",
          refundMessage: "이미 취소된 결제입니다.",
          ...attempt,
        },
      });
      return;
    }

    const message = typeof error?.message === "string" ? error.message.slice(0, 300) : "환불 요청에 실패했습니다.";
    console.error("payment refund failed", { paymentId: order.paymentId });
    await prisma.order.update({
      where: { id: order.id },
      data: { refundStatus: "FAILED", refundMessage: message, ...attempt },
    });
  }
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
 *   fetchPayment?: (paymentId: string) => Promise<unknown>,
 *   cancelPayment?: (paymentId: string) => Promise<unknown>
 * }} [options]
 * fetchPayment와 cancelPayment는 테스트에서 PortOne만 바꿔 끼울 때 쓴다. 요청 처리에서는 비워 둔다.
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
  let paymentMissing = false;
  try {
    payment = await fetchPayment(paymentId);
  } catch (error) {
    if (isPaymentNotFound(error)) {
      paymentMissing = true;
    } else {
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

  const result = await applyDecision(order, payment, browserResult, options);
  const paymentStatus = payment?.status ?? null;

  if (result.decision.action === "reject") {
    return {
      ok: false,
      status: 409,
      error: "amount_mismatch",
      paymentMissing,
      paymentStatus,
      order: result.order,
    };
  }

  if (result.order.status === "PAID") {
    return { ok: true, status: 200, paymentMissing, paymentStatus, order: result.order };
  }

  if (result.order.status === "FAILED" || result.order.status === "CANCELLED") {
    return { ok: true, status: 200, paymentMissing, paymentStatus, order: result.order };
  }

  if (source === "webhook") {
    return {
      ok: false,
      status: 409,
      error: "not_paid",
      paymentMissing,
      paymentStatus,
      order: result.order,
    };
  }

  return {
    ok: true,
    status: 200,
    error: "confirming",
    paymentMissing,
    paymentStatus,
    order: result.order,
  };
}

async function expireOrderIfStillOpen(orderId) {
  await closeOpenOrder(orderId, "FAILED", CONFIRM_EXPIRED_MESSAGE);
}

async function closeOpenOrder(orderId, status, failureMessage) {
  await prisma.order.updateMany({
    where: { id: orderId, status: { in: OPEN_STATUSES } },
    data: { status, failureMessage },
  });
}

async function mapWithCap(items, limit, worker) {
  const queue = items.slice();
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      await worker(item);
    }
  });
  await Promise.all(workers);
}

/**
 * 결제를 다시 시작하려는 사용자를 위해 열린 주문을 전부 확인한다.
 * 결제 건이 없거나 READY여도 1분이 지나기 전에는 닫지 않고 확인 화면으로 보낸다.
 *
 * @param {string} userId
 * @param {{ now?: Date, fetchPayment?: (paymentId: string) => Promise<unknown>, cancelPayment?: (paymentId: string) => Promise<unknown> }} [options]
 */
async function reconcileOpenOrdersForCheckout(userId, options = {}) {
  const now = options.now ? new Date(options.now) : new Date();
  const openOrders = await prisma.order.findMany({
    where: { userId, status: { in: OPEN_STATUSES } },
    orderBy: { createdAt: "asc" },
  });

  let paidOrderId = null;
  let resumeOrderId = null;

  for (const order of openOrders) {
    const outcome = await reconcileOneOpenOrder(order, { ...options, now });
    if (outcome === "paid") paidOrderId = order.id;
    if (outcome === "open") resumeOrderId = order.id;
  }

  return { paidOrderId, resumeOrderId };
}

async function reconcileOneOpenOrder(order, options) {
  const fetchPayment = options.fetchPayment ?? fetchPortOnePayment;
  let payment = null;

  try {
    payment = await fetchPayment(order.paymentId);
  } catch (error) {
    if (isPaymentNotFound(error)) {
      if (!isPastPaymentMissingGrace(order, options.now)) return "open";
      await closeOpenOrder(order.id, "CANCELLED", PAYMENT_NEVER_STARTED_MESSAGE);
      return "closed";
    }
    if (isOrderStale(order, options.now)) {
      await expireOrderIfStillOpen(order.id);
      return "closed";
    }
    return "open";
  }

  const result = await syncOrderPayment(order.paymentId, {
    source: "browser",
    browserResult: "returned",
    fetchPayment: async () => payment,
    cancelPayment: options.cancelPayment,
    now: options.now,
  });
  const status = result.order?.status;
  if (status === "PAID") return "paid";
  if (status === "FAILED" || status === "CANCELLED") return "closed";
  if (payment?.status === "READY" && isPastPaymentMissingGrace(order, options.now)) {
    await closeOpenOrder(order.id, "CANCELLED", PAYMENT_NOT_FINISHED_MESSAGE);
    return "closed";
  }
  if (isOrderStale(order, options.now)) {
    await expireOrderIfStillOpen(order.id);
    return "closed";
  }
  return "open";
}

/**
 * 주문 목록용. 오래된 주문만, 한 번에 STALE_RECHECK_LIMIT건까지 동시에 다시 묻는다.
 * 기한이 남은 주문은 목록을 열었다고 닫지 않는다.
 *
 * @param {string} userId
 * @param {{ now?: Date, fetchPayment?: (paymentId: string) => Promise<unknown>, limit?: number }} [options]
 */
export async function releaseStaleOpenOrders(userId, options = {}) {
  const now = options.now ? new Date(options.now) : new Date();
  const limit = options.limit ?? STALE_RECHECK_LIMIT;
  const openOrders = await prisma.order.findMany({
    where: { userId, status: { in: OPEN_STATUSES } },
    orderBy: { updatedAt: "asc" },
  });
  const stale = staleOrdersToRecheck(openOrders, now, limit);
  let paidOrderId = null;

  await mapWithCap(stale, limit, async (order) => {
    try {
      await syncOrderPayment(order.paymentId, {
        source: "browser",
        browserResult: "returned",
        fetchPayment: options.fetchPayment,
        cancelPayment: options.cancelPayment,
      });

      const current = await prisma.order.findUnique({ where: { id: order.id } });
      if (!current) return;
      if (current.status === "PAID") {
        paidOrderId = current.id;
        return;
      }
      if (current.status === "PENDING" || current.status === "CONFIRMING") {
        await expireOrderIfStillOpen(current.id);
      }
    } catch {
      console.error("stale order recheck failed", order.id);
    }
  });

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

  const synced = await syncOrderPayment(order.paymentId, {
    source: "browser",
    browserResult: "returned",
    fetchPayment: options.fetchPayment,
    cancelPayment: options.cancelPayment,
    now,
  });

  const mid = await getOwnedOrder(userId, orderId);
  if (!mid) return null;
  if (mid.status === "PENDING" || mid.status === "CONFIRMING") {
    if (stale) {
      await expireOrderIfStillOpen(mid.id);
    } else if (isPastPaymentMissingGrace(order, now) && (synced.paymentMissing || synced.paymentStatus === "READY")) {
      const message = synced.paymentStatus === "READY"
        ? PAYMENT_NOT_FINISHED_MESSAGE
        : PAYMENT_NEVER_STARTED_MESSAGE;
      await closeOpenOrder(mid.id, "CANCELLED", message);
    }
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

export async function listOrdersForAdmin() {
  return prisma.order.findMany({
    where: {
      OR: [
        { status: "PAID" },
        { refundStatus: { not: null } },
        { failureMessage: AMOUNT_MISMATCH_MESSAGE },
      ],
    },
    include: {
      ...orderInclude,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
