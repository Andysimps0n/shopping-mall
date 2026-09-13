"use client";

import { useId, useState } from "react";
import ProductImage from "./ProductImage";

/**
 * Short fallback banner when a product has no long-form story entry.
 * Starts collapsed so reviews stay nearer the top of the page.
 *
 * @param {object} props
 * @param {object} props.product
 */
export default function ProductPlaceholderBanner({ product }) {
  const [expanded, setExpanded] = useState(false);
  const bodyId = useId();

  function toggleExpanded() {
    setExpanded((prev) => !prev);
  }

  return (
    <div
      className={
        expanded
          ? "product-page-banner-fold is-expanded"
          : "product-page-banner-fold is-collapsed"
      }
    >
      <div className="product-page-banner-summary banner-block">
        <p className="banner-kicker">AnnChloe</p>
        <p className="banner-product-name">{product.name}</p>
        <p className="banner-heading banner-heading--sm">
          {product.tagline.replaceAll("\n", " ")}
        </p>
        <button
          type="button"
          className="banner-fold-toggle"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={toggleExpanded}
        >
          {expanded ? "스토리 접기" : "제품 스토리 더보기"}
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={
              expanded
                ? "banner-fold-chevron is-expanded"
                : "banner-fold-chevron"
            }
            aria-hidden="true"
          >
            <path d="M3 6l5 5 5-5" />
          </svg>
        </button>
      </div>

      <div id={bodyId} className="banner-fold-body" hidden={!expanded}>
        <div className="product-page-banner">
          <ProductImage
            name={product.name}
            categoryLabel={product.categoryLabel}
            size="banner"
          />
          <div className="product-page-banner-content">
            <p className="product-page-banner-eyebrow">AnnChloe</p>
            <p className="product-page-banner-copy">{product.tagline}</p>
          </div>
        </div>

        <div className="banner-fold-footer">
          <button
            type="button"
            className="banner-fold-toggle"
            aria-expanded={expanded}
            aria-controls={bodyId}
            onClick={toggleExpanded}
          >
            스토리 접기
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="banner-fold-chevron is-expanded"
              aria-hidden="true"
            >
              <path d="M3 6l5 5 5-5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
