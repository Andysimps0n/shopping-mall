"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProductImage from "./ProductImage";
import { formatPrice, getHeroPhotoSrc, products } from "@/lib/products";

// Keep this in sync with the CSS animation duration.
const SLIDE_MS = 550;

function wrapIndex(index, total) {
  return (index + total) % total;
}

// On a ring of slides, pick the shorter way around so a dot click
// from the last slide to the first still feels like "next".
function getDirection(from, to, total) {
  const forward = wrapIndex(to - from, total);
  const backward = wrapIndex(from - to, total);
  return forward <= backward ? "next" : "prev";
}

function slideClassName(index, activeIndex, exitingIndex, direction) {
  const classes = ["hero-slide"];

  if (index === activeIndex) {
    classes.push("is-active");
    if (exitingIndex !== null) {
      classes.push(direction === "next" ? "is-enter-next" : "is-enter-prev");
    }
  }

  if (index === exitingIndex) {
    classes.push("is-exit");
    classes.push(direction === "next" ? "is-exit-next" : "is-exit-prev");
  }

  return classes.join(" ");
}

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState(null);
  const [direction, setDirection] = useState("next");
  const [hasSlid, setHasSlid] = useState(false);

  const total = products.length;
  const isAnimating = useRef(false);
  const slideTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (slideTimer.current) {
        window.clearTimeout(slideTimer.current);
      }
    };
  }, []);

  const goTo = useCallback(
    (index, nextDirection) => {
      const nextIndex = wrapIndex(index, total);
      if (nextIndex === activeIndex || isAnimating.current) {
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        setActiveIndex(nextIndex);
        return;
      }

      isAnimating.current = true;
      setHasSlid(true);
      setDirection(nextDirection);
      setExitingIndex(activeIndex);
      setActiveIndex(nextIndex);

      if (slideTimer.current) {
        window.clearTimeout(slideTimer.current);
      }

      slideTimer.current = window.setTimeout(() => {
        setExitingIndex(null);
        isAnimating.current = false;
      }, SLIDE_MS);
    },
    [activeIndex, total],
  );

  const goNext = useCallback(
    () => goTo(activeIndex + 1, "next"),
    [activeIndex, goTo],
  );
  const goPrev = useCallback(
    () => goTo(activeIndex - 1, "prev"),
    [activeIndex, goTo],
  );

  const activeProduct = products[activeIndex];

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
            className={slideClassName(
              index,
              activeIndex,
              exitingIndex,
              direction,
            )}
            aria-hidden={index !== activeIndex}
          >
            <ProductImage
              name={product.name}
              categoryLabel={product.categoryLabel}
              src={getHeroPhotoSrc(product)}
              cover
              loading="eager"
              fetchPriority={index === activeIndex ? "high" : "low"}
            />
          </div>
        ))}
      </div>

      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-wrapper container">
        <div
          key={activeProduct.id}
          className={
            hasSlid ? `hero-content is-enter-${direction}` : "hero-content"
          }
        >
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
            onClick={() =>
              goTo(index, getDirection(activeIndex, index, total))
            }
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
