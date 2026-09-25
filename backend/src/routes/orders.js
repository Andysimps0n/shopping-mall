import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import {
  createOrderFromCart,
  getOwnedOrder,
  listOwnedOrders,
  serializeOrder,
} from "../lib/orderStore.js";
import { requireUser } from "../lib/requireUser.js";

const router = Router();

const LOGIN_KINDS = new Set(["prompted", "resumed"]);

// 결제 직전 로그인으로 보냈는지, 돌아왔는지만 센다. 누가 이탈했는지는 저장하지 않는다.
router.post("/checkout-login", async (req, res) => {
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

router.post("/", async (req, res) => {
  try {
    const result = await createOrderFromCart(req.userId, req.body);
    if (!result.ok) {
      res.status(result.status).json({ error: result.error });
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
    const order = await getOwnedOrder(req.userId, req.params.id);
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
