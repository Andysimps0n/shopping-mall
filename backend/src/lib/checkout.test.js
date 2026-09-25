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
import { createOrderFromCart, syncOrderPayment } from "./orderStore.js";
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
    await prisma.$disconnect();
  }
});
