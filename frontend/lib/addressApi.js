import { API_BASE_URL } from "./auth";

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Saved shipping addresses for the signed-in shopper.
 * null means the request failed.
 */
export async function fetchAddresses() {
  try {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
      credentials: "include",
    });
    if (!response.ok) return null;
    const data = await readJson(response);
    return Array.isArray(data?.addresses) ? data.addresses : [];
  } catch {
    return null;
  }
}

async function sendAddress(path, method, body) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await readJson(response);
    if (!response.ok) {
      return { ok: false, error: data?.error || "address_failed" };
    }
    return {
      ok: true,
      addresses: Array.isArray(data?.addresses) ? data.addresses : [],
    };
  } catch {
    return { ok: false, error: "address_failed" };
  }
}

export function createAddress(entry) {
  return sendAddress("/addresses", "POST", entry);
}

export function updateAddress(id, entry) {
  return sendAddress(`/addresses/${encodeURIComponent(id)}`, "PATCH", entry);
}

export function deleteAddress(id) {
  return sendAddress(`/addresses/${encodeURIComponent(id)}`, "DELETE");
}

/** Copy a saved place into the checkout form. Name, phone, and memo stay as typed. */
export function formFieldsFromAddress(address) {
  return {
    postalCode: address.postalCode,
    address1: address.address1,
    address2: address.address2 || "",
  };
}

function placeLine(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function sameSavedAddress(draft, address) {
  const postalCode = String(draft.postalCode ?? "").replace(/\D/g, "");
  return (
    postalCode === address.postalCode &&
    placeLine(draft.address1) === placeLine(address.address1) &&
    placeLine(draft.address2) === placeLine(address.address2)
  );
}

/**
 * Ask only on the first payment, and only when this place is not saved yet.
 * hasPaidOrder is null until the order list has been read.
 */
export function shouldAskToSaveAddress({ hasPaidOrder, savedAddresses, form }) {
  if (hasPaidOrder !== false) return false;
  if (!Array.isArray(savedAddresses)) return false;
  if (!form?.address1?.trim()) return false;
  return !savedAddresses.some((address) => sameSavedAddress(form, address));
}
