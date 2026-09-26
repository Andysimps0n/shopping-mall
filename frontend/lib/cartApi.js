import { API_BASE_URL } from "./auth";

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Price a guest cart from the database. Nothing is saved.
 *
 * @param {{ productId: string, quantity: number }[]} items
 */
export async function quoteCart(items) {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!response.ok) return null;
    return readJson(response);
  } catch {
    return null;
  }
}

export async function fetchAccountCart() {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      credentials: "include",
    });
    if (!response.ok) return null;
    return readJson(response);
  } catch {
    return null;
  }
}

export async function mergeAccountCart(items) {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/merge`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!response.ok) return null;
    return readJson(response);
  } catch {
    return null;
  }
}

export async function addAccountCartItem(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    if (!response.ok) return null;
    return readJson(response);
  } catch {
    return null;
  }
}

export async function setAccountCartQuantity(productId, quantity) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cart/items/${encodeURIComponent(productId)}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      },
    );
    if (!response.ok) return null;
    return readJson(response);
  } catch {
    return null;
  }
}

export async function removeAccountCartItem(productId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cart/items/${encodeURIComponent(productId)}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    if (!response.ok) return null;
    return readJson(response);
  } catch {
    return null;
  }
}
