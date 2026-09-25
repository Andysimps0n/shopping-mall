import { Router } from "express";
import { prisma } from "../../lib/prisma.js";

const router = Router();

const publicProduct = {
  id: true,
  name: true,
  price: true,
  imageUrl: true,
};

// `/` 를 `/:id` 보다 먼저 둔다. "ids" 가 상품 id로 오해되지 않게.
router.get("/", async (req, res) => {
  try {
    const idsParam = typeof req.query.ids === "string" ? req.query.ids : "";
    const ids = idsParam
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0 && id.length <= 80)
      .slice(0, 50);

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(ids.length > 0 ? { id: { in: ids } } : {}),
      },
      select: publicProduct,
      orderBy: { id: "asc" },
    });

    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed_reading" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productId = typeof req.params.id === "string" ? req.params.id : "";
    if (productId.length === 0 || productId.length > 80) {
      res.status(404).json({ error: "not_found" });
      return;
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true },
      select: publicProduct,
    });

    if (!product) {
      res.status(404).json({ error: "not_found" });
      return;
    }

    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed_reading" });
  }
});

export default router;
