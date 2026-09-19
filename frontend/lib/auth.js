/**
 * Login-page copy, Kakao / Naver start URLs, and session helpers.
 * Keep claims and contact details in sync with brand.js —
 * this file is the account-type labels, login-method wording,
 * the backend URL the login buttons navigate to, and /auth/me + /auth/logout.
 */

/** @typedef {"consumer" | "b2b"} AccountType */

/**
 * @typedef {object} LoginAccount
 * @property {AccountType} id
 * @property {string} label     세그먼트 버튼에 보이는 짧은 이름
 * @property {string} lead      선택했을 때 제목 아래 설명
 * @property {string} emailLabel
 * @property {string} [footnoteBefore]
 * @property {string} [footnoteAfter]
 */

/** @type {LoginAccount[]} */
export const loginAccounts = [
  {
    id: "consumer",
    label: "일반 구매자",
    lead: "네이버, 카카오, 구글, 또는 이메일로 앤클로이에 로그인하세요.",
    emailLabel: "이메일",
  },
  {
    id: "b2b",
    label: "B2B 전용",
    lead: "살롱과 도매 파트너 전용 계정입니다.",
    emailLabel: "파트너 이메일",
    footnoteBefore: "파트너 가입은",
    footnoteAfter: "으로 문의해 주세요.",
  },
];

export const DEFAULT_ACCOUNT_TYPE = "consumer";

export const loginCopy = {
  eyebrow: "ACCOUNT",
  heading: "로그인",
  accountGroupLabel: "계정 유형",
  naver: "네이버로 로그인",
  kakao: "카카오로 로그인",
  google: "구글로 로그인",
  divider: "또는",
  passwordLabel: "비밀번호",
  emailPlaceholder: "이메일 주소",
  passwordPlaceholder: "비밀번호",
  submit: "이메일로 로그인",
};

/** Express API origin. NEXT_PUBLIC_ is required for the browser to see it. */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/**
 * Backend route that redirects the browser to Kakao or Naver.
 * This must be a full page navigation (not fetch) so the user actually
 * lands on the provider login screen.
 *
 * @param {"kakao" | "naver"} provider
 */
export function getSocialLoginStartUrl(provider) {
  if (provider !== "kakao" && provider !== "naver") {
    throw new Error(`Unsupported provider: ${provider}`);
  }
  return `${API_BASE_URL}/auth/${provider}`;
}

/**
 * Ask the API who the mall_session cookie belongs to.
 * credentials: "include" is required so the browser actually sends that cookie
 * to localhost:4000 (a different origin from the Next.js app).
 *
 * @returns {Promise<{id: string, provider: string, name: string|null, email: string|null, avatarUrl: string|null}|null>}
 */
export async function fetchCurrentUser() {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

/** Tell the API to clear mall_session. Same credentials rule as fetchCurrentUser. */
export async function logout() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Header still treats the shopper as logged out locally.
  }
}

/**
 * @param {AccountType} id
 * @returns {LoginAccount}
 */
export function getLoginAccount(id) {
  return loginAccounts.find((account) => account.id === id) ?? loginAccounts[0];
}
