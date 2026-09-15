import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";


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
app.use("/auth", authRouter);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});



