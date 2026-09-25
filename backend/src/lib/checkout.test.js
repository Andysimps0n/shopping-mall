import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { Webhook } from "@portone/server-sdk";
import { isAdminUser } from "./admin.js";
import { parseShippingAddress } from "./address.js";
import { calculateShippingFee } from "../config/shipping.js";
import { capQuantity, orderNameFromItems, priceLines } from "./orderMath.js";
import { prisma } from "../../lib/prisma.js";
import { decidePaymentUpdate } from "./paymentDecision.js";
import { mergeCart } from "./cartStore.js";
import {
  createOrderFromCart,
  isOrderStale,
  listOrdersForAdmin,
  refreshOwnedOrder,
  staleOrdersToRecheck,
  syncOrderPayment,
} from "./orderStore.js";
import { trustProxyFromEnv } from "./trustProxy.js";
import { isPaymentId } from "./paymentId.js";
import { rateLimit } from "./rateLimit.js";
import { normalizeProductId } from "./cartStore.js";
import { safeNextPath } from "./safeNext.js";

test("shipping fee follows the config", () => {
  const free = { shippingFeeKrw: 0, freeShippingThresholdKrw: 0 };
  assert.equal(calculateShippingFee(10000, free), 0);

  const flat = { shippingFeeKrw: 3000, freeShippingThresholdKrw: 0 };
  assert.equal(calculateShippingFee(10000, flat), 3000);

  const threshold = { shippingFeeKrw: 3000, freeShippingThresholdKrw: 50000 };
  assert.equal(calculateShippingFee(49999, threshold), 3000);
  assert.equal(calculateShippingFee(50000, threshold), 0);
});

test("order totals use the database price, not a client amount", () => {
  const priced = priceLines([
    {
      product: { id: "silk-repair-shampoo", name: "앤클로이 두피 샴푸", price: 50000, clientPrice: 100 },
      quantity: 2,
    },
  ]);

  assert.equal(priced.itemsTotal, 100000);
  assert.equal(priced.items[0].unitPrice, 50000);
  assert.equal(priced.items[0].lineTotal, 100000);
  assert.equal(priced.totalAmount, priced.itemsTotal + priced.shippingFee);
});

test("quantity is capped at 99 and order name is the first product", () => {
  assert.equal(capQuantity(0), 0);
  assert.equal(capQuantity(1.9), 1);
  assert.equal(capQuantity(120), 99);
  assert.equal(
    orderNameFromItems([
      { productName: "앤클로이 두피 샴푸" },
      { productName: "다른 상품" },
    ]),
    "앤클로이 두피 샴푸",
  );
});

test("address check rejects a short phone and ignores money fields", () => {
  const bad = parseShippingAddress({
    recipientName: "김앤",
    phone: "1234",
    postalCode: "37774",
    address1: "경북 포항시 남구 대이로 45",
    payMethod: "kakaopay",
    totalAmount: 100,
  });
  assert.equal(bad.ok, false);

  const good = parseShippingAddress({
    recipientName: "김앤",
    phone: "010-1234-5678",
    postalCode: "37774",
    address1: "경북 포항시 남구 대이로 45",
    payMethod: "naverpay",
    totalAmount: 100,
  });
  assert.equal(good.ok, true);
  assert.equal(good.value.phone, "01012345678");
  assert.equal(good.value.totalAmount, undefined);
});

test("a payment is marked paid only when PortOne amount matches", () => {
  const order = { status: "PENDING", totalAmount: 50000 };

  assert.deepEqual(
    decidePaymentUpdate(order, {
      status: "PAID",
      currency: "KRW",
      amount: { total: 50000 },
    }),
    { action: "mark_paid" },
  );

  assert.equal(
    decidePaymentUpdate(order, {
      status: "PAID",
      currency: "KRW",
      amount: { total: 100 },
    }).action,
    "reject",
  );

  assert.equal(
    decidePaymentUpdate(
      { status: "PAID", totalAmount: 50000 },
      { status: "PAID", currency: "KRW", amount: { total: 50000 } },
    ).reason,
    "already_paid",
  );

  assert.equal(
    decidePaymentUpdate(order, { status: "FAILED" }).action,
    "mark_failed",
  );

  const confirming = { status: "CONFIRMING", totalAmount: 50000 };
  assert.equal(
    decidePaymentUpdate(confirming, { status: "FAILED" }).action,
    "mark_failed",
  );
  assert.equal(
    decidePaymentUpdate(confirming, { status: "CANCELLED" }).action,
    "mark_cancelled",
  );
  assert.equal(
    decidePaymentUpdate(confirming, null, "returned").reason,
    "confirming",
  );
  assert.equal(
    decidePaymentUpdate(confirming, null, "cancelled").action,
    "mark_cancelled",
  );
  assert.equal(
    decidePaymentUpdate(confirming, null, "failed").action,
    "mark_failed",
  );

  // 같은 PAID 웹훅이 다시 와도 두 번째부터는 상태가 바뀌지 않는다.
  assert.equal(
    decidePaymentUpdate(confirming, {
      status: "PAID",
      currency: "KRW",
      amount: { total: 50000 },
    }).action,
    "mark_paid",
  );
  assert.equal(
    decidePaymentUpdate(
      { status: "PAID", totalAmount: 50000 },
      { status: "PAID", currency: "KRW", amount: { total: 50000 } },
    ).action,
    "none",
  );
});

test("payment ids keep the server uuid shape", () => {
  assert.equal(isPaymentId(`payment-${crypto.randomUUID()}`), true);
  assert.equal(isPaymentId("payment-1"), false);
  assert.equal(isPaymentId(`payment-${"a".repeat(80)}`), false);
});

test("product ids that are empty or very long are dropped", () => {
  assert.equal(normalizeProductId(" silk-repair-shampoo "), "silk-repair-shampoo");
  assert.equal(normalizeProductId(""), "");
  assert.equal(normalizeProductId("x".repeat(81)), "");
  assert.equal(normalizeProductId(12), "");
});

test("rate limit stops the call after the max", () => {
  const limit = rateLimit({ windowMs: 60_000, max: 2 });
  const req = { ip: `203.0.113.${crypto.randomInt(1, 250)}` };
  const results = [];

  for (let i = 0; i < 3; i += 1) {
    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        results.push({ statusCode: this.statusCode, body });
      },
    };
    limit(req, res, () => {
      results.push({ statusCode: 200, body: { ok: true } });
    });
  }

  assert.equal(results[0].statusCode, 200);
  assert.equal(results[1].statusCode, 200);
  assert.equal(results[2].statusCode, 429);
  assert.equal(results[2].body.error, "rate_limited");
});

test("an order is stale after the confirm window", () => {
  const fresh = { updatedAt: new Date() };
  const old = { updatedAt: new Date(Date.now() - 16 * 60 * 1000) };
  assert.equal(isOrderStale(fresh), false);
  assert.equal(isOrderStale(old), true);
});

test("trust proxy stays off unless the env asks for it", () => {
  assert.equal(trustProxyFromEnv(""), false);
  assert.equal(trustProxyFromEnv("0"), false);
  assert.equal(trustProxyFromEnv("false"), false);
  assert.equal(trustProxyFromEnv("1"), 1);
  assert.equal(trustProxyFromEnv("true"), true);
});

test("next path stays on this site", () => {
  assert.equal(safeNextPath("/checkout"), "/checkout");
  assert.equal(safeNextPath("https://evil.example/checkout"), "");
  assert.equal(safeNextPath("//evil.example"), "");
});

test("admin allowlist matches id or email", () => {
  const previousIds = process.env.ADMIN_USER_IDS;
  const previousEmails = process.env.ADMIN_EMAILS;
  process.env.ADMIN_USER_IDS = "user_1";
  process.env.ADMIN_EMAILS = "Owner@Annchloe.test";

  assert.equal(isAdminUser({ id: "user_1", email: null }), true);
  assert.equal(isAdminUser({ id: "user_2", email: "owner@annchloe.test" }), true);
  assert.equal(isAdminUser({ id: "user_2", email: "guest@annchloe.test" }), false);

  process.env.ADMIN_USER_IDS = previousIds;
  process.env.ADMIN_EMAILS = previousEmails;
});

test("webhook verify accepts a real signature and rejects a bad one", async () => {
  const rawSecret = crypto.randomBytes(24);
  const secret = rawSecret.toString("base64");
  const payload = JSON.stringify({
    type: "Transaction.Paid",
    timestamp: "2026-09-25T00:00:00.000Z",
    data: {
      paymentId: "payment-1",
      storeId: "store-1",
      transactionId: "tx-1",
    },
  });
  const webhookId = "msg_test";
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signed = `${webhookId}.${timestamp}.${payload}`;
  const signature = crypto.createHmac("sha256", rawSecret).update(signed).digest("base64");
  const headers = {
    "webhook-id": webhookId,
    "webhook-timestamp": timestamp,
    "webhook-signature": `v1,${signature}`,
  };

  const webhook = await Webhook.verify(secret, payload, headers);
  assert.equal(webhook.type, "Transaction.Paid");
  assert.equal(webhook.data.paymentId, "payment-1");

  await assert.rejects(
    () => Webhook.verify(secret, payload, { ...headers, "webhook-signature": "v1,aaaa" }),
    (error) => error instanceof Webhook.WebhookVerificationError,
  );
});

test("cart is cleared only when a payment first becomes PAID", async () => {
  const stamp = `pay-review-${crypto.randomUUID()}`;
  const user = await prisma.user.create({
    data: {
      provider: "kakao",
      providerUserId: stamp,
      name: "결제확인",
    },
  });

  try {
    const product = await prisma.product.findFirst({ where: { isActive: true } });
    assert.ok(product, "seeded product missing");

    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
        items: { create: { productId: product.id, quantity: 1 } },
      },
    });

    async function makeOrder(paymentId) {
      return prisma.order.create({
        data: {
          userId: user.id,
          status: "PENDING",
          itemsTotal: product.price,
          shippingFee: 0,
          totalAmount: product.price,
          recipientName: "김앤",
          phone: "01012345678",
          postalCode: "37774",
          address1: "경북 포항시 남구 대이로 45",
          payMethod: "kakaopay",
          paymentId,
          orderName: product.name,
          items: {
            create: {
              productId: product.id,
              productName: product.name,
              unitPrice: product.price,
              quantity: 1,
              lineTotal: product.price,
            },
          },
        },
      });
    }

    async function itemCount() {
      return prisma.cartItem.count({ where: { cartId: cart.id } });
    }

    const paidPayment = {
      status: "PAID",
      currency: "KRW",
      amount: { total: product.price },
    };

    await makeOrder(`${stamp}-failed`);
    const failed = await syncOrderPayment(`${stamp}-failed`, {
      browserResult: "failed",
      source: "browser",
      fetchPayment: async () => ({ status: "FAILED" }),
    });
    assert.equal(failed.order.status, "FAILED");
    assert.equal(await itemCount(), 1);

    // 실패로 닫힌 뒤에 늦게 PAID가 와도, 다시 담은 장바구니는 남긴다.
    const latePaid = await syncOrderPayment(`${stamp}-failed`, {
      source: "webhook",
      fetchPayment: async () => paidPayment,
    });
    assert.equal(latePaid.order.status, "PAID");
    assert.equal(await itemCount(), 1);

    await makeOrder(`${stamp}-cancelled`);
    const cancelled = await syncOrderPayment(`${stamp}-cancelled`, {
      browserResult: "cancelled",
      source: "browser",
      fetchPayment: async () => {
        const error = new Error("missing");
        error.data = { type: "PAYMENT_NOT_FOUND" };
        throw error;
      },
    });
    assert.equal(cancelled.order.status, "CANCELLED");
    assert.equal(await itemCount(), 1);

    await makeOrder(`${stamp}-timeout`);
    const timedOut = await syncOrderPayment(`${stamp}-timeout`, {
      browserResult: "returned",
      source: "browser",
      fetchPayment: async () => {
        throw new Error("timeout");
      },
    });
    assert.equal(timedOut.order.status, "CONFIRMING");
    assert.equal(await itemCount(), 1);

    const blocked = await createOrderFromCart(user.id, {
      recipientName: "김앤",
      phone: "01012345678",
      postalCode: "37774",
      address1: "경북 포항시 남구 대이로 45",
      payMethod: "kakaopay",
    }, {
      fetchPayment: async () => ({ status: "READY" }),
    });
    assert.equal(blocked.ok, false);
    assert.equal(blocked.error, "payment_confirming");

    const firstPaid = await syncOrderPayment(`${stamp}-timeout`, {
      source: "webhook",
      fetchPayment: async () => paidPayment,
    });
    assert.equal(firstPaid.order.status, "PAID");
    assert.equal(await itemCount(), 0);

    await prisma.cartItem.create({
      data: { cartId: cart.id, productId: product.id, quantity: 1 },
    });
    const secondPaid = await syncOrderPayment(`${stamp}-timeout`, {
      source: "webhook",
      fetchPayment: async () => paidPayment,
    });
    assert.equal(secondPaid.order.status, "PAID");
    assert.equal(await itemCount(), 1);
  } finally {
    await prisma.order.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }
});

const shippingBody = {
  recipientName: "김앤",
  phone: "01012345678",
  postalCode: "37774",
  address1: "경북 포항시 남구 대이로 45",
  payMethod: "kakaopay",
};

async function ageOrder(orderId) {
  const old = new Date(Date.now() - 20 * 60 * 1000);
  await prisma.$executeRaw`
    UPDATE orders SET "updatedAt" = ${old} WHERE id = ${orderId}
  `;
}

test("a mismatched or stale confirmation does not block the next checkout", async () => {
  const stamp = `stuck-${crypto.randomUUID()}`;
  const user = await prisma.user.create({
    data: { provider: "kakao", providerUserId: stamp, name: "확인만료" },
  });

  try {
    const product = await prisma.product.findFirst({ where: { isActive: true } });
    assert.ok(product);
    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
        items: { create: { productId: product.id, quantity: 1 } },
      },
    });

    async function makeOrder(paymentId, status = "PENDING") {
      return prisma.order.create({
        data: {
          userId: user.id,
          status,
          itemsTotal: product.price,
          shippingFee: 0,
          totalAmount: product.price,
          recipientName: "김앤",
          phone: "01012345678",
          postalCode: "37774",
          address1: "경북 포항시 남구 대이로 45",
          payMethod: "kakaopay",
          paymentId,
          orderName: product.name,
          items: {
            create: {
              productId: product.id,
              productName: product.name,
              unitPrice: product.price,
              quantity: 1,
              lineTotal: product.price,
            },
          },
        },
      });
    }

    const mismatchId = `${stamp}-mismatch`;
    const mismatched = await makeOrder(mismatchId);
    let cancelCalls = 0;
    const mismatchPayment = {
      status: "PAID",
      currency: "KRW",
      amount: { total: product.price - 1 },
    };
    const mismatch = await syncOrderPayment(mismatchId, {
      source: "webhook",
      fetchPayment: async () => mismatchPayment,
      cancelPayment: async () => {
        cancelCalls += 1;
      },
    });
    assert.equal(mismatch.order.status, "FAILED");
    assert.equal(mismatch.error, "amount_mismatch");
    assert.equal(mismatch.order.refundStatus, "SUCCEEDED");
    assert.equal(cancelCalls, 1);
    assert.equal(await prisma.cartItem.count({ where: { cartId: cart.id } }), 1);

    await syncOrderPayment(mismatchId, {
      source: "webhook",
      fetchPayment: async () => mismatchPayment,
      cancelPayment: async () => {
        cancelCalls += 1;
      },
    });
    assert.equal(cancelCalls, 1);

    const next = await createOrderFromCart(user.id, shippingBody, {
      fetchPayment: async () => {
        throw new Error("should not look up a fresh cart");
      },
    });
    assert.equal(next.ok, true);
    assert.notEqual(next.order.paymentId, mismatched.paymentId);
    assert.equal(await prisma.order.count({ where: { userId: user.id, status: "PAID" } }), 0);

    await prisma.order.update({
      where: { id: next.order.id },
      data: { status: "CONFIRMING" },
    });
    const blocked = await createOrderFromCart(user.id, shippingBody, {
      fetchPayment: async () => ({ status: "READY" }),
    });
    assert.equal(blocked.error, "payment_confirming");
    assert.equal(blocked.orderId, next.order.id);

    await ageOrder(next.order.id);
    const afterTimeout = await createOrderFromCart(user.id, shippingBody, {
      fetchPayment: async () => {
        throw new Error("timeout");
      },
    });
    assert.equal(afterTimeout.ok, true);
    const expired = await prisma.order.findUnique({ where: { id: next.order.id } });
    assert.equal(expired.status, "FAILED");
    assert.notEqual(afterTimeout.order.id, next.order.id);
    assert.equal(await prisma.order.count({ where: { userId: user.id } }), 3);
    await prisma.order.update({
      where: { id: afterTimeout.order.id },
      data: { status: "CANCELLED" },
    });

    const paidSeed = await makeOrder(`${stamp}-late`);
    await syncOrderPayment(paidSeed.paymentId, {
      browserResult: "returned",
      fetchPayment: async () => {
        throw new Error("timeout");
      },
    });
    await ageOrder(paidSeed.id);
    const orderCountBefore = await prisma.order.count({ where: { userId: user.id } });
    const paidLate = await createOrderFromCart(user.id, shippingBody, {
      fetchPayment: async () => ({
        status: "PAID",
        currency: "KRW",
        amount: { total: product.price },
      }),
    });
    assert.equal(paidLate.error, "already_paid");
    assert.equal(paidLate.orderId, paidSeed.id);
    assert.equal(await prisma.order.count({ where: { userId: user.id } }), orderCountBefore);
    assert.equal(await prisma.cartItem.count({ where: { cartId: cart.id } }), 0);

    await prisma.cartItem.create({
      data: { cartId: cart.id, productId: product.id, quantity: 1 },
    });
    const missing = await makeOrder(`${stamp}-missing`);
    await syncOrderPayment(missing.paymentId, {
      browserResult: "returned",
      fetchPayment: async () => {
        const error = new Error("missing");
        error.data = { type: "PAYMENT_NOT_FOUND" };
        throw error;
      },
    });
    await ageOrder(missing.id);
    const refreshed = await refreshOwnedOrder(user.id, missing.id, {
      fetchPayment: async () => {
        const error = new Error("missing");
        error.data = { type: "PAYMENT_NOT_FOUND" };
        throw error;
      },
    });
    assert.equal(refreshed.status, "FAILED");
    assert.equal(refreshed.paymentId, missing.paymentId);
    const again = await refreshOwnedOrder(user.id, missing.id, {
      fetchPayment: async () => {
        throw new Error("must not create another payment");
      },
    });
    assert.equal(again.status, "FAILED");
    assert.equal(again.paymentId, missing.paymentId);
  } finally {
    await prisma.order.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }
});

test("order list rechecks only a few stale orders", () => {
  const now = new Date("2026-09-25T12:00:00Z");
  const orders = [0, 1, 2, 3, 4].map((index) => ({
    id: String(index),
    updatedAt: new Date(now.getTime() - (30 - index) * 60 * 1000),
  }));
  const picked = staleOrdersToRecheck(orders, now, 3);
  assert.deepEqual(picked.map((order) => order.id), ["0", "1", "2"]);

  const fresh = { id: "fresh", updatedAt: now };
  assert.deepEqual(staleOrdersToRecheck([fresh, orders[0]], now, 3).map((order) => order.id), ["0"]);
});

test("checkout closes an unpaid open order and a double submit stays at one open order", async () => {
  const stamp = `open-${crypto.randomUUID()}`;
  const user = await prisma.user.create({
    data: { provider: "kakao", providerUserId: stamp, name: "열린주문" },
  });

  try {
    const product = await prisma.product.findFirst({ where: { isActive: true } });
    assert.ok(product);
    await prisma.cart.create({
      data: {
        userId: user.id,
        items: { create: { productId: product.id, quantity: 1 } },
      },
    });

    const abandoned = await prisma.order.create({
      data: {
        userId: user.id,
        status: "PENDING",
        itemsTotal: product.price,
        shippingFee: 0,
        totalAmount: product.price,
        recipientName: "김앤",
        phone: "01012345678",
        postalCode: "37774",
        address1: "경북 포항시 남구 대이로 45",
        payMethod: "kakaopay",
        paymentId: `${stamp}-abandoned`,
        orderName: product.name,
        items: {
          create: {
            productId: product.id,
            productName: product.name,
            unitPrice: product.price,
            quantity: 1,
            lineTotal: product.price,
          },
        },
      },
    });

    const notFound = async () => {
      const error = new Error("missing");
      error.data = { type: "PAYMENT_NOT_FOUND" };
      throw error;
    };

    const resumed = await createOrderFromCart(user.id, shippingBody, { fetchPayment: notFound });
    assert.equal(resumed.ok, true);
    assert.notEqual(resumed.order.id, abandoned.id);
    const closed = await prisma.order.findUnique({ where: { id: abandoned.id } });
    assert.equal(closed.status, "CANCELLED");

    await prisma.order.delete({ where: { id: resumed.order.id } });

    const [first, second] = await Promise.all([
      createOrderFromCart(user.id, shippingBody, { fetchPayment: notFound }),
      createOrderFromCart(user.id, shippingBody, { fetchPayment: notFound }),
    ]);
    const openCount = await prisma.order.count({
      where: { userId: user.id, status: { in: ["PENDING", "CONFIRMING"] } },
    });
    assert.equal(openCount, 1);
    assert.ok([first, second].some((result) => result.ok));
  } finally {
    await prisma.order.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }
});

test("a missing payment on the result page closes after a short grace, and a failed refund is listed", async () => {
  const stamp = `grace-${crypto.randomUUID()}`;
  const user = await prisma.user.create({
    data: { provider: "kakao", providerUserId: stamp, name: "유예" },
  });

  try {
    const product = await prisma.product.findFirst({ where: { isActive: true } });
    assert.ok(product);

    async function makeOrder(paymentId) {
      return prisma.order.create({
        data: {
          userId: user.id,
          status: "CONFIRMING",
          itemsTotal: product.price,
          shippingFee: 0,
          totalAmount: product.price,
          recipientName: "김앤",
          phone: "01012345678",
          postalCode: "37774",
          address1: "경북 포항시 남구 대이로 45",
          payMethod: "kakaopay",
          paymentId,
          orderName: product.name,
          items: {
            create: {
              productId: product.id,
              productName: product.name,
              unitPrice: product.price,
              quantity: 1,
              lineTotal: product.price,
            },
          },
        },
      });
    }

    const notFound = async () => {
      const error = new Error("missing");
      error.data = { type: "PAYMENT_NOT_FOUND" };
      throw error;
    };

    const young = await makeOrder(`${stamp}-young`);
    const stillOpen = await refreshOwnedOrder(user.id, young.id, { fetchPayment: notFound });
    assert.equal(stillOpen.status, "CONFIRMING");
    await prisma.order.update({ where: { id: young.id }, data: { status: "FAILED" } });

    const aged = await makeOrder(`${stamp}-aged`);
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    await prisma.$executeRaw`UPDATE orders SET "createdAt" = ${twoMinutesAgo} WHERE id = ${aged.id}`;
    const closed = await refreshOwnedOrder(user.id, aged.id, { fetchPayment: notFound });
    assert.equal(closed.status, "CANCELLED");
    assert.equal(closed.paymentId, aged.paymentId);

    const mismatch = await makeOrder(`${stamp}-refund-fail`);
    const failedRefund = await syncOrderPayment(mismatch.paymentId, {
      source: "webhook",
      fetchPayment: async () => ({
        status: "PAID",
        currency: "KRW",
        amount: { total: product.price - 1 },
      }),
      cancelPayment: async () => {
        throw new Error("pg down");
      },
    });
    assert.equal(failedRefund.order.refundStatus, "FAILED");
    assert.equal(failedRefund.order.refundMessage, "pg down");

    const listed = await listOrdersForAdmin();
    assert.equal(listed.some((order) => order.id === failedRefund.order.id), true);
    assert.equal(listed.some((order) => order.id === young.id), false);
  } finally {
    await prisma.order.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }
});

test("merging the same cart twice does not double the quantity", async () => {
  const stamp = `merge-${crypto.randomUUID()}`;
  const user = await prisma.user.create({
    data: { provider: "kakao", providerUserId: stamp, name: "병합" },
  });

  try {
    const product = await prisma.product.findFirst({ where: { isActive: true } });
    assert.ok(product);

    const first = await mergeCart(user.id, [{ productId: product.id, quantity: 2 }]);
    const second = await mergeCart(user.id, [{ productId: product.id, quantity: 2 }]);
    assert.equal(first.items[0].quantity, 2);
    assert.equal(second.items[0].quantity, 2);

    const smaller = await mergeCart(user.id, [{ productId: product.id, quantity: 1 }]);
    assert.equal(smaller.items[0].quantity, 2);

    const larger = await mergeCart(user.id, [{ productId: product.id, quantity: 4 }]);
    assert.equal(larger.items[0].quantity, 4);
  } finally {
    await prisma.user.delete({ where: { id: user.id } });
  }
});

test.after(async () => {
  await prisma.$disconnect();
});
