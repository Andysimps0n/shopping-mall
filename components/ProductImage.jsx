// Product photo (or a soft placeholder when no real image exists yet).
//
// When `src` is provided, we fill the parent with a real photo using
// object-fit: cover. When it is missing, we keep the gray "AC" well so
// the layout still looks finished. The parent always controls size.

/**
 * Hero JPEGs have a matching .webp next to them. Returning that path lets
 * <picture> serve the smaller file in browsers that understand WebP, while
 * the JPEG stays the fallback. Other folders (product cards, etc.) stay JPEG.
 */
function getCarouselWebpSrc(src) {
  if (
    typeof src === "string" &&
    src.startsWith("/carousel/") &&
    src.endsWith(".jpg")
  ) {
    return `${src.slice(0, -4)}.webp`;
  }
  return undefined;
}

/**
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.categoryLabel
 * @param {string} [props.src] Real image path (e.g. "/products/foo.png"). Omit for placeholder.
 * @param {boolean} [props.cover] When true, fill the parent edge-to-edge (hero cover mode).
 * @param {"card" | "cover" | "detail" | "banner"} [props.size]
 * @param {"eager" | "lazy"} [props.loading] Native img loading hint.
 * @param {"high" | "low" | "auto"} [props.fetchPriority] Which photo the browser should fetch first.
 * @param {"async" | "sync" | "auto"} [props.decoding] Decode off the main thread unless told otherwise.
 */
export default function ProductImage({
  name,
  categoryLabel,
  src,
  cover = false,
  size,
  loading,
  fetchPriority,
  decoding = "async",
}) {
  const resolvedSize = size ?? (cover ? "cover" : "card");
  const className = `ProductImage ProductImage--${resolvedSize}`;

  // Real photo path? Show the image. Otherwise fall back to the monogram well.
  if (src) {
    const webpSrc = getCarouselWebpSrc(src);

    return (
      <div className={className}>
        <picture>
          {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
          <img
            src={src}
            alt={`${name} 제품 이미지`}
            className="product-image-photo"
            loading={loading}
            fetchPriority={fetchPriority}
            decoding={decoding}
          />
        </picture>
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
