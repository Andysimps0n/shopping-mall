import { Router } from "express";
import { shippingSettings } from "../config/shipping.js";

const router = Router();

router.get("/shipping", (req, res) => {
  res.json(shippingSettings());
});

export default router;
