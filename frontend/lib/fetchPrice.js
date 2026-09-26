import { API_BASE_URL } from "./auth";

/**
 * One product from the API: { id, price }, or null when the request fails.
 * The detail page uses this. Lists should use fetchPriceMap instead,
 * so seven cards do not mean seven requests.
 */
export async function fetchPrice(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.product ?? null;
  } catch {
    // 연결 거부도 여기로 온다. res.ok 가 아니라 예외다.
    return null;
  }
}

// While a list request is already running, other components share it.
let priceMapRequest = null;

// Home and the product page both ask for every price. Remember the last
// answer so the next click does not wait on the database again.
const PRICE_MEMORY_MS = 15_000;

/** @type {{ at: number, prices: Record<string, number> } | null} */
let rememberedPrices = null;

/**
 * Every product price, keyed by id. null means the API could not be read.
 * A recent answer is returned immediately. A refresh still runs in the
 * background once that answer is older than PRICE_MEMORY_MS.
 * @returns {Promise<Record<string, number> | null>}
 */
export function fetchPriceMap() {
  const remembered = rememberedPrices;
  const age = remembered ? Date.now() - remembered.at : Infinity;
  const fresh = remembered != null && age < PRICE_MEMORY_MS;

  if (!fresh && !priceMapRequest) {
    priceMapRequest = loadPriceMap()
      .then((prices) => {
        if (prices) rememberedPrices = { at: Date.now(), prices };
        return prices ?? rememberedPrices?.prices ?? null;
      })
      .finally(() => {
        priceMapRequest = null;
      });
  }

  if (remembered) return Promise.resolve(remembered.prices);
  return priceMapRequest;
}

async function loadPriceMap() {
  try {
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
  } catch {
    return null;
  }
}

