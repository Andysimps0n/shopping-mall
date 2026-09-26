"use client";

import Link from "next/link";
import ProductImage from "./ProductImage";
import { useWishlist } from "./WishlistProvider";
import { formatPrice, getProductPhotoSrc } from "@/lib/products";
import { usePriceMap } from "@/lib/usePrices";

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
 * @param {number | null | undefined} [props.price] 서버가 읽어 넘긴 DB 가격
 * @param {boolean} [props.compact] Tighter type for the recommendation row.
 */
export default function ProductCard({ product, price = null, compact = false }) {
  const { hasHydrated, isWishlisted, toggle } = useWishlist();
  const wishlisted = hasHydrated && isWishlisted(product.id);
  // 서버가 가격을 주면 그 숫자를 쓴다. 찜 목록처럼 서버 값이 없을 때만 다시 읽는다.
  const prices = usePriceMap(typeof price !== "number");
  const shownPrice = typeof price === "number" ? price : prices?.[product.id];

  return (
    <article
      className={compact ? "ProductCard ProductCard--compact" : "ProductCard"}
    >
      <Link
        href={`/products/${product.id}`}
        className="product-card-link"
        prefetch={true}
      >
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
          <p className="product-card-price">
            {shownPrice != null ? formatPrice(shownPrice) : "가격 확인 중"}
          </p>
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
