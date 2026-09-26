import Link from "next/link";

/**
 * Shared column for signed-in profile screens.
 * Uses .container so the left edge matches the header, without the
 * narrow login-panel max-width.
 */
export default function ProfileShell({ title, backHref, children }) {
  return (
    <main className="ProfilePage">
      <div className="profile-shell container">
        {backHref ? (
          <Link href={backHref} className="profile-back">
            프로필
          </Link>
        ) : null}
        {title ? <h1 className="profile-page-heading">{title}</h1> : null}
        {children}
      </div>
    </main>
  );
}
