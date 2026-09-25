import { Router } from "express";
import { upsertSocialUser } from "../lib/users.js";
import { prisma } from "../../lib/prisma.js";
import { rateLimit } from "../lib/rateLimit.js";

import crypto from "crypto";
import {
  getKakaoAuthorizeUrl,
  exchangeKakaoCode,
  fetchKakaoProfile,
  getNaverAuthorizeUrl,
  exchangeNaverCode,
  fetchNaverProfile,
} from "../lib/oauth.js";

import {
  setSessionCookie,
  clearSessionCookie,
  readSessionUserId,
} from "../lib/session.js";
import { safeNextPath } from "../lib/safeNext.js";
import { isAdminUser } from "../lib/admin.js";

const router = Router();
const NEXT_COOKIE = "oauth_next";
const STATE_COOKIE = "oauth_state";

// 로그인 시작과 콜백은 비밀번호가 없어도 남용될 수 있어서 같은 제한을 둔다.
router.use(rateLimit({ windowMs: 60_000, max: 30 }));

function oauthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60 * 1000,
  };
}

function clearOauthCookie(res, name) {
  const options = oauthCookieOptions();
  delete options.maxAge;
  res.clearCookie(name, options);
}

function statesMatch(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;
  const given = Buffer.from(left);
  const saved = Buffer.from(right);
  if (given.length === 0 || given.length !== saved.length) return false;
  return crypto.timingSafeEqual(given, saved);
}

function rememberState(res) {
  const state = crypto.randomBytes(16).toString("hex");
  res.cookie(STATE_COOKIE, state, oauthCookieOptions());
  return state;
}

function rememberNextPath(req, res) {
  const next = safeNextPath(req.query.next);
  if (next) {
    res.cookie(NEXT_COOKIE, next, oauthCookieOptions());
    return;
  }
  clearOauthCookie(res, NEXT_COOKIE);
}

function failOauth(res, status, error) {
  clearOauthCookie(res, STATE_COOKIE);
  res.status(status).json({ error });
}

function redirectToStorefront(req, res) {
  const origin = process.env.FRONTEND_URL || "http://localhost:3000";
  const next = safeNextPath(req.cookies?.[NEXT_COOKIE]) || "/profile";
  clearOauthCookie(res, NEXT_COOKIE);
  res.redirect(new URL(next, origin).href);
}

// 1) 카카오 로그인 시작 → 카카오 사이트로 보냄
router.get("/kakao", (req, res) => {
  rememberNextPath(req, res);
  const state = rememberState(res);
  res.redirect(getKakaoAuthorizeUrl(state));
});

// 2) 카카오가 code를 들고 여기로 돌려보냄
router.get("/kakao/callback", async (req, res) => {
  try {
    const { code, state, error } = req.query;
    if (error) return failOauth(res, 400, "kakao_login_denied");
    if (typeof code !== "string" || code.length === 0) {
      return failOauth(res, 400, "missing_code");
    }
    if (!statesMatch(state, req.cookies?.[STATE_COOKIE])) {
      return failOauth(res, 400, "invalid_state");
    }

    const accessToken = await exchangeKakaoCode(code);
    const profile = await fetchKakaoProfile(accessToken);
    const user = await upsertSocialUser(profile);

    clearOauthCookie(res, STATE_COOKIE);
    setSessionCookie(res, user.id);
    redirectToStorefront(req, res);
  } catch (err) {
    console.error(err);
    failOauth(res, 500, "kakao_login_failed");
  }
});

// 3) 네이버 시작 (state를 쿠키에 잠깐 저장)
router.get("/naver", (req, res) => {
  rememberNextPath(req, res);
  const state = rememberState(res);
  res.redirect(getNaverAuthorizeUrl(state));
});

router.get("/naver/callback", async (req, res) => {
  try {
    const { code, state, error } = req.query;
    if (error) return failOauth(res, 400, "naver_login_denied");
    if (typeof code !== "string" || code.length === 0 || typeof state !== "string") {
      return failOauth(res, 400, "missing_code_or_state");
    }
    if (!statesMatch(state, req.cookies?.[STATE_COOKIE])) {
      return failOauth(res, 400, "invalid_state");
    }

    const accessToken = await exchangeNaverCode(code, state);
    const profile = await fetchNaverProfile(accessToken);
    const user = await upsertSocialUser(profile);

    clearOauthCookie(res, STATE_COOKIE);
    setSessionCookie(res, user.id);
    redirectToStorefront(req, res);
  } catch (err) {
    console.error(err);
    failOauth(res, 500, "naver_login_failed");
  }
});



router.get("/me", async (req, res) => {
  try {
    const userId = readSessionUserId(req);
    if (!userId) return res.json({ user: null });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        provider: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    });
    if (!user) {
      res.json({ user: null });
      return;
    }
    res.json({ user: { ...user, isAdmin: isAdminUser(user) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "me_failed" });
  }
});

router.post("/logout", (req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});


export default router;