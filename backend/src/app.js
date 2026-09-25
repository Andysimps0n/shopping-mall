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
    limit: "100kb",
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

// 라우트가 놓친 오류도 스택이나 시크릿을 응답에 넣지 않는다.
app.use((err, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }
  if (err?.type === "entity.too.large") {
    res.status(413).json({ error: "body_too_large" });
    return;
  }
  if (err instanceof SyntaxError && err.status === 400) {
    res.status(400).json({ error: "invalid_json" });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "server_error" });
});
