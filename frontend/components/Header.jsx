"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fetchCurrentUser, logout } from "@/lib/auth";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";

// Small, self-contained icon set. Inline SVGs keep the header dependency-free
// and let us match the quiet, thin-line look the brand wants.
function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="BellIcon icon"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

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

function BrandIcon({ filled = false }) {
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
      <path d="M12 3v3" />
      <path d="M8 21c0-4 8-4 8 0" />
      <path d="M7 9.5c1.5-3 8.5-3 10 0-1 5-4 8-5 8s-4-3-5-8Z" />
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

function IconButton({ label, children }) {
  return (
    <button type="button" aria-label={label} className="IconButton">
      {children}
    </button>
  );
}

function useSession() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchCurrentUser().then((nextUser) => {
      if (!cancelled) {
        setUser(nextUser);
        setHasLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  return { user, hasLoaded, handleLogout };
}

function LoginLink() {
  const pathname = usePathname();
  const { user, hasLoaded, handleLogout } = useSession();

  if (!hasLoaded) {
    return (
      <span className="header-session header-session--pending" aria-hidden="true">
        로그인
      </span>
    );
  }

  if (user) {
    return (
      <button type="button" className="header-session" onClick={handleLogout}>
        로그아웃
      </button>
    );
  }

  const isActive = pathname === "/login";

  return (
    <Link
      href="/login"
      className={isActive ? "header-session is-active" : "header-session"}
      aria-current={isActive ? "page" : undefined}
    >
      로그인
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
  return (
    <Link
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
    </Link>
  );
}

function MobileTabBar() {
  const pathname = usePathname();
  const { itemCount: cartCount, hasHydrated: cartReady } = useCart();
  const { itemCount: wishCount, hasHydrated: wishReady } = useWishlist();
  const { user, hasLoaded, handleLogout } = useSession();

  const cartBadge = cartReady && cartCount > 0 ? cartCount : null;
  const wishBadge = wishReady && wishCount > 0 ? wishCount : null;
  const isLogin = pathname === "/login";

  return (
    <nav className="header-mobile" aria-label="하단 메뉴">
      <TabLink href="/" label="홈" active={pathname === "/"}>
        <HomeIcon filled={pathname === "/"} />
      </TabLink>
      <TabLink href="/brand" label="브랜드" active={pathname === "/brand"}>
        <BrandIcon filled={pathname === "/brand"} />
      </TabLink>
      <TabLink
        href="/wishlist"
        label="찜"
        active={pathname === "/wishlist"}
        badge={wishBadge}
      >
        <HeartIcon filled={pathname === "/wishlist"} />
      </TabLink>
      <TabLink
        href="/cart"
        label="장바구니"
        active={pathname === "/cart"}
        badge={cartBadge}
      >
        <CartIcon />
      </TabLink>
      {!hasLoaded ? (
        <span className="header-tab header-tab--pending" aria-hidden="true">
          <span className="header-tab-icon">
            <UserIcon />
          </span>
          <span className="header-tab-label">로그인</span>
        </span>
      ) : user ? (
        <button type="button" className="header-tab" onClick={handleLogout}>
          <span className="header-tab-icon">
            <UserIcon />
          </span>
          <span className="header-tab-label">로그아웃</span>
        </button>
      ) : (
        <TabLink href="/login" label="로그인" active={isLogin}>
          <UserIcon filled={isLogin} />
        </TabLink>
      )}
    </nav>
  );
}

export default function Header() {
  return (
    <header className="Header">
      <div className="header-wrapper container">
        <BrandLogo />

        <nav className="header-content">
          <Link href="/#hair-care" className="header-link">
            헤어 케어
          </Link>
          <Link href="/#skin-care" className="header-link">
            피부 케어
          </Link>
          <Link href="/brand" className="header-link">
            브랜드
          </Link>
        </nav>

        <div className="header-actions">
          <IconButton label="알림">
            <BellIcon />
          </IconButton>
          <LoginLink />
          <WishlistLink />
          <CartLink />
        </div>
      </div>

      <MobileTabBar />
    </header>
  );
}
