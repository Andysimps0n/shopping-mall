import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";

import { Router } from 'express';
import {prisma} from '../lib/prisma.js';

const router = Router();

export const app = express();

// Next.js (localhost:3000) will call this API with cookies later
// (login session). credentials: true lets the browser send them.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/products", router)

app.use("/auth", authRouter);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});




// List is registered before /:id so "products" is never treated as an id.
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      select: { id: true, price: true },
    });
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed reading" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      select: { id: true, price: true },
    });
    if (!product) return res.status(404).json({ error: "not_found" });
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed reading" });
  }
});

export default router


