"use client";

import Link from "next/link";
import ProductImage from "./ProductImage";
import { useCart } from "./CartProvider";
import {
  CART_MAX_QUANTITY,
  getCartLines,
  getCartTotal,
} from "@/lib/cart";
import { formatPrice, getProductPhotoSrc } from "@/lib/products";
import { usePriceMap } from "@/lib/usePrices";

/**
 * Full-page cart: line items on the left, order summary on the right.
 * Checkout (주문하기) is a visual stub only — no payment yet.
 */
export default function CartPage() {
  const { items, hasHydrated, setQuantity, removeItem } = useCart();
  const prices = usePriceMap();
  const lines = getCartLines(items, prices);
  const total = getCartTotal(lines);

  // Until localStorage loads, show a quiet loading shell so we do not
  // flash the empty state when the shopper already has items saved.
  if (!hasHydrated) {
    return (
      <main className="CartPage">
        <div className="cart-page-wrapper container">
          <h1 className="cart-page-heading">장바구니</h1>
          <p className="cart-page-loading">장바구니를 불러오는 중…</p>
        </div>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="CartPage">
        <div className="cart-page-wrapper container">
          <h1 className="cart-page-heading">장바구니</h1>
          <div className="cart-empty">
            <p className="cart-empty-copy">장바구니가 비어 있습니다.</p>
            <Link href="/#collection" className="button cart-empty-cta">
              쇼핑 계속하기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="CartPage">
      <div className="cart-page-wrapper container">
        <h1 className="cart-page-heading">장바구니</h1>

        <div className="cart-page-layout">
          <ul className="cart-lines" aria-label="장바구니 상품">
            {lines.map((line) => (
              <CartLineItem
                key={line.productId}
                line={line}
                onSetQuantity={setQuantity}
                onRemove={removeItem}
              />
            ))}
          </ul>

          <aside className="cart-summary" aria-labelledby="cart-summary-heading">
            <h2 id="cart-summary-heading" className="cart-summary-heading">
              주문 요약
            </h2>

            <dl className="cart-summary-rows">
              <div className="cart-summary-row">
                <dt>상품 금액</dt>
                <dd>{total != null ? formatPrice(total) : "가격 확인 중"}</dd>
              </div>
              <div className="cart-summary-row">
                <dt>배송비</dt>
                <dd>무료</dd>
              </div>
              <div className="cart-summary-row cart-summary-row--total">
                <dt>합계</dt>
                <dd>{total != null ? formatPrice(total) : "가격 확인 중"}</dd>
              </div>
            </dl>

            {/* Checkout is not built yet — same stub pattern as 구매하기. */}
            <button
              type="button"
              className="button cart-summary-checkout"
              disabled
              aria-disabled="true"
            >
              주문하기
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CartLineItem({ line, onSetQuantity, onRemove }) {
  const { product, productId, quantity, unitPrice, lineTotal } = line;
  const imageSrc = getProductPhotoSrc(product);

  function decrease() {
    onSetQuantity(productId, quantity - 1);
  }

  function increase() {
    onSetQuantity(productId, Math.min(quantity + 1, CART_MAX_QUANTITY));
  }

  return (
    <li className="cart-line">
      <Link
        href={`/products/${productId}`}
        className="cart-line-media"
        aria-label={`${product.name} 상세 보기`}
      >
        <ProductImage
          name={product.name}
          categoryLabel={product.categoryLabel}
          src={imageSrc}
          size="card"
        />
      </Link>

      <div className="cart-line-body">
        <div className="cart-line-info">
          <p className="cart-line-category">{product.categoryLabel}</p>
          <Link href={`/products/${productId}`} className="cart-line-name">
            {product.name}
          </Link>
          <p className="cart-line-unit">
            {unitPrice != null ? formatPrice(unitPrice) : "가격 확인 중"}
          </p>
        </div>

        <div className="cart-line-controls">
          <div
            className="cart-qty"
            role="group"
            aria-label={`${product.name} 수량`}
          >
            <button
              type="button"
              className="cart-qty-btn"
              onClick={decrease}
              aria-label="수량 줄이기"
            >
              −
            </button>
            <span className="cart-qty-value" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              className="cart-qty-btn"
              onClick={increase}
              disabled={quantity >= CART_MAX_QUANTITY}
              aria-label="수량 늘리기"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="cart-line-remove"
            onClick={() => onRemove(productId)}
          >
            삭제
          </button>
        </div>

        <p className="cart-line-total">
          {lineTotal != null ? formatPrice(lineTotal) : "가격 확인 중"}
        </p>
      </div>
    </li>
  );
}
