"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProductImage from "./ProductImage";
import { formatPrice, getHeroPhotoSrc } from "@/lib/products";

// Keep this in sync with the CSS transition duration on .hero-track.
const SLIDE_MS = 550;
const AUTO_PLAY = false;
const AUTO_PLAY_MS = 6000;

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

/**
 * The track looks like this (example with 3 products):
 *
 *   [clone of last] [0] [1] [2] [clone of first]
 *         0          1   2   3         4
 *
 * We start at 1, the real first slide. Going "next" always moves the
 * track to the left. When we land on the clone of the first slide, we
 * snap back to the real first with the transition turned off — so the
 * loop does not jump backwards.
 */
function buildSlides(products) {
  if (products.length === 0) {
    return [];
  }

  if (products.length === 1) {
    return [{ product: products[0], slideKey: products[0].id }];
  }

  const last = products[products.length - 1];
  const first = products[0];

  return [
    { product: last, slideKey: `clone-last-${last.id}` },
    ...products.map((product) => ({
      product,
      slideKey: product.id,
    })),
    { product: first, slideKey: `clone-first-${first.id}` },
  ];
}

function productIndexFromTrack(trackIndex, total) {
  if (total < 2) {
    return 0;
  }
  if (trackIndex === 0) {
    return total - 1;
  }
  if (trackIndex === total + 1) {
    return 0;
  }
  return trackIndex - 1;
}

export default function HeroCarousel({ products }) {
  const total = products.length;
  const slides = buildSlides(products);
  const canLoop = total > 1;

  const [trackIndex, setTrackIndex] = useState(canLoop ? 1 : 0);
  const [enableTransition, setEnableTransition] = useState(true);
  const [direction, setDirection] = useState("next");
  const [hasSlid, setHasSlid] = useState(false);
  const [isPageHidden, setIsPageHidden] = useState(false);

  const isAnimating = useRef(false);
  const goNextRef = useRef(() => {});

  const activeProductIndex = productIndexFromTrack(trackIndex, total);
  const activeProduct = products[activeProductIndex];

  const snapToRealSlideIfNeeded = useCallback(
    (index) => {
      if (!canLoop) {
        isAnimating.current = false;
        return;
      }

      if (index === total + 1) {
        setEnableTransition(false);
        setTrackIndex(1);
      } else if (index === 0) {
        setEnableTransition(false);
        setTrackIndex(total);
      }

      isAnimating.current = false;
    },
    [canLoop, total],
  );

  const goToTrackIndex = useCallback(
    (nextTrackIndex, nextDirection) => {
      if (!canLoop || nextTrackIndex === trackIndex || isAnimating.current) {
        return;
      }

      setHasSlid(true);
      setDirection(nextDirection);

      isAnimating.current = true;
      setEnableTransition(true);
      setTrackIndex(nextTrackIndex);
    },
    [canLoop, trackIndex],
  );

  const goNext = useCallback(() => {
    goToTrackIndex(trackIndex + 1, "next");
  }, [goToTrackIndex, trackIndex]);

  const goPrev = useCallback(() => {
    goToTrackIndex(trackIndex - 1, "prev");
  }, [goToTrackIndex, trackIndex]);

  goNextRef.current = goNext;

  const goToProduct = useCallback(
    (productIndex) => {
      const nextDirection = getDirection(
        activeProductIndex,
        productIndex,
        total,
      );

      // Only the wrap-around cases need the cloned slides. A normal
      // jump (e.g. last → third) uses the real index in the track.
      if (
        nextDirection === "prev" &&
        activeProductIndex === 0 &&
        productIndex === total - 1
      ) {
        goToTrackIndex(0, "prev");
        return;
      }

      if (
        nextDirection === "next" &&
        activeProductIndex === total - 1 &&
        productIndex === 0
      ) {
        goToTrackIndex(total + 1, "next");
        return;
      }

      goToTrackIndex(productIndex + 1, nextDirection);
    },
    [activeProductIndex, goToTrackIndex, total],
  );

  useEffect(() => {
    const onVisibility = () => {
      setIsPageHidden(document.hidden);
    };

    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // After a clone snap, wait two frames so the browser paints the
  // jump with transition: none, then turn animation back on.
  useEffect(() => {
    if (enableTransition) {
      return undefined;
    }

    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (!cancelled) {
          setEnableTransition(true);
        }
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [enableTransition, trackIndex]);

  // transitionend can be skipped (background tab, reduced motion).
  // Unlock the carousel and snap off clones even if that happens.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      snapToRealSlideIfNeeded(trackIndex);
    }, SLIDE_MS + 80);

    return () => window.clearTimeout(timer);
  }, [snapToRealSlideIfNeeded, trackIndex]);

  useEffect(() => {
    if (!AUTO_PLAY || !canLoop || isPageHidden) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      goNextRef.current();
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [canLoop, isPageHidden, trackIndex]);

  if (!activeProduct) {
    return null;
  }

  const trackClassName = enableTransition
    ? "hero-track"
    : "hero-track is-instant";

  return (
    <section
      id="hero"
      className="HeroCarousel"
      aria-roledescription="carousel"
      aria-label="주요 제품"
    >
      <div className="hero-slides">
        <div
          className={trackClassName}
          style={{ transform: `translateX(-${trackIndex * 100}%)` }}
          onTransitionEnd={(event) => {
            if (event.target !== event.currentTarget) {
              return;
            }
            snapToRealSlideIfNeeded(trackIndex);
          }}
        >
          {slides.map(({ product, slideKey }, index) => (
            <div
              key={slideKey}
              className={`hero-slide hero-slide--${product.id}`}
              aria-hidden={index !== trackIndex}
            >
              <ProductImage
                name={product.name}
                categoryLabel={product.categoryLabel}
                src={getHeroPhotoSrc(product)}
                cover
                loading={Math.abs(index - trackIndex) <= 1 ? "eager" : "lazy"}
                fetchPriority={index === trackIndex ? "high" : "low"}
              />
            </div>
          ))}
        </div>
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
            자세히 보기
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
            onClick={() => goToProduct(index)}
            aria-label={`${index + 1}번째 제품으로 이동`}
            aria-current={index === activeProductIndex}
            className={
              index === activeProductIndex ? "hero-dot is-active" : "hero-dot"
            }
          />
        ))}
      </div>
    </section>
  );
}
