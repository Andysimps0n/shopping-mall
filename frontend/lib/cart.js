// Pure cart helpers — no React, no localStorage side effects.
// Components own when to read/write storage; these functions only
// transform cart arrays and join them with the product catalog.

import { getProductById } from "./products";

/** localStorage key for the guest cart */
export const CART_STORAGE_KEY = "annchloe-cart";

/** Max quantity per product line */
export const CART_MAX_QUANTITY = 99;

/**
 * @typedef {object} CartItem
 * @property {string} productId
 * @property {number} quantity
 */

/**
 * @typedef {object} CartLine
 * @property {string} productId
 * @property {number} quantity
 * @property {import("./products").Product} product
 * @property {number} lineTotal  price * quantity
 */

/**
 * Add one unit of a product (or bump quantity if it is already in the cart).
 * Caps at CART_MAX_QUANTITY.
 *
 * @param {CartItem[]} items
 * @param {string} productId
 * @returns {CartItem[]}
 */
export function addItem(items, productId) {
  const existing = items.find((item) => item.productId === productId);

  if (existing) {
    return items.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.min(item.quantity + 1, CART_MAX_QUANTITY),
          }
        : item,
    );
  }

  return [...items, { productId, quantity: 1 }];
}

/**
 * Set an absolute quantity. Quantity 0 (or below) removes the line.
 *
 * @param {CartItem[]} items
 * @param {string} productId
 * @param {number} quantity
 * @returns {CartItem[]}
 */
export function setQuantity(items, productId, quantity) {
  const next = Math.floor(Number(quantity));

  if (!Number.isFinite(next) || next <= 0) {
    return removeItem(items, productId);
  }

  const capped = Math.min(next, CART_MAX_QUANTITY);
  const existing = items.find((item) => item.productId === productId);

  if (!existing) {
    return [...items, { productId, quantity: capped }];
  }

  return items.map((item) =>
    item.productId === productId ? { ...item, quantity: capped } : item,
  );
}

/**
 * Remove a product line entirely.
 *
 * @param {CartItem[]} items
 * @param {string} productId
 * @returns {CartItem[]}
 */
export function removeItem(items, productId) {
  return items.filter((item) => item.productId !== productId);
}

/**
 * Total number of units in the cart (for the header badge).
 *
 * @param {CartItem[]} items
 * @returns {number}
 */
export function getItemCount(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Join cart items with live catalog data. Unknown product ids are skipped
 * so a removed catalog entry does not break the cart page.
 *
 * @param {CartItem[]} items
 * @returns {CartLine[]}
 */
export function getCartLines(items) {
  const lines = [];

  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product) continue;

    lines.push({
      productId: item.productId,
      quantity: item.quantity,
      product,
      lineTotal: product.price * item.quantity,
    });
  }

  return lines;
}

/**
 * Sum of all line totals.
 *
 * @param {CartLine[]} lines
 * @returns {number}
 */
export function getCartTotal(lines) {
  return lines.reduce((sum, line) => sum + line.lineTotal, 0);
}

/**
 * Parse a raw localStorage value into a clean CartItem[].
 * Invalid entries are dropped so bad data cannot crash the UI.
 *
 * @param {unknown} raw
 * @returns {CartItem[]}
 */
export function normalizeCartItems(raw) {
  if (!Array.isArray(raw)) return [];

  const cleaned = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;

    const productId = entry.productId;
    const quantity = Math.floor(Number(entry.quantity));

    if (typeof productId !== "string" || productId.length === 0) continue;
    if (!Number.isFinite(quantity) || quantity <= 0) continue;

    cleaned.push({
      productId,
      quantity: Math.min(quantity, CART_MAX_QUANTITY),
    });
  }

  return cleaned;
}
