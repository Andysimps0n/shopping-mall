/**
 * OAuth가 끝난 뒤 돌아갈 경로.
 * 외부 주소로 보내면 피싱에 쓰일 수 있어서, 이 사이트 안의 경로만 허용한다.
 *
 * @param {unknown} value
 * @returns {string} 안전한 경로. 아니면 빈 문자열.
 */
export function safeNextPath(value) {
  if (typeof value !== "string") return "";

  const path = value.trim();
  if (!path.startsWith("/")) return "";
  if (path.startsWith("//")) return "";
  if (path.includes("\\") || path.includes("://")) return "";
  if (path.length > 200) return "";

  return path;
}
