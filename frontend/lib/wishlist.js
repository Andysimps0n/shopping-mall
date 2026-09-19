// Pure wishlist helpers — no React, no localStorage side effects.
// Same idea as cart.js: components own when to read/write storage;
// these functions only transform an array of product ids.

import { getProductById } from "./products";

/** localStorage key for the guest wishlist */
export const WISHLIST_STORAGE_KEY = "annchloe-wishlist";

/**
 * Add a product if it is not already saved. Duplicates are ignored
 * so tapping 찜 twice in a race cannot insert the same id twice.
 *
 * @param {string[]} ids
 * @param {string} productId
 * @returns {string[]}
 */
export function addItem(ids, productId) {
  if (ids.includes(productId)) return ids;
  return [...ids, productId];
}

/**
 * Remove a product. Missing ids are a no-op.
 *
 * @param {string[]} ids
 * @param {string} productId
 * @returns {string[]}
 */
export function removeItem(ids, productId) {
  return ids.filter((id) => id !== productId);
}

/**
 * Add if missing, remove if present. This is what the heart button calls.
 *
 * @param {string[]} ids
 * @param {string} productId
 * @returns {string[]}
 */
export function toggleItem(ids, productId) {
  return ids.includes(productId)
    ? removeItem(ids, productId)
    : addItem(ids, productId);
}

/**
 * @param {string[]} ids
 * @param {string} productId
 * @returns {boolean}
 */
export function hasItem(ids, productId) {
  return ids.includes(productId);
}

/**
 * Join saved ids with the live catalog. Unknown ids are skipped so a
 * removed catalog entry does not break the wishlist page.
 *
 * @param {string[]} ids
 * @returns {import("./products").Product[]}
 */
export function getWishlistProducts(ids) {
  const products = [];

  for (const id of ids) {
    const product = getProductById(id);
    if (product) products.push(product);
  }

  return products;
}

/**
 * Parse a raw localStorage value into a clean string[] of product ids.
 * Invalid entries and duplicates are dropped.
 *
 * @param {unknown} raw
 * @returns {string[]}
 */
export function normalizeWishlistIds(raw) {
  if (!Array.isArray(raw)) return [];

  const cleaned = [];
  const seen = new Set();

  for (const entry of raw) {
    if (typeof entry !== "string" || entry.length === 0) continue;
    if (seen.has(entry)) continue;

    seen.add(entry);
    cleaned.push(entry);
  }

  return cleaned;
}
