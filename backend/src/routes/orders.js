import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import {
  createOrderFromCart,
  getOwnedOrder,
  listOwnedOrders,
  serializeOrder,
} from "../lib/orderStore.js";
import { requireUser } from "../lib/requireUser.js";
import { rateLimit } from "../lib/rateLimit.js";

const router = Router();

const LOGIN_KINDS = new Set(["prompted", "resumed"]);
const limitCheckoutLogin = rateLimit({ windowMs: 60_000, max: 20 });
const limitCreateOrder = rateLimit({ windowMs: 60_000, max: 20 });

function readOrderId(value) {
  if (typeof value !== "string") return "";
  const id = value.trim();
  if (id.length < 1 || id.length > 64) return "";
  return id;
}

// 결제 직전 로그인으로 보냈는지, 돌아왔는지만 센다. 누가 이탈했는지는 저장하지 않는다.
router.post("/checkout-login", limitCheckoutLogin, async (req, res) => {
  try {
    const kind = req.body?.kind;
    if (!LOGIN_KINDS.has(kind)) {
      res.status(400).json({ error: "kind_invalid" });
      return;
    }

    await prisma.checkoutLoginEvent.create({ data: { kind } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "event_failed" });
  }
});

router.use(requireUser);

router.get("/", async (req, res) => {
  try {
    const orders = await listOwnedOrders(req.userId);
    res.json({ orders: orders.map((order) => serializeOrder(order)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "orders_failed" });
  }
});

router.post("/", limitCreateOrder, async (req, res) => {
  try {
    const result = await createOrderFromCart(req.userId, req.body);
    if (!result.ok) {
      res.status(result.status).json({
        error: result.error,
        orderId: result.orderId,
      });
      return;
    }

    res.status(201).json(serializeOrder(result.order));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "order_failed" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const orderId = readOrderId(req.params.id);
    if (!orderId) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    const order = await getOwnedOrder(req.userId, orderId);
    if (!order) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.json({ order: serializeOrder(order) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "orders_failed" });
  }
});

export default router;
