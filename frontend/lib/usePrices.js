"use client";

import { useEffect, useState } from "react";
import { fetchPriceMap } from "./fetchPrice";

/**
 * Prices for client components (cards, hero, cart).
 * null until the list request finishes, or if it fails.
 *
 * @returns {Record<string, number> | null}
 */
export function usePriceMap() {
  const [prices, setPrices] = useState(null);

  useEffect(() => {
    let ignore = false;

    fetchPriceMap().then((map) => {
      if (!ignore) setPrices(map);
    });

    return () => {
      ignore = true;
    };
  }, []);

  return prices;
}
