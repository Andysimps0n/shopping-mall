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
 * @property {number | null} unitPrice  DB price, null until the API answers
 * @property {number | null} lineTotal  unitPrice * quantity
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
 * Join cart items with catalog copy (name, photo) and DB prices.
 * Unknown product ids are skipped so a removed catalog entry
 * does not break the cart page. Missing prices stay null.
 *
 * @param {CartItem[]} items
 * @param {Record<string, number> | null} pricesById
 * @returns {CartLine[]}
 */
export function getCartLines(items, pricesById) {
  const lines = [];

  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product) continue;

    const unitPrice = pricesById?.[item.productId];
    const hasPrice = typeof unitPrice === "number";

    lines.push({
      productId: item.productId,
      quantity: item.quantity,
      product,
      unitPrice: hasPrice ? unitPrice : null,
      lineTotal: hasPrice ? unitPrice * item.quantity : null,
    });
  }

  return lines;
}

/**
 * Sum of all line totals.
 *
 * @param {CartLine[]} lines
 * @returns {number | null} null when any line is still waiting on a price
 */
export function getCartTotal(lines) {
  if (lines.some((line) => line.lineTotal == null)) return null;
  return lines.reduce((sum, line) => sum + line.lineTotal, 0);
}

/**
 * Change one priced line and recompute the totals from unit prices we already have.
 * Quantity 0 removes the line. The screen uses this before the server answers.
 *
 * @param {object | null} cart
 * @param {string} productId
 * @param {number} quantity
 */
export function repriceCart(cart, productId, quantity) {
  if (!cart || !Array.isArray(cart.items)) return cart;

  const next = Math.floor(Number(quantity));
  const items = [];

  for (const item of cart.items) {
    if (item.productId !== productId) {
      items.push(item);
      continue;
    }

    if (!Number.isFinite(next) || next <= 0) continue;

    const capped = Math.min(next, CART_MAX_QUANTITY);
    const unitPrice = item.unitPrice;
    items.push({
      ...item,
      quantity: capped,
      lineTotal: typeof unitPrice === "number" ? unitPrice * capped : item.lineTotal,
    });
  }

  return withTotals(cart, items);
}

/**
 * Add one unit before the server answers.
 * An existing line increases. A new line needs the unit price already on screen.
 *
 * @param {object | null} cart
 * @param {string} productId
 * @param {{ name?: string, unitPrice?: number | null, imageUrl?: string | null }} details
 */
export function addPricedItem(cart, productId, details) {
  const base =
    cart && Array.isArray(cart.items)
      ? cart
      : { items: [], itemsTotal: 0, shippingFee: 0, totalAmount: 0 };

  const existing = base.items.find((item) => item.productId === productId);
  if (existing) {
    return repriceCart(
      base,
      productId,
      Math.min(existing.quantity + 1, CART_MAX_QUANTITY),
    );
  }

  if (typeof details?.unitPrice !== "number") return cart;

  const name = details.name || "상품";
  return withTotals(base, [
    ...base.items,
    {
      productId,
      productName: name,
      name,
      unitPrice: details.unitPrice,
      quantity: 1,
      lineTotal: details.unitPrice,
      imageUrl: details.imageUrl ?? null,
    },
  ]);
}

/**
 * Guest cart: keep the quote's unit prices, but show the quantities
 * already stored in this browser. A new quote can replace this later.
 *
 * @param {object | null} quote
 * @param {CartItem[]} items
 */
export function cartFromQuote(quote, items) {
  if (!quote || !Array.isArray(quote.items)) return null;

  const priced = new Map(quote.items.map((line) => [line.productId, line]));
  const lines = [];

  for (const item of items) {
    const known = priced.get(item.productId);
    if (!known || typeof known.unitPrice !== "number") continue;

    const quantity = Math.min(
      Math.floor(Number(item.quantity)) || 0,
      CART_MAX_QUANTITY,
    );
    if (quantity <= 0) continue;

    lines.push({
      ...known,
      quantity,
      lineTotal: known.unitPrice * quantity,
    });
  }

  return withTotals(quote, lines);
}

function withTotals(cart, items) {
  const itemsTotal = items.reduce((sum, item) => {
    return sum + (typeof item.lineTotal === "number" ? item.lineTotal : 0);
  }, 0);
  const shippingFee = items.length === 0 || cart.shippingFee === 0 ? 0 : cart.shippingFee;

  return {
    ...cart,
    items,
    itemsTotal,
    shippingFee,
    totalAmount: itemsTotal + shippingFee,
  };
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
