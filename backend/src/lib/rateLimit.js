/**
 * 한 프로세스 안의 IP별 요청 제한.
 * 제한기마다 통을 따로 둔다. 로그인 횟수가 결제 횟수와 섞이지 않게.
 * req.ip를 쓴다. TRUST_PROXY가 꺼져 있으면 소켓 주소이고, 켜져 있으면 Express가 신뢰하는 홉까지만 헤더를 본다.
 *
 * @param {{ windowMs: number, max: number }} options
 */
export function rateLimit({ windowMs, max }) {
  const buckets = new Map();

  return function limitRequests(req, res, next) {
    const now = Date.now();
    if (buckets.size > 4000) {
      for (const [key, bucket] of buckets) {
        if (now >= bucket.resetAt) buckets.delete(key);
      }
    }

    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    let bucket = buckets.get(ip);

    if (!bucket || now >= bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(ip, bucket);
    }

    bucket.count += 1;
    if (bucket.count > max) {
      res.status(429).json({ error: "rate_limited" });
      return;
    }

    next();
  };
}
