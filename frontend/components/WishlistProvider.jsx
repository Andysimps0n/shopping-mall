"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  WISHLIST_STORAGE_KEY,
  hasItem,
  normalizeWishlistIds,
  toggleItem as toggleWishlistItem,
} from "@/lib/wishlist";

const WishlistContext = createContext(null);

/**
 * Holds the guest wishlist for the whole app.
 *
 * We start with [] and hydrate after mount for the same reason as the cart:
 * localStorage only exists in the browser. Reading it during the first
 * render would make the server HTML and the client HTML disagree.
 */
export function WishlistProvider({ children }) {
  const [ids, setIds] = useState([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setIds(normalizeWishlistIds(parsed));
    } catch {
      setIds([]);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  // Persist after hydrate only — writing [] before that would wipe a
  // saved wishlist on every page load.
  useEffect(() => {
    if (!hasHydrated) return;

    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Quota or private mode — wishlist still works for this session.
    }
  }, [ids, hasHydrated]);

  const toggle = useCallback((productId) => {
    setIds((current) => toggleWishlistItem(current, productId));
  }, []);

  const isWishlisted = useCallback(
    (productId) => hasItem(ids, productId),
    [ids],
  );

  const value = useMemo(
    () => ({
      ids,
      itemCount: ids.length,
      hasHydrated,
      toggle,
      isWishlisted,
    }),
    [ids, hasHydrated, toggle, isWishlisted],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

/**
 * Read the wishlist from the nearest WishlistProvider.
 * Throws if used outside the provider so missing wiring is obvious.
 */
export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside a WishlistProvider");
  }

  return context;
}
