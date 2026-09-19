import { getWebpSrc } from "@/lib/webp";

/**
 * Same photo, two files: WebP first, original JPEG/PNG as fallback.
 * `className` goes on the <img> so existing CSS keeps working.
 * `display: contents` on <picture> is in globals.css (.store-picture).
 */
export default function StorePicture({
  src,
  alt,
  className,
  loading,
  fetchPriority,
  decoding = "async",
}) {
  const webpSrc = getWebpSrc(src);

  return (
    <picture className="store-picture">
      {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
      />
    </picture>
  );
}
