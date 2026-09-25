/**
 * PortOne이 알려 준 결제와 우리 주문을 비교해, 상태를 바꿀지 결정한다.
 * 이 함수는 DB를 건드리지 않는다. 금액이 다르면 절대 PAID로 가지 않는다.
 *
 * @param {{ status: string, totalAmount: number }} order
 * @param {{ status?: string, currency?: string, amount?: { total?: number } } | null} payment
 */
export function decidePaymentUpdate(order, payment) {
  if (!payment) {
    return { action: "none", reason: "missing_payment" };
  }

  if (payment.status === "PAID") {
    const amountMatches =
      payment.currency === "KRW" && payment.amount?.total === order.totalAmount;

    if (!amountMatches) {
      return { action: "reject", reason: "amount_mismatch" };
    }
    if (order.status === "PAID") {
      return { action: "none", reason: "already_paid" };
    }
    return { action: "mark_paid" };
  }

  if (payment.status === "FAILED" && order.status === "PENDING") {
    return { action: "mark_failed" };
  }

  if (
    payment.status === "CANCELLED" &&
    (order.status === "PENDING" || order.status === "PAID")
  ) {
    return { action: "mark_cancelled" };
  }

  if (order.status === "PAID") {
    return { action: "none", reason: "already_paid" };
  }

  return { action: "none", reason: "waiting" };
}

/**
 * 결제 조회 결과에서 손님에게 그대로 보여줄 PG 메시지.
 * 앞에 설명을 붙이지 않는다. 네이버페이는 이 문장을 가공하지 말라고 한다.
 *
 * @param {{ failure?: { pgMessage?: string, reason?: string } } | null} payment
 */
export function rawFailureMessage(payment) {
  const message = payment?.failure?.pgMessage || payment?.failure?.reason || "";
  if (typeof message !== "string") return "";
  return message.slice(0, 300);
}
