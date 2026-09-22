"use client";

import Link from "next/link";
import ProductImage from "./ProductImage";
import { useWishlist } from "./WishlistProvider";
import { formatPrice, getProductPhotoSrc } from "@/lib/products";

// A thin-line heart used for the wishlist toggle. Fills with the brand color
// when the product is saved. The saved list lives in WishlistProvider.
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
 * Shared product card used in the home grid and on product pages.
 *
 * The whole card is a link to `/products/[id]`. The wishlist heart sits
 * *outside* that link so clicking it does not navigate away.
 *
 * Below the photo: name and price. The whole card is the link.
 *
 * @param {object} props
 * @param {object} props.product
 * @param {boolean} [props.compact] Tighter type for the recommendation row.
 */
export default function ProductCard({ product, compact = false }) {
  const { hasHydrated, isWishlisted, toggle } = useWishlist();
  const wishlisted = hasHydrated && isWishlisted(product.id);

  return (
    <article
      className={compact ? "ProductCard ProductCard--compact" : "ProductCard"}
    >
      <Link href={`/products/${product.id}`} className="product-card-link">
        <div className="product-card-media">
          <ProductImage
            name={product.name}
            categoryLabel={product.categoryLabel}
            // Only pass a photo when the file exists. Other products
            // still fall back to the gray "AC" placeholder.
            src={getProductPhotoSrc(product)}
          />
        </div>

        <div className="product-card-content">
          <h3 className="product-card-name">{product.name}</h3>
          <p className="product-card-price">{formatPrice(product.price)}</p>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggle(product.id)}
        aria-label={wishlisted ? "찜한 상품에서 제거" : "찜한 상품에 추가"}
        aria-pressed={wishlisted}
        className={
          wishlisted
            ? "product-card-wishlist is-active"
            : "product-card-wishlist"
        }
      >
        <HeartIcon filled={wishlisted} />
      </button>
    </article>
  );
}
