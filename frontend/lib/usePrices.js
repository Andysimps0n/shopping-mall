"use client";

import { useEffect, useState } from "react";
import { fetchPriceMap } from "./fetchPrice";

/**
 * Prices for client components that did not receive a server price.
 * null until the list request finishes, or if it fails.
 *
 * @param {boolean} [enabled] false면 요청하지 않는다. 서버가 이미 가격을 넘긴 경우.
 * @returns {Record<string, number> | null}
 */
export function usePriceMap(enabled = true) {
  const [prices, setPrices] = useState(null);

  useEffect(() => {
    if (!enabled) return undefined;

    let ignore = false;

    fetchPriceMap()
      .then((map) => {
        if (!ignore) setPrices(map);
      })
      .catch(() => {
        if (!ignore) setPrices(null);
      });

    return () => {
      ignore = true;
    };
  }, [enabled]);

  return prices;
}
