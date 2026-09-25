import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { Webhook } from "@portone/server-sdk";
import { isAdminUser } from "./admin.js";
import { parseShippingAddress } from "./address.js";
import { calculateShippingFee } from "../config/shipping.js";
import { capQuantity, orderNameFromItems, priceLines } from "./orderMath.js";
import { decidePaymentUpdate } from "./paymentDecision.js";
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
