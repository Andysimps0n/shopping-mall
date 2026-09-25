import { Router } from "express";
import { Webhook } from "@portone/server-sdk";
import { syncOrderPayment, serializeOrder } from "../lib/orderStore.js";
import { requireUser } from "../lib/requireUser.js";
import { prisma } from "../../lib/prisma.js";

const router = Router();

function sendSyncResult(res, result) {
  if (!result.order) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.status(result.status).json({
    error: result.ok ? undefined : result.error,
    orderId: result.order.id,
    status: result.order.status,
    order: serializeOrder(result.order),
  });
}

// 결제창이 성공을 돌려줘도, 여기서 PortOne에 다시 물어본 뒤에만 PAID가 된다.
router.post("/complete", requireUser, async (req, res) => {
  try {
    const paymentId = req.body?.paymentId;
    if (typeof paymentId !== "string" || paymentId.length === 0) {
      res.status(400).json({ error: "payment_required" });
      return;
    }

    const browserResult = req.body?.browserResult;
    const hint =
      browserResult === "cancelled" || browserResult === "failed" || browserResult === "returned"
        ? browserResult
        : "returned";

    const owned = await prisma.order.findUnique({ where: { paymentId } });
    if (!owned || owned.userId !== req.userId) {
      res.status(404).json({ error: "not_found" });
      return;
    }

    const result = await syncOrderPayment(paymentId, {
      browserResult: hint,
      source: "browser",
    });
    sendSyncResult(res, result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "complete_failed" });
  }
});

// 손님이 창을 닫아도 PortOne이 이 주소로 결과를 보낸다.
// 서명은 express.json()이 파싱하기 전의 원문(req.rawBody)으로 확인한다.
router.post("/webhook", async (req, res) => {
  const secret = process.env.PORTONE_WEBHOOK_SECRET;
  if (!secret) {
    res.status(503).json({ error: "webhook_not_configured" });
    return;
  }
  if (typeof req.rawBody !== "string") {
    res.status(400).json({ error: "raw_body_missing" });
    return;
  }

  let webhook;
  try {
    webhook = await Webhook.verify(secret, req.rawBody, req.headers);
  } catch (err) {
    if (err instanceof Webhook.WebhookVerificationError) {
      res.status(400).json({ error: "invalid_signature" });
      return;
    }
    console.error(err);
    res.status(400).json({ error: "invalid_webhook" });
    return;
  }

  if (Webhook.isUnrecognizedWebhook(webhook) || !webhook.data || !("paymentId" in webhook.data)) {
    res.json({ ok: true, ignored: true });
    return;
  }

  try {
    const result = await syncOrderPayment(webhook.data.paymentId, {
      source: "webhook",
    });

    // 없는 주문은 우리 결제가 아니다. 재시도해도 소용이 없으니 200.
    if (result.error === "not_found") {
      res.json({ ok: true, ignored: true });
      return;
    }

    // 금액이 다르면 주문을 바꾸지 않았다. 재시도로 고쳐지지 않으므로 200으로 남긴다.
    if (result.error === "amount_mismatch") {
      res.json({ ok: true, ignored: true });
      return;
    }

    // 웹훅은 "결제됨"인데 조회가 아직 준비 중이면, PortOne이 다시 보내게 한다.
    if (result.error === "not_paid" && webhook.type === "Transaction.Paid") {
      res.status(500).json({ error: "not_paid_yet" });
      return;
    }

    if (!result.ok && result.status >= 500) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    res.json({ ok: true, status: result.order?.status ?? null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "webhook_failed" });
  }
});

export default router;
