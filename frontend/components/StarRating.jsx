// Shared 5-star row. Color comes from CSS (`currentColor`), so the product
// grid can use ink and the review page can keep the brand purple.

function StarIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      className="StarIcon"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/**
 * @param {object} props
 * @param {number} props.value  How many stars to fill (1–5).
 * @param {string} [props.label] Screen-reader text for the whole row.
 */
export default function StarRating({ value, label }) {
  return (
    <span className="StarRating" aria-label={label}>
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon key={index} filled={index < value} />
      ))}
    </span>
  );
}
