"use client";

import { useId, useState } from "react";
import ProductImage from "./ProductImage";

/**
 * Short fallback banner when a product has no long-form story entry.
 * Starts collapsed so reviews stay nearer the top of the page.
 * Collapsed state peeks the top of the next block, faded with a
 * gradient, so the "더보기" button sits on real upcoming content.
 *
 * @param {object} props
 * @param {object} props.product
 * @param {import("react").ReactNode} [props.children] Optional extra block after the story.
 */
export default function ProductPlaceholderBanner({ product, children }) {
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
        {expanded ? (
          <button
            type="button"
            className="banner-fold-toggle"
            aria-expanded={expanded}
            aria-controls={bodyId}
            onClick={toggleExpanded}
          >
            스토리 접기
            <FoldChevron expanded />
          </button>
        ) : null}
      </div>

      <div className="banner-fold">
        <div
          id={bodyId}
          className="banner-fold-body"
          inert={!expanded}
          aria-hidden={!expanded}
        >
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

          {children ? (
            <section
              className="banner-block"
              aria-labelledby="product-information-heading"
            >
              <h3
                id="product-information-heading"
                className="product-information-heading"
              >
                INFORMATION
              </h3>
              {children}
            </section>
          ) : null}

          {expanded ? (
            <div className="banner-fold-footer">
              <button
                type="button"
                className="banner-fold-toggle"
                aria-expanded={expanded}
                aria-controls={bodyId}
                onClick={toggleExpanded}
              >
                스토리 접기
                <FoldChevron expanded />
              </button>
            </div>
          ) : null}
        </div>

        {expanded ? null : (
          <div className="banner-fold-veil">
            <button
              type="button"
              className="banner-fold-toggle"
              aria-expanded={expanded}
              aria-controls={bodyId}
              onClick={toggleExpanded}
            >
              제품 스토리 더보기
              <FoldChevron expanded={false} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FoldChevron({ expanded }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        expanded ? "banner-fold-chevron is-expanded" : "banner-fold-chevron"
      }
      aria-hidden="true"
    >
      <path d="M3 6l5 5 5-5" />
    </svg>
  );
}
