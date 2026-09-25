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

export function isPaymentNotFound(error) {
  return error?.data?.type === "PAYMENT_NOT_FOUND";
}
