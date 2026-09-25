function parseAllowlist(value) {
  return (value ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * MVP 관리자 확인. User.role 대신 환경변수의 id 또는 이메일 목록을 본다.
 *
 * @param {{ id: string, email?: string | null }} user
 */
export function isAdminUser(user) {
  if (!user) return false;

  const ids = parseAllowlist(process.env.ADMIN_USER_IDS);
  const emails = parseAllowlist(process.env.ADMIN_EMAILS).map((email) =>
    email.toLowerCase(),
  );

  if (ids.includes(user.id)) return true;
  if (user.email && emails.includes(user.email.toLowerCase())) return true;
  return false;
}
