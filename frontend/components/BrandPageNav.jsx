"use client";

import { useEffect, useState } from "react";

/* Ignore tiny trackpad jitter so the bar does not flicker. */
const SCROLL_DELTA = 8;
/* At the top of the page the bar is part of the layout, so keep it open. */
const ALWAYS_SHOW_ABOVE = 48;

/**
 * Section links for /brand. Stays under the site header, folds away
 * while the page moves down, and slides back when the page moves up.
 *
 * @param {object} props
 * @param {{ label: string, href: string }[]} props.links
 */
export default function BrandPageNav({ links }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY;

      if (Math.abs(delta) < SCROLL_DELTA) return;
      lastY = y;

      if (y <= ALWAYS_SHOW_ABOVE) {
        setCollapsed(false);
        return;
      }

      setCollapsed(delta > 0);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={collapsed ? "bp-page-nav is-collapsed" : "bp-page-nav"}
      aria-label="브랜드 페이지 안에서 이동"
      inert={collapsed ? true : undefined}
    >
      {links.map((link) => (
        <a key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}
