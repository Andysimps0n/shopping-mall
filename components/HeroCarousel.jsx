"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import ProductImage from "./ProductImage";
import { formatPrice, getProductImageSrc, products } from "@/lib/products";

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const total = products.length;

  const goTo = useCallback(
    (index) => {
      // Wrap around so the carousel is endless in both directions.
      setActiveIndex((index + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  const activeProduct = products[activeIndex];

  return (
    <section
      className="HeroCarousel"
      aria-roledescription="carousel"
      aria-label="주요 제품"
    >
      <ProductImage
        name={activeProduct.name}
        categoryLabel={activeProduct.categoryLabel}
        // Only pass a real photo when the file actually exists in /public.
        // Other catalog entries still point at missing .jpg files, so keep
        // those as placeholders until their photos are added.
        src={getProductImageSrc(activeProduct)}
        cover
      />

      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-wrapper container">
        <div className="hero-content" key={activeProduct.id} aria-live="polite">
          <p className="hero-category">{activeProduct.categoryLabel}</p>

          <h1 className="hero-title">{activeProduct.tagline}</h1>

          <div className="hero-meta">
            <p className="hero-name">{activeProduct.name}</p>
            <p className="hero-price">{formatPrice(activeProduct.price)}</p>
          </div>

          <Link
            href={`/products/${activeProduct.id}`}
            className="button button--on-dark hero-button"
          >
            구매하기
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={goPrev}
        aria-label="이전 제품"
        className="hero-arrow hero-arrow--prev"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="icon--lg"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="다음 제품"
        className="hero-arrow hero-arrow--next"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="icon--lg"
          aria-hidden="true"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="hero-dots">
        {products.map((product, index) => (
          <button
            key={product.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`${index + 1}번째 제품으로 이동`}
            aria-current={index === activeIndex}
            className={
              index === activeIndex ? "hero-dot is-active" : "hero-dot"
            }
          />
        ))}
      </div>
    </section>
  );
}
