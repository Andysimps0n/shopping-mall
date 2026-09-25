// 서버가 만드는 결제 번호. 손님이 다른 주문의 번호를 붙여 보내지 못하게 형식부터 거른다.
const PAYMENT_ID_PATTERN =
  /^payment-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isPaymentId(value) {
  return typeof value === "string" && PAYMENT_ID_PATTERN.test(value);
}
