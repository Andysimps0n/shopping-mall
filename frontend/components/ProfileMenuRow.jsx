import Link from "next/link";

function Chevron() {
  return <span className="profile-chevron" aria-hidden="true" />;
}

/**
 * Full-width list row used on the profile hub and account settings.
 * Looks like a button, acts like a link.
 */
export default function ProfileMenuRow({ href, title, copy }) {
  return (
    <Link href={href} className="profile-menu-row">
      <span className="profile-menu-row-text">
        <span className="profile-menu-row-title">{title}</span>
        {copy ? <span className="profile-menu-row-copy">{copy}</span> : null}
      </span>
      <Chevron />
    </Link>
  );
}

export { Chevron };
