const PHONE_PATTERN = /^01[016789]\d{7,8}$/;
const POSTAL_PATTERN = /^\d{5}$/;

function cleanText(value, max) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

/**
 * 배송지 검사. 프론트 검사와 별개로, 서버가 한 번 더 막는다.
 * 금액 필드는 여기서 읽지 않는다.
 *
 * @param {unknown} body
 * @returns {{ ok: true, value: object } | { ok: false, error: string }}
 */
export function parseShippingAddress(body) {
  const source = body && typeof body === "object" ? body : {};

  const recipientName = cleanText(source.recipientName, 40);
  const phone = String(source.phone ?? "").replace(/\D/g, "");
  const postalCode = String(source.postalCode ?? "").replace(/\D/g, "");
  const address1 = cleanText(source.address1, 120);
  const address2 = cleanText(source.address2, 120);
  const memo = cleanText(source.memo, 200);
  const payMethod = source.payMethod === "naverpay" ? "naverpay" : source.payMethod;

  if (recipientName.length < 1) {
    return { ok: false, error: "recipient_required" };
  }
  if (!PHONE_PATTERN.test(phone)) {
    return { ok: false, error: "phone_invalid" };
  }
  if (!POSTAL_PATTERN.test(postalCode)) {
    return { ok: false, error: "postal_code_invalid" };
  }
  if (address1.length < 1) {
    return { ok: false, error: "address_required" };
  }
  if (payMethod !== "kakaopay" && payMethod !== "naverpay") {
    return { ok: false, error: "pay_method_invalid" };
  }

  return {
    ok: true,
    value: {
      recipientName,
      phone,
      postalCode,
      address1,
      address2,
      memo,
      payMethod,
    },
  };
}
