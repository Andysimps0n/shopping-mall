"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

/**
 * Bottom toast (snackbar) that confirms an add-to-cart.
 * Lives inside CartProvider so any page can trigger it.
 */
export default function CartToast() {
  const { toast, dismissToast } = useCart();

  if (!toast) return null;

  return (
    <div className="CartToast" role="status" aria-live="polite">
      <div className="cart-toast-card">
        <div className="cart-toast-copy">
          <p className="cart-toast-title">장바구니에 담았습니다</p>
          {toast.productName ? (
            <p className="cart-toast-product">{toast.productName}</p>
          ) : null}
        </div>

        <Link
          href="/cart"
          className="cart-toast-link"
          onClick={dismissToast}
        >
          장바구니 보기
        </Link>

        <button
          type="button"
          className="cart-toast-dismiss"
          onClick={dismissToast}
          aria-label="알림 닫기"
        >
          ×
        </button>
      </div>
    </div>
  );
}
