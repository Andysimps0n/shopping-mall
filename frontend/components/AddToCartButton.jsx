"use client";

import { useCart } from "./CartProvider";

/**
 * Product-page "장바구니" button.
 *
 * Kept as its own client component so ProductDetail can stay a server
 * component. Feedback after add comes from the shared CartToast snackbar.
 */
export default function AddToCartButton({ productId, productName, unitPrice, imageUrl }) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      className="button product-page-cart"
      onClick={() =>
        addItem(productId, {
          name: productName,
          unitPrice,
          imageUrl,
        })
      }
    >
      장바구니
    </button>
  );
}
