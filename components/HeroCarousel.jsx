"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import ProductImage from "./ProductImage";
import { formatPrice, getHeroPhotoSrc, products } from "@/lib/products";

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

  // Every hero photo is mounted up front. Clicking an arrow then only
  // flips which slide is visible, instead of swapping one <img src> and
  // waiting for a new 10MB+ file to download.

  return (
    <section
      className="HeroCarousel"
      aria-roledescription="carousel"
      aria-label="주요 제품"
    >
      <div className="hero-slides">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={
              index === activeIndex ? "hero-slide is-active" : "hero-slide"
            }
            aria-hidden={index !== activeIndex}
          >
            <ProductImage
              name={product.name}
              categoryLabel={product.categoryLabel}
              src={getHeroPhotoSrc(product)}
              cover
              loading="eager"
            />
          </div>
        ))}
      </div>

      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-wrapper container">
        <div className="hero-content">
          <h1 className="hero-title">{activeProduct.tagline}</h1>

          <p className="hero-name">{activeProduct.name}</p>

          <p className="hero-price">{formatPrice(activeProduct.price)}</p>

          <Link
            href={`/products/${activeProduct.id}`}
            className="button hero-button"
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
