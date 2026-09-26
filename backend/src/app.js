import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import addressesRouter from "./routes/addresses.js";
import ordersRouter from "./routes/orders.js";
import paymentsRouter from "./routes/payments.js";
import adminRouter from "./routes/admin.js";
import configRouter from "./routes/config.js";
import { trustProxyFromEnv } from "./lib/trustProxy.js";

export const app = express();

// 기본은 끈다. 배포에서 프록시가 하나면 TRUST_PROXY=1.
// 켜야 req.ip가 손님 IP가 되고, 요청 제한이 프록시 IP 하나로 뭉치지 않는다.
app.set("trust proxy", trustProxyFromEnv());

// 브라우저는 localhost 와 127.0.0.1 을 다른 사이트로 본다.
// 주소창만 바꿔 열어도 가격 요청이 막히지 않게 둘 다 허용한다.
function isAllowedFrontendOrigin(origin) {
  const configured = process.env.FRONTEND_URL || "http://localhost:3000";
  if (origin === configured) return true;

  try {
    const url = new URL(origin);
    const loopback = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    return loopback && url.port === "3000";
  } catch {
    return false;
  }
}

// Next.js 가 세션 쿠키를 실어 API를 부른다. Origin 이 없으면 curl·서버 요청이다.
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || isAllowedFrontendOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
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
app.use("/addresses", addressesRouter);
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
