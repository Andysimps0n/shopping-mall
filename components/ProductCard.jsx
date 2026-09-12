"use client";

import { useState } from "react";
import Link from "next/link";
import ProductImage from "./ProductImage";
import { formatPrice, getProductPhotoSrc } from "@/lib/products";

// A thin-line heart used for the wishlist toggle. Fills with the brand color
// when active. This is UI only — nothing is persisted.
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
 * @param {object} props
 * @param {object} props.product
 * @param {boolean} [props.compact] Hide the extra description + CTA (recommendation row).
 */
export default function ProductCard({ product, compact = false }) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <article className="ProductCard">
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
          <p className="product-card-price">{formatPrice(product.price)}</p>
          <h3 className="product-card-name">{product.name}</h3>
          {!compact ? (
            <p className="product-card-description">{product.description}</p>
          ) : null}
          <p className="product-card-category">{product.categoryLabel}</p>
          {!compact ? (
            <span className="button product-card-action">구매하기</span>
          ) : null}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => setWishlisted((prev) => !prev)}
        aria-label={wishlisted ? "위시리스트에서 제거" : "위시리스트에 추가"}
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
