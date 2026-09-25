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

async function applyDecision(order, payment) {
  const decision = decidePaymentUpdate(order, payment);

  if (decision.action === "mark_paid") {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.order.updateMany({
        where: { id: order.id, status: { not: "PAID" } },
        data: {
          status: "PAID",
          paidAt: new Date(),
          failureMessage: null,
        },
      });

      // 같은 완료 요청과 웹훅이 겹쳐도, 처음 한 번만 장바구니를 비운다.
      if (updated.count === 1) {
        const cart = await tx.cart.findUnique({ where: { userId: order.userId } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      }
    });
  } else if (decision.action === "mark_failed" || decision.action === "mark_cancelled") {
    const status = decision.action === "mark_failed" ? "FAILED" : "CANCELLED";
    await prisma.order.updateMany({
      where: {
        id: order.id,
        status: status === "CANCELLED" ? { in: ["PENDING", "PAID"] } : "PENDING",
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
 * 이미 PAID면 다시 처리하지 않는다.
 */
export async function syncOrderPayment(paymentId) {
  const order = await prisma.order.findUnique({
    where: { paymentId },
    include: orderInclude,
  });

  if (!order) {
    return { ok: false, status: 404, error: "not_found" };
  }

  let payment;
  try {
    payment = await fetchPortOnePayment(paymentId);
  } catch (error) {
    if (error?.code === "portone_not_configured") {
      return { ok: false, status: 503, error: "portone_not_configured", order };
    }
    if (isPaymentNotFound(error)) {
      return {
        ok: false,
        status: 409,
        error: "payment_not_found",
        order,
      };
    }
    throw error;
  }

  const result = await applyDecision(order, payment);

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

  if (result.decision.action === "mark_failed" || result.decision.action === "mark_cancelled") {
    return { ok: true, status: 200, order: result.order };
  }

  return {
    ok: false,
    status: 409,
    error: "not_paid",
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
