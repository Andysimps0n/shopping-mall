"use client";

import { useEffect, useState } from "react";

const TABS = [
  { id: "info", label: "제품 정보", targetId: "product-information" },
  { id: "ingredients", label: "전성분", targetId: "product-ingredients" },
  { id: "reviews", label: "리뷰", targetId: "product-reviews" },
];

/**
 * Tab row that sits above the product story banner (banner-hero).
 *
 * These are jump links, not hide/show panels. Each product still shows
 * 제품 정보, 전성분, and 리뷰 on the same page — the buttons just take
 * you there, like the section nav on a Korean shopping PDP.
 *
 * The browser does the scrolling (`href="#id"` + CSS scroll-margin).
 * We keep the active tab in React state so the underline can follow
 * both clicks and scrolling.
 */
export default function ProductPageTabs() {
  const [activeId, setActiveId] = useState("info");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const hashMatch = TABS.find((tab) => tab.targetId === hash);
    if (hashMatch) {
      setActiveId(hashMatch.id);
    }

    function updateActiveFromScroll() {
      // A click just started a smooth scroll. Keep the clicked tab
      // highlighted until that animation finishes, otherwise the spy
      // would flash 제품 정보 while we are still traveling to 리뷰.
      if (Date.now() < scrollLockUntil) {
        return;
      }

      const offset = getStickyOffset();
      let currentId = TABS[0].id;

      for (const tab of TABS) {
        const section = document.getElementById(tab.targetId);
        if (!section) {
          continue;
        }

        // A section "owns" the viewport once its top has passed the
        // sticky tabs. The last one that qualifies wins, so a tall
        // 제품 정보 block does not steal the 전성분 / 리뷰 highlight.
        if (section.getBoundingClientRect().top - offset <= 8) {
          currentId = tab.id;
        }
      }

      setActiveId(currentId);
    }

    updateActiveFromScroll();
    window.addEventListener("scroll", updateActiveFromScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateActiveFromScroll);
    };
  }, []);

  return (
    <nav className="ProductPageTabs" aria-label="제품 상세 메뉴">
      <div className="product-page-tabs-bar">
        {TABS.map((tab) => {
          const selected = tab.id === activeId;

          return (
            <a
              key={tab.id}
              href={`#${tab.targetId}`}
              aria-current={selected ? "true" : undefined}
              className={
                selected ? "product-page-tab is-active" : "product-page-tab"
              }
              onClick={() => {
                scrollLockUntil = Date.now() + 800;
                setActiveId(tab.id);
              }}
            >
              {tab.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

// Module-level so the click handler and the scroll listener share one
// lock without extra React state (state would re-render on every tick).
let scrollLockUntil = 0;

function getStickyOffset() {
  const styles = getComputedStyle(document.documentElement);
  const headerHeight = parseCssSize(styles.getPropertyValue("--header-height"));
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  // On phones the site header is a bottom tab bar, so nothing is
  // covering the top of the viewport.
  return isMobile ? 0 : headerHeight;
}

function parseCssSize(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
