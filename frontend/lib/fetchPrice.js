import { API_BASE_URL } from "./auth";

/**
 * One product from the API: { id, price }, or null when the request fails.
 * The detail page uses this. Lists should use fetchPriceMap instead,
 * so seven cards do not mean seven requests.
 */
export async function fetchPrice(id) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data.product ?? null;
}

// While a list request is already running, other components share it.
let priceMapRequest = null;

/**
 * Every product price, keyed by id. null means the API could not be read.
 * @returns {Promise<Record<string, number> | null>}
 */
export function fetchPriceMap() {
  if (priceMapRequest) return priceMapRequest;

  priceMapRequest = loadPriceMap().finally(() => {
    priceMapRequest = null;
  });

  return priceMapRequest;
}

async function loadPriceMap() {
  const res = await fetch(`${API_BASE_URL}/products`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  /** @type {Record<string, number>} */
  const prices = {};

  for (const product of data.products ?? []) {
    if (!product || typeof product.id !== "string") continue;
    if (typeof product.price !== "number") continue;
    prices[product.id] = product.price;
  }

  return prices;
}

