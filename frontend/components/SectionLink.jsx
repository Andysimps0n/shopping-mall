"use client";

import Link from "next/link";

/**
 * Link to a section on the home page, such as /#hair-care.
 * The whole page uses smooth scrolling. That animation is nice for a short
 * jump on the same page, and slow when arriving from a product page at the top.
 * This link turns smooth scrolling off until the new page has landed.
 */
export default function SectionLink({ href, className, children, onClick, ...rest }) {
  return (
    <Link
      href={href}
      className={className}
      prefetch={true}
      {...rest}
      onClick={() => {
        document.documentElement.classList.add("is-instant-scroll");
        window.setTimeout(() => {
          document.documentElement.classList.remove("is-instant-scroll");
        }, 1000);
        onClick?.();
      }}
    >
      {children}
    </Link>
  );
}
