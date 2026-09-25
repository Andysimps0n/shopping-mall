import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { isAdminUser } from "../lib/admin.js";
import { listOrdersForAdmin, serializeOrder } from "../lib/orderStore.js";
import { requireUser } from "../lib/requireUser.js";

const router = Router();

async function requireAdmin(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true },
    });

    if (!user || !isAdminUser(user)) {
      res.status(403).json({ error: "forbidden" });
      return;
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "admin_failed" });
  }
}

router.use(requireUser);
router.use(requireAdmin);

router.get("/orders", async (req, res) => {
  try {
    const orders = await listOrdersForAdmin();
    res.json({
      orders: orders.map((order) =>
        serializeOrder(order, {
          buyerName: order.user?.name ?? null,
          buyerEmail: order.user?.email ?? null,
        }),
      ),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "admin_orders_failed" });
  }
});

export default router;
