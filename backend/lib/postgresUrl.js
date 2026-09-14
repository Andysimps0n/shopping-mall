// Neon (and many hosts) put sslmode=require on DATABASE_URL.
// The `pg` driver currently treats require/prefer/verify-ca as verify-full
// and prints a Node warning. Be explicit so the warning goes away.

export function postgresConnectionString(databaseUrl) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing");
  }

  if (/[?&]sslmode=(require|prefer|verify-ca)(?:&|$)/.test(databaseUrl)) {
    return databaseUrl.replace(
      /([?&]sslmode=)(require|prefer|verify-ca)/,
      "$1verify-full",
    );
  }

  if (!/[?&]sslmode=/.test(databaseUrl)) {
    const join = databaseUrl.includes("?") ? "&" : "?";
    return `${databaseUrl}${join}sslmode=verify-full`;
  }

  return databaseUrl;
}
