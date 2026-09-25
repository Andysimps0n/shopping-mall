import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import ordersRouter from "./routes/orders.js";
import paymentsRouter from "./routes/payments.js";
import adminRouter from "./routes/admin.js";
import configRouter from "./routes/config.js";

export const app = express();

// Next.js (localhost:3000) calls this API with the session cookie.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// PortOne 웹훅 서명은 파싱 전 원문이 필요하다.
// verify 콜백은 express.json()이 본문을 객체로 바꾸기 전에 글자를 보관한다.
app.use(
  express.json({
    verify(req, _res, buf) {
      req.rawBody = buf.toString("utf8");
    },
  }),
);
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);
app.use("/payments", paymentsRouter);
app.use("/admin", adminRouter);
app.use("/config", configRouter);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});
