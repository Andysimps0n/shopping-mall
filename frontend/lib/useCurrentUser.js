"use client";

import { useCart } from "@/components/CartProvider";

/**
 * The layout's CartProvider already called /auth/me once for this visit.
 * Profile screens read that user. Opening /profile again does not ask the database.
 * hasLoaded stays false until that first read finishes, so the login form does not flash.
 */
export function useCurrentUser() {
  const { user, hasHydrated } = useCart();
  return { user, hasLoaded: hasHydrated };
}
