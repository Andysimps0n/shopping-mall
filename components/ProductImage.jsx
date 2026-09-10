// Product photo (or a soft placeholder when no real image exists yet).
//
// When `src` is provided, we fill the parent with a real photo using
// object-fit: cover. When it is missing, we keep the gray "AC" well so
// the layout still looks finished. The parent always controls size.

/**
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.categoryLabel
 * @param {string} [props.src] Real image path (e.g. "/products/foo.png"). Omit for placeholder.
 * @param {boolean} [props.cover] When true, fill the parent edge-to-edge (hero cover mode).
 * @param {"card" | "cover" | "detail" | "banner"} [props.size]
 */
export default function ProductImage({
  name,
  categoryLabel,
  src,
  cover = false,
  size,
}) {
  const resolvedSize = size ?? (cover ? "cover" : "card");
  const className = `ProductImage ProductImage--${resolvedSize}`;

  // Real photo path? Show the image. Otherwise fall back to the monogram well.
  if (src) {
    return (
      <div className={className}>
        <img
          src={src}
          alt={`${name} 제품 이미지`}
          className="product-image-photo"
        />
      </div>
    );
  }

  return (
    <div className={className} role="img" aria-label={`${name} 제품 이미지`}>
      <span className="product-image-monogram">AC</span>
      <span className="product-image-label">
        {categoryLabel.toUpperCase()}
      </span>
    </div>
  );
}
