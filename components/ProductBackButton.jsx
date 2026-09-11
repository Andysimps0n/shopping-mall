"use client";

import { useRouter } from "next/navigation";

function BackArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

// Client-only because "go back" needs the browser history API.
// Linking to "/" would skip over a previous product if the shopper
// arrived here from a recommended card.
export default function ProductBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="product-page-back"
      aria-label="이전 페이지로 이동"
    >
      <BackArrowIcon />
      뒤로가기
    </button>
  );
}
