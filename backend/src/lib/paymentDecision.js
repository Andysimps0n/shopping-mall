/**
 * PortOne이 알려 준 결제와 우리 주문을 비교해, 상태를 바꿀지 결정한다.
 * 이 함수는 DB를 건드리지 않는다. 금액이 다르면 절대 PAID로 가지 않는다.
 *
 * browserResult는 결제창이 준 힌트다.
 * PortOne이 PAID / FAILED / CANCELLED라고 하면 그 값이 힌트보다 우선한다.
 *
 * @param {{ status: string, totalAmount: number }} order
 * @param {{ status?: string, currency?: string, amount?: { total?: number } } | null} payment
 * @param {"cancelled" | "failed" | "returned" | null} [browserResult]
 */
export function decidePaymentUpdate(order, payment, browserResult = null) {
  if (payment?.status === "PAID") {
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

  if (order.status === "PAID") {
    if (payment?.status === "CANCELLED") {
      return { action: "mark_cancelled" };
    }
    return { action: "none", reason: "already_paid" };
  }

  if (order.status === "FAILED" || order.status === "CANCELLED") {
    return { action: "none", reason: "already_closed" };
  }

  if (payment?.status === "FAILED") {
    return { action: "mark_failed" };
  }

  if (payment?.status === "CANCELLED") {
    return { action: "mark_cancelled" };
  }

  // 조회가 없거나 아직 준비 중이면, 손님이 창에서 취소/실패했다고 한 경우만 닫는다.
  // "성공해서 돌아옴"은 확인이 끝날 때까지 CONFIRMING으로 둔다.
  if (browserResult === "cancelled") {
    return { action: "mark_cancelled" };
  }
  if (browserResult === "failed") {
    return { action: "mark_failed" };
  }

  return { action: "none", reason: "confirming" };
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
