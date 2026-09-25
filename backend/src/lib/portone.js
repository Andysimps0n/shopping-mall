import { PaymentClient } from "@portone/server-sdk";

let client;

function getClient() {
  const secret = process.env.PORTONE_API_SECRET;
  if (!secret) {
    const error = new Error("PORTONE_API_SECRET missing");
    error.code = "portone_not_configured";
    throw error;
  }

  if (!client) {
    client = PaymentClient({ secret });
  }
  return client;
}

/**
 * 브라우저가 아니라 PortOne 서버에 직접 결제 건을 물어본다.
 *
 * @param {string} paymentId
 */
export async function fetchPortOnePayment(paymentId) {
  return getClient().getPayment({ paymentId });
}

/**
 * 전액 취소. amount를 비우면 PortOne이 남은 금액을 모두 취소한다.
 * 테스트는 orderStore에 cancelPayment를 넘겨 이 함수를 부르지 않는다.
 *
 * @param {string} paymentId
 * @param {string} reason
 */
export async function cancelPortOnePayment(paymentId, reason) {
  return getClient().cancelPayment({ paymentId, reason });
}

export function isPaymentNotFound(error) {
  return error?.data?.type === "PAYMENT_NOT_FOUND";
}

export function isPaymentAlreadyCancelled(error) {
  return error?.data?.type === "PAYMENT_ALREADY_CANCELLED";
}
