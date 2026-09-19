"use client";

import { useWishlist } from "./WishlistProvider";

function HeartIcon({ filled }) {
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

/**
 * Product-page 찜 toggle.
 *
 * Kept as its own client component so ProductDetail can stay a server
 * component. Until localStorage hydrates we treat the heart as empty
 * so server HTML and the first client paint match.
 */
export default function WishlistButton({ productId }) {
  const { hasHydrated, isWishlisted, toggle } = useWishlist();
  const wishlisted = hasHydrated && isWishlisted(productId);

  return (
    <button
      type="button"
      className={
        wishlisted
          ? "product-page-wishlist is-active"
          : "product-page-wishlist"
      }
      onClick={() => toggle(productId)}
      aria-label={wishlisted ? "찜한 상품에서 제거" : "찜한 상품에 추가"}
      aria-pressed={wishlisted}
    >
      <HeartIcon filled={wishlisted} />
    </button>
  );
}
