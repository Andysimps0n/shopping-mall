import { Router } from "express";
import { upsertSocialUser } from "../lib/users.js";
import { prisma } from "../../lib/prisma.js";

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



const router = Router();

function redirectToStorefront(res) {
  const origin = process.env.FRONTEND_URL || "http://localhost:3000";
  // Login finishes on the profile page, which is also where logout lives.
  res.redirect(new URL("/profile", origin).href);
}

// 1) 카카오 로그인 시작 → 카카오 사이트로 보냄
router.get("/kakao", (req, res) => {
  res.redirect(getKakaoAuthorizeUrl());
});

// 2) 카카오가 code를 들고 여기로 돌려보냄
router.get("/kakao/callback", async (req, res) => {
  try {
    const { code, error } = req.query;
    if (error) return res.status(400).json({ error });
    if (!code) return res.status(400).json({ error: "missing code" });

    const accessToken = await exchangeKakaoCode(String(code));
    const profile = await fetchKakaoProfile(accessToken);
    const user = await upsertSocialUser(profile);

    setSessionCookie(res, user.id);
    redirectToStorefront(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "kakao_login_failed", detail: String(err.message) });
  }
});

// 3) 네이버 시작 (state를 쿠키에 잠깐 저장)
router.get("/naver", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  res.cookie("oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
  });
  res.redirect(getNaverAuthorizeUrl(state));
});

router.get("/naver/callback", async (req, res) => {
  try {
    const { code, state, error } = req.query;
    if (error) return res.status(400).json({ error });
    if (!code || !state) return res.status(400).json({ error: "missing code/state" });
    if (state !== req.cookies.oauth_state) {
      return res.status(400).json({ error: "invalid_state" });
    }

    const accessToken = await exchangeNaverCode(String(code), String(state));
    const profile = await fetchNaverProfile(accessToken);
    const user = await upsertSocialUser(profile);

    res.clearCookie("oauth_state");
    setSessionCookie(res, user.id);
    redirectToStorefront(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "naver_login_failed", detail: String(err.message) });
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
    res.json({ user: user ?? null });
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