import crypto from "crypto";

const COOKIE_NAME = "mall_session";

function requiredSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("SESSION_SECRET missing or too short");
  }
  return s;
}

/** userId를 서명한 값으로 만듦 (간단 버전) */
export function signUserId(userId) {
  const secret = requiredSecret();
  const sig = crypto.createHmac("sha256", secret).update(userId).digest("hex");
  return `${userId}.${sig}`;
}

export function verifySignedUserId(value) {
  if (!value || !value.includes(".")) return null;
  const i = value.indexOf(".");
  const userId = value.slice(0, i);
  const sig = value.slice(i + 1);
  const expected = crypto
    .createHmac("sha256", requiredSecret())
    .update(userId)
    .digest("hex");
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }
  return userId;
}

export function setSessionCookie(res, userId) {
  res.cookie(COOKIE_NAME, signUserId(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true.
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export function readSessionUserId(req) {
  return verifySignedUserId(req.cookies?.[COOKIE_NAME] ?? "");
}

export { COOKIE_NAME };