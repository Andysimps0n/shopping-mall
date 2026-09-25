import { readSessionUserId } from "./session.js";

/** 세션 쿠키에서 userId를 읽는다. 본문은 믿지 않는다. */
export function requireUser(req, res, next) {
  try {
    const userId = readSessionUserId(req);
    if (!userId) {
      res.status(401).json({ error: "login_required" });
      return;
    }
    req.userId = userId;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "session_failed" });
  }
}
