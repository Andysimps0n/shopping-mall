export const ORDER_STATUS_LABELS = {
  PENDING: "결제 대기",
  CONFIRMING: "결제 확인 중",
  PAID: "결제 완료",
  FAILED: "결제 실패",
  CANCELLED: "결제 취소",
};

export const PAY_METHOD_LABELS = {
  kakaopay: "카카오페이",
  naverpay: "네이버페이",
};

export function formatOrderDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function orderStatusLabel(status) {
  return ORDER_STATUS_LABELS[status] ?? status;
}
