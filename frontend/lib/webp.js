// Hero and product photos keep a .webp next to the original .jpg/.png.
// <picture> can then pick WebP in browsers that understand it.

/**
 * @param {string | undefined} src
 * @returns {string | undefined}
 */
export function getWebpSrc(src) {
  if (typeof src !== "string") {
    return undefined;
  }

  const isStorePhoto =
    src.startsWith("/carousel/") || src.startsWith("/products/");
  const isRaster = src.endsWith(".jpg") || src.endsWith(".png");

  if (!isStorePhoto || !isRaster) {
    return undefined;
  }

  return src.replace(/\.(jpg|png)$/, ".webp");
}
