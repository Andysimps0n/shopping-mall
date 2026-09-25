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
