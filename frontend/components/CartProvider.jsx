"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CART_STORAGE_KEY,
  addItem as addItemToCart,
  getItemCount,
  normalizeCartItems,
  removeItem as removeItemFromCart,
  setQuantity as setItemQuantity,
} from "@/frontend/lib/cart";
import { getProductById } from "@/frontend/lib/products";
import CartToast from "./CartToast";

const CartContext = createContext(null);

/** How long the add-to-cart toast stays visible (ms). */
const TOAST_DURATION_MS = 3200;

/**
 * Holds the guest cart for the whole app.
 *
 * Why we start with [] and hydrate after mount:
 * localStorage only exists in the browser. If we read it during the first
 * render, the server HTML and the client HTML can disagree (hydration error).
 * So we paint an empty cart first, then load the real one once mounted.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  // Toast payload: { id, productName } or null when hidden.
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  // Load saved cart after the first client paint.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(normalizeCartItems(parsed));
    } catch {
      setItems([]);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  // Persist whenever the cart changes — but only after we have loaded.
  // Writing before hydrate would wipe a saved cart with [].
  useEffect(() => {
    if (!hasHydrated) return;

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Quota or private mode — cart still works for this session.
    }
  }, [items, hasHydrated]);

  // Clear any pending toast timer when the provider unmounts.
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback(
    (productName) => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }

      // Fresh id each time so React remounts animation when adding again quickly.
      setToast({ id: Date.now(), productName });

      toastTimerRef.current = window.setTimeout(() => {
        setToast(null);
        toastTimerRef.current = null;
      }, TOAST_DURATION_MS);
    },
    [],
  );

  const addItem = useCallback(
    (productId) => {
      setItems((current) => addItemToCart(current, productId));
      const product = getProductById(productId);
      showToast(product?.name ?? null);
    },
    [showToast],
  );

  const setQuantity = useCallback((productId, quantity) => {
    setItems((current) => setItemQuantity(current, productId, quantity));
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((current) => removeItemFromCart(current, productId));
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount: getItemCount(items),
      hasHydrated,
      toast,
      addItem,
      setQuantity,
      removeItem,
      dismissToast,
    }),
    [
      items,
      hasHydrated,
      toast,
      addItem,
      setQuantity,
      removeItem,
      dismissToast,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartToast />
    </CartContext.Provider>
  );
}

/**
 * Read the cart from the nearest CartProvider.
 * Throws if used outside the provider so missing wiring is obvious.
 */
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
}
