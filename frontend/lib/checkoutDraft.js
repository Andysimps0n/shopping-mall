const ADDRESS_KEY = "annchloe-checkout-address";

const EMPTY_ADDRESS = {
  recipientName: "",
  phone: "",
  postalCode: "",
  address1: "",
  address2: "",
  memo: "",
};

function asText(value, max) {
  if (typeof value !== "string") return "";
  return value.slice(0, max);
}

/**
 * 결제에 실패하거나 손님이 취소해도 배송지를 다시 치게 하지 않는다.
 * 브라우저 탭의 sessionStorage에만 두고, 결제가 PAID로 확정되면 지운다.
 */
export function readCheckoutAddress() {
  if (typeof window === "undefined") return { ...EMPTY_ADDRESS };
  try {
    const raw = window.sessionStorage.getItem(ADDRESS_KEY);
    if (!raw) return { ...EMPTY_ADDRESS };
    const parsed = JSON.parse(raw);
    return {
      recipientName: asText(parsed?.recipientName, 40),
      phone: asText(parsed?.phone, 20),
      postalCode: asText(parsed?.postalCode, 5),
      address1: asText(parsed?.address1, 200),
      address2: asText(parsed?.address2, 200),
      memo: asText(parsed?.memo, 200),
    };
  } catch {
    return { ...EMPTY_ADDRESS };
  }
}

export function writeCheckoutAddress(form) {
  try {
    window.sessionStorage.setItem(
      ADDRESS_KEY,
      JSON.stringify({
        recipientName: asText(form?.recipientName, 40),
        phone: asText(form?.phone, 20),
        postalCode: asText(form?.postalCode, 5),
        address1: asText(form?.address1, 200),
        address2: asText(form?.address2, 200),
        memo: asText(form?.memo, 200),
      }),
    );
  } catch {
    // 저장이 안 되어도 이번 주문 입력은 그대로 진행한다.
  }
}

export function clearCheckoutAddress() {
  try {
    window.sessionStorage.removeItem(ADDRESS_KEY);
  } catch {
    // 완료 화면은 배송지를 지우는 데 실패해도 주문을 보여 준다.
  }
}
