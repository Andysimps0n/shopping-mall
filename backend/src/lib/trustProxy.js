/**
 * Express `trust proxy` 값.
 * 비어 있거나 0/false면 끈다. 이때 req.ip는 소켓 주소라, 프록시 뒤에서는 모두 같은 IP가 된다.
 * 알려진 프록시가 하나면 1을 둔다. true는 모든 홉을 믿어서 호출자가 IP를 속일 수 있다.
 *
 * @param {string | undefined} raw
 * @returns {boolean | number | string}
 */
export function trustProxyFromEnv(raw = process.env.TRUST_PROXY) {
  const value = (raw ?? "").trim();
  if (!value || value === "0" || value.toLowerCase() === "false" || value.toLowerCase() === "off") {
    return false;
  }
  if (value.toLowerCase() === "true") return true;
  if (/^\d+$/.test(value)) return Number(value);
  return value;
}
