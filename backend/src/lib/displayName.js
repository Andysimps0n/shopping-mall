/** 계정 화면에 보이는 이름. 배송지 받는 사람 이름과 같은 상한이다. */
export const DISPLAY_NAME_MAX = 40;

/**
 * 계정 이름 검사. 앞뒤 공백은 지우고, 가운데 공백은 하나로 붙인다.
 * 비어 있거나 상한을 넘으면 저장하지 않는다.
 *
 * @param {unknown} value
 * @returns {{ ok: true, name: string } | { ok: false, error: "name_required" | "name_too_long" }}
 */
export function parseDisplayName(value) {
  if (typeof value !== "string") {
    return { ok: false, error: "name_required" };
  }

  const name = value.replace(/\s+/g, " ").trim();
  if (!name) return { ok: false, error: "name_required" };
  if (name.length > DISPLAY_NAME_MAX) {
    return { ok: false, error: "name_too_long" };
  }
  return { ok: true, name };
}
