import { Router } from "express";
import {
  addCartItem,
  getCart,
  mergeCart,
  normalizeProductId,
  quoteItems,
  removeCartItem,
  setCartItemQuantity,
} from "../lib/cartStore.js";
import { requireUser } from "../lib/requireUser.js";

const router = Router();

function readProductId(value) {
  return normalizeProductId(value);
}

// 로그인 전 장바구니 화면이 최신 DB 가격을 물을 때 쓴다. 저장하지 않는다.
router.post("/quote", async (req, res) => {
  try {
    const cart = await quoteItems(req.body?.items);
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "quote_failed" });
  }
});

router.use(requireUser);

router.get("/", async (req, res) => {
  try {
    res.json(await getCart(req.userId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "cart_failed" });
  }
});

router.post("/items", async (req, res) => {
  try {
    const productId = readProductId(req.body?.productId);
    if (!productId) {
      res.status(400).json({ error: "product_required" });
      return;
    }

    const cart = await addCartItem(req.userId, productId, req.body?.quantity ?? 1);
    if (!cart) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "cart_failed" });
  }
});

router.post("/merge", async (req, res) => {
  try {
    const cart = await mergeCart(req.userId, req.body?.items);
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "merge_failed" });
  }
});

router.patch("/items/:productId", async (req, res) => {
  try {
    const productId = readProductId(req.params.productId);
    if (!productId) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    const cart = await setCartItemQuantity(
      req.userId,
      productId,
      req.body?.quantity,
    );
    if (!cart) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "cart_failed" });
  }
});

router.delete("/items/:productId", async (req, res) => {
  try {
    const productId = readProductId(req.params.productId);
    if (!productId) {
      res.json(await getCart(req.userId));
      return;
    }
    res.json(await removeCartItem(req.userId, productId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "cart_failed" });
  }
});

export default router;
