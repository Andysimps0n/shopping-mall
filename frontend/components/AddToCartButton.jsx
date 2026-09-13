"use client";

import { useCart } from "./CartProvider";

/**
 * Product-page "장바구니" button.
 *
 * Kept as its own client component so ProductDetail can stay a server
 * component. Feedback after add comes from the shared CartToast snackbar.
 */
export default function AddToCartButton({ productId }) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      className="button button--secondary product-page-cart"
      onClick={() => addItem(productId)}
    >
      장바구니
    </button>
  );
}
