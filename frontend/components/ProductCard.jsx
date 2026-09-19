"use client";

import Link from "next/link";
import ProductImage from "./ProductImage";
import StarRating from "./StarRating";
import { useWishlist } from "./WishlistProvider";
import { formatPrice, getProductPhotoSrc } from "@/lib/products";
import { getReviewSummary } from "@/lib/reviews";

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
 * Below the photo we keep a short catalog block (name, stars + count, price,
 * and a "자세히 보기" cue on the full grid so the card reads as clickable).
 *
 * @param {object} props
 * @param {object} props.product
 * @param {boolean} [props.compact] Tighter type for the recommendation row.
 */
export default function ProductCard({ product, compact = false }) {
  const { hasHydrated, isWishlisted, toggle } = useWishlist();
  const wishlisted = hasHydrated && isWishlisted(product.id);
  const { count, average, roundedAverage } = getReviewSummary(product.id);

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
          <p className="product-card-rating">
            <StarRating
              value={roundedAverage}
              label={
                count > 0
                  ? `평균 별점 ${average}점, 리뷰 ${count}개`
                  : "아직 등록된 리뷰가 없습니다"
              }
            />
            {count > 0 ? (
              <span className="product-card-rating-count">({count})</span>
            ) : null}
          </p>
          <p className="product-card-price">{formatPrice(product.price)}</p>
          {!compact ? (
            <span className="product-card-cta">
              자세히 보기
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="product-card-cta-icon"
                aria-hidden="true"
              >
                <path d="M5.5 3.5 11 8l-5.5 4.5" />
              </svg>
            </span>
          ) : null}
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
