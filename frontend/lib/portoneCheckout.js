/** 네이버페이 결제형의 최소 금액. 문서에 적힌 100원 미만은 결제창을 열지 않는다. */
export const NAVER_PAY_MIN_KRW = 100;

/**
 * PortOne 결제창에 넘길 요청.
 * 금액과 paymentId는 방금 서버가 만든 주문에서만 가져온다.
 *
 * 통화는 현재 SDK 기준 `KRW`다. 로드맵 초안의 `CURRENCY_KRW`는 쓰지 않는다.
 * 카카오페이·네이버페이 문서도 `KRW`가 아니면 오류라고 적혀 있다.
 */
export function buildPortOnePaymentRequest({
  order,
  payMethod,
  storeId,
  channelKey,
  customer,
  redirectUrl,
}) {
  const request = {
    storeId,
    channelKey,
    paymentId: order.paymentId,
    orderName: order.orderName,
    totalAmount: order.totalAmount,
    currency: "KRW",
    payMethod: "EASY_PAY",
    customer,
    redirectUrl,
  };

  if (payMethod === "naverpay") {
    request.bypass = {
      naverpay: {
        deliveryFee: order.shippingFee,
        productItems: order.items.map((item) => ({
          // 실가맹 심사 때 네이버 상품 분류 코드로 바꿔야 할 수 있다.
          categoryType: "PRODUCT",
          categoryId: "GENERAL",
          uid: item.productId,
          name: item.productName,
          count: item.quantity,
        })),
      },
    };
  }

  return request;
}

/**
 * 결제창 응답을 서버에 넘길 힌트로 나눈다.
 * code가 없으면 창은 성공으로 돌아온 것이다. 그래도 완료는 서버 확인 뒤에만 된다.
 * 취소 코드 문자열은 SDK에 enum으로 고정되어 있지 않아, CANCEL이 들어간 코드만 취소로 본다.
 *
 * @param {{ code?: string | null }} response
 * @returns {"cancelled" | "failed" | "returned"}
 */
export function classifyBrowserResult(response) {
  const code = String(response?.code || "").toUpperCase();
  if (!code) return "returned";
  if (code.includes("CANCEL")) return "cancelled";
  return "failed";
}
