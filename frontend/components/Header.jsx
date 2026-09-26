"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";
import SectionLink from "./SectionLink";

// Small, self-contained icon set. Inline SVGs keep the header dependency-free
// and let us match the quiet, thin-line look the brand wants.
function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="CartIcon icon"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function HeartIcon({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="HeartIcon icon"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function HomeIcon({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon"
      aria-hidden="true"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

function CatalogIcon({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </svg>
  );
}

function UserIcon({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5 19.5c1.4-3.2 3.8-4.75 7-4.75s5.6 1.55 7 4.75" />
    </svg>
  );
}

function ProfileLink() {
  const pathname = usePathname();
  const { user, hasHydrated } = useCart();
  const isProfile = pathname === "/profile" || pathname.startsWith("/profile/");
  const label = hasHydrated && user ? user.name?.trim() || "내 정보" : "로그인";

  return (
    <Link
      href="/profile"
      className={
        !hasHydrated
          ? "header-session header-session--pending"
          : isProfile
            ? "header-session is-active"
            : "header-session"
      }
      aria-current={isProfile ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

function CountBadge({ count, hasHydrated }) {
  const showBadge = hasHydrated && count > 0;

  if (!showBadge) return null;

  return (
    <span className="cart-badge" aria-hidden="true">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function CartLink() {
  const { itemCount, hasHydrated } = useCart();
  const showBadge = hasHydrated && itemCount > 0;

  return (
    <Link
      href="/cart"
      aria-label={
        showBadge ? `장바구니, ${itemCount}개 상품` : "장바구니"
      }
      className="IconButton CountLink"
    >
      <CartIcon />
      <CountBadge count={itemCount} hasHydrated={hasHydrated} />
    </Link>
  );
}

function WishlistLink() {
  const { itemCount, hasHydrated } = useWishlist();
  const showBadge = hasHydrated && itemCount > 0;
  const pathname = usePathname();
  const isActive = pathname === "/wishlist";

  return (
    <Link
      href="/wishlist"
      aria-label={
        showBadge ? `찜한 상품, ${itemCount}개` : "찜한 상품"
      }
      className={isActive ? "IconButton CountLink is-active" : "IconButton CountLink"}
    >
      <HeartIcon filled={isActive} />
      <CountBadge count={itemCount} hasHydrated={hasHydrated} />
    </Link>
  );
}

function BrandLogo() {
  return (
    <Link href="/" className="BrandLogo">
      <span className="header-logo-title">AnnChloe</span>
      <span className="header-logo-subtitle">BEAUTY PEOPLE</span>
    </Link>
  );
}

function TabLink({ href, label, active, badge, children }) {
  const Tag = href.includes("#") ? SectionLink : Link;

  return (
    <Tag
      href={href}
      className={active ? "header-tab is-active" : "header-tab"}
      aria-current={active ? "page" : undefined}
      aria-label={badge ? `${label}, ${badge}개` : label}
    >
      <span className="header-tab-icon">
        {children}
        {badge ? (
          <span className="cart-badge" aria-hidden="true">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </span>
      <span className="header-tab-label">{label}</span>
    </Tag>
  );
}

function usePageHash() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    function read() {
      setHash(window.location.hash);
    }

    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [pathname]);

  return hash;
}

function MobileTabBar() {
  const pathname = usePathname();
  const hash = usePageHash();
  const { itemCount: cartCount, hasHydrated: cartReady, user } = useCart();
  const { itemCount: wishCount, hasHydrated: wishReady } = useWishlist();
  const cartBadge = cartReady && cartCount > 0 ? cartCount : null;
  const wishBadge = wishReady && wishCount > 0 ? wishCount : null;
  const onCollection =
    hash === "#collection" || hash === "#hair-care" || hash === "#skin-care";
  const isHome = pathname === "/" && !onCollection;
  const isCatalog =
    pathname.startsWith("/products") || (pathname === "/" && onCollection);
  const isProfile = pathname === "/profile" || pathname.startsWith("/profile/");
  const profileLabel = cartReady && user ? "내 정보" : "로그인";

  return (
    <nav className="header-mobile" aria-label="하단 메뉴">
      <TabLink href="/" label="홈" active={isHome}>
        <HomeIcon filled={isHome} />
      </TabLink>
      <TabLink href="/#collection" label="제품" active={isCatalog}>
        <CatalogIcon filled={isCatalog} />
      </TabLink>
      <TabLink
        href="/wishlist"
        label="찜"
        active={pathname === "/wishlist"}
        badge={wishBadge}
      >
        <HeartIcon filled={pathname === "/wishlist"} />
      </TabLink>
      <TabLink href="/profile" label={profileLabel} active={isProfile}>
        <UserIcon filled={isProfile} />
      </TabLink>
      <TabLink
        href="/cart"
        label="장바구니"
        active={pathname === "/cart"}
        badge={cartBadge}
      >
        <CartIcon />
      </TabLink>
    </nav>
  );
}

export default function Header() {
  return (
    <header className="Header">
      <div className="header-wrapper container">
        <BrandLogo />

        <nav className="header-content">
          <SectionLink href="/#hair-care" className="header-link">
            헤어 케어
          </SectionLink>
          <SectionLink href="/#skin-care" className="header-link">
            피부 케어
          </SectionLink>
          <Link href="/brand" className="header-link">
            브랜드
          </Link>
        </nav>

        <div className="header-actions">
          <ProfileLink />
          <WishlistLink />
          <CartLink />
        </div>
      </div>

      <div className="header-mobile-bar container">
        <BrandLogo />
      </div>

      <MobileTabBar />
    </header>
  );
}
