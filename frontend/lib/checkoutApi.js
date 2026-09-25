import { API_BASE_URL } from "./auth";
import { classifyBrowserResult } from "./portoneCheckout";

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function recordCheckoutLogin(kind) {
  try {
    await fetch(`${API_BASE_URL}/orders/checkout-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind }),
    });
  } catch {
    // 이탈 기록이 실패해도 로그인 이동은 계속한다.
  }
}

export async function createOrder(address) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(address),
  });
  const data = await readJson(response);
  return { ok: response.ok, data };
}

export async function completePayment(paymentId, browserResult) {
  const response = await fetch(`${API_BASE_URL}/payments/complete`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentId, browserResult }),
  });
  const data = await readJson(response);
  return { ok: response.ok, data };
}

/**
 * 결제창 결과로 이동할 주소.
 * 브라우저가 성공이라고 해도, 서버가 PAID라고 한 뒤에만 완료 화면으로 간다.
 * 확인이 끝나지 않으면 실패 화면이 아니라 "확인 중" 상태로 남긴다.
 */
export async function finishBrowserPayment({ paymentId, code, message, pgMessage }) {
  const browserResult = classifyBrowserResult({ code, message, pgMessage });
  const result = await completePayment(paymentId, browserResult);
  const orderId = result.data?.orderId;
  const status = result.data?.status;
  const rawMessage = pgMessage || message || "";

  if (!orderId) return "/cart";

  if (status === "PAID") {
    return `/orders/${orderId}/complete`;
  }

  const query = new URLSearchParams();
  if (rawMessage && status !== "CONFIRMING") query.set("message", rawMessage);
  const suffix = query.toString() ? `?${query}` : "";
  return `/orders/${orderId}/fail${suffix}`;
}

export async function fetchOrder(orderId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/orders/${encodeURIComponent(orderId)}`,
      { credentials: "include" },
    );
    if (response.status === 401) return { error: "login" };
    if (response.status === 404) return { error: "missing" };
    if (!response.ok) return { error: "failed" };
    const data = await readJson(response);
    return { order: data?.order ?? null };
  } catch {
    return { error: "failed" };
  }
}

export async function fetchMyOrders() {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      credentials: "include",
    });
    if (response.status === 401) return { error: "login" };
    if (!response.ok) return { error: "failed" };
    const data = await readJson(response);
    return { orders: data?.orders ?? [] };
  } catch {
    return { error: "failed" };
  }
}

export async function fetchAdminOrders() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/orders`, {
      credentials: "include",
    });
    if (response.status === 401) return { error: "login" };
    if (response.status === 403) return { error: "forbidden" };
    if (!response.ok) return { error: "failed" };
    const data = await readJson(response);
    return { orders: data?.orders ?? [] };
  } catch {
    return { error: "failed" };
  }
}
