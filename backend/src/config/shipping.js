// 배송비는 이 파일(환경변수) 한곳만 본다.
// 우리는 발송하지 않고, 주문 정보만 고객사에 넘긴다.
// 스마트스토어 정책을 확인하면 이 값만 바꾸면 된다.

function readWon(name, fallback) {
  const raw = process.env[name];
  if (raw == null || raw.trim() === "") return fallback;

  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) return fallback;
  return value;
}

export function shippingSettings() {
  return {
    shippingFeeKrw: readWon("SHIPPING_FEE_KRW", 0),
    freeShippingThresholdKrw: readWon("FREE_SHIPPING_THRESHOLD_KRW", 0),
  };
}

/**
 * @param {number} itemsTotal 상품 합계 (원)
 * @param {{ shippingFeeKrw: number, freeShippingThresholdKrw: number }} [settings]
 */
export function calculateShippingFee(itemsTotal, settings = shippingSettings()) {
  const fee = settings.shippingFeeKrw;
  const threshold = settings.freeShippingThresholdKrw;

  if (fee <= 0) return 0;
  if (threshold > 0 && itemsTotal >= threshold) return 0;
  return fee;
}
