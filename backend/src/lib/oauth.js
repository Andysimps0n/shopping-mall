function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

/**
 * 토큰 교환이 실패하면 응답 본문 전체를 에러에 담지 않는다.
 * 그 본문에 토큰이나 시크릿이 섞일 수 있다. 코드 이름만 로그에 남긴다.
 */
function failProvider(provider, response, data) {
  const code = typeof data?.error === "string" ? data.error.slice(0, 64) : "";
  console.error(`${provider} request failed`, { status: response.status, code });
  const error = new Error(`${provider}_request_failed`);
  error.code = `${provider}_request_failed`;
  throw error;
}

/** 브라우저를 카카오 로그인 화면으로 보낼 주소. state는 로그인 CSRF를 막는다. */
export function getKakaoAuthorizeUrl(state) {
  const params = new URLSearchParams({
    client_id: required("KAKAO_CLIENT_ID"),
    redirect_uri: required("KAKAO_REDIRECT_URI"),
    response_type: "code",
    state,
  });
  return `https://kauth.kakao.com/oauth/authorize?${params}`;
}

/** code → access_token */
export async function exchangeKakaoCode(code) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: required("KAKAO_CLIENT_ID"),
    client_secret: required("KAKAO_CLIENT_SECRET"),
    redirect_uri: required("KAKAO_REDIRECT_URI"),
    code,
  });

  const res = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  if (!res.ok) failProvider("kakao", res, data);
  return data.access_token;
}

/** access_token → 우리 User에 넣을 형태 */
export async function fetchKakaoProfile(accessToken) {
  const res = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) failProvider("kakao", res, data);

  const account = data.kakao_account ?? {};
  const profile = account.profile ?? {};

  return {
    provider: "kakao",
    providerUserId: String(data.id),
    email: account.email ?? null,
    name: profile.nickname ?? null,
    avatarUrl: profile.profile_image_url ?? profile.thumbnail_image_url ?? null,
  };
}

/** 네이버 로그인 화면 주소 (+ state) */
export function getNaverAuthorizeUrl(state) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: required("NAVER_CLIENT_ID"),
    redirect_uri: required("NAVER_REDIRECT_URI"),
    state,
  });
  return `https://nid.naver.com/oauth2.0/authorize?${params}`;
}

export async function exchangeNaverCode(code, state) {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: required("NAVER_CLIENT_ID"),
    client_secret: required("NAVER_CLIENT_SECRET"),
    code,
    state,
  });

  const res = await fetch(`https://nid.naver.com/oauth2.0/token?${params}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok || data.error) failProvider("naver", res, data);
  return data.access_token;
}

export async function fetchNaverProfile(accessToken) {
  const res = await fetch("https://openapi.naver.com/v1/nid/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok || data.resultcode !== "00") failProvider("naver", res, data);

  const r = data.response ?? {};
  return {
    provider: "naver",
    providerUserId: String(r.id),
    email: r.email ?? null,
    name: r.name ?? r.nickname ?? null,
    avatarUrl: r.profile_image ?? null,
  };
}