"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

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

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="UserIcon icon"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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

// A single icon button used for the right-side utilities. Purely visual for now.
function IconButton({ label, children }) {
  return (
    <button type="button" aria-label={label} className="IconButton">
      {children}
    </button>
  );
}

function LoginLink() {
  const pathname = usePathname();
  const isActive = pathname === "/login";

  return (
    <Link
      href="/login"
      aria-label="로그인"
      aria-current={isActive ? "page" : undefined}
      className={isActive ? "IconButton is-active" : "IconButton"}
    >
      <UserIcon />
    </Link>
  );
}

// Cart opens the /cart page. The count badge waits until the provider has
// hydrated from localStorage so we do not flash a wrong number on first paint.
function CartLink() {
  const { itemCount, hasHydrated } = useCart();
  const showBadge = hasHydrated && itemCount > 0;

  return (
    <Link
      href="/cart"
      aria-label={
        showBadge ? `장바구니, ${itemCount}개 상품` : "장바구니"
      }
      className="IconButton CartLink"
    >
      <CartIcon />
      {showBadge ? (
        <span className="cart-badge" aria-hidden="true">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}

// Stacked text logo matching the reference:
// serif "AnnChloe" in brand purple, then spaced "BEAUTY PEOPLE" underneath.
function BrandLogo() {
  return (
    <Link href="/" className="BrandLogo">
      <span className="header-logo-title">AnnChloe</span>
      <span className="header-logo-subtitle">BEAUTY PEOPLE</span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  // Home starts over the hero, so we can frost the bar on first paint.
  // Other pages have no hero, so they keep the solid header.
  const [isOverHero, setIsOverHero] = useState(pathname === "/");

  useEffect(() => {
    const hero = document.querySelector(".HeroCarousel");

    if (!hero) {
      setIsOverHero(false);
      return;
    }

    // Frosted header while any part of the hero is still on screen.
    // Once the user has scrolled to the collection, we go back to solid.
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOverHero(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className={isOverHero ? "Header is-over-hero" : "Header"}>
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
          <CartLink />
        </div>
      </div>
    </header>
  );
}
