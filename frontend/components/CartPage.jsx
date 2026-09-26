"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductImage from "./ProductImage";
import { useCart } from "./CartProvider";
import { CART_MAX_QUANTITY, cartFromQuote } from "@/lib/cart";
import { quoteCart } from "@/lib/cartApi";
import { formatPrice, getProductById, getProductPhotoSrc } from "@/lib/products";

/**
 * Full cart. Prices come from the API.
 * Guests get a quote. Signed-in shoppers see the database cart.
 */
export default function CartPage() {
  const { items, accountCart, mode, hasHydrated, setQuantity, removeItem } = useCart();
  const [quote, setQuote] = useState(null);
  const [quoteReady, setQuoteReady] = useState(false);

  useEffect(() => {
    if (!hasHydrated || mode !== "guest") return;

    let ignore = false;

    quoteCart(items).then((next) => {
      if (ignore) return;
      // Keep the previous quote if this request fails, so the quantities stay put.
      if (next) setQuote(next);
      setQuoteReady(true);
    });

    return () => {
      ignore = true;
    };
  }, [items, mode, hasHydrated]);

  // Guests already changed `items` in this browser. Reuse the quote's unit
  // price so the number moves before the next quote request comes back.
  const priced = mode === "account" ? accountCart : cartFromQuote(quote, items);
  const pricesReady = mode === "account" ? accountCart != null : quoteReady;

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

  if (mode === "guest" && quoteReady && !quote && items.length > 0) {
    return (
      <main className="CartPage">
        <div className="cart-page-wrapper container">
          <h1 className="cart-page-heading">장바구니</h1>
          <p className="checkout-error" role="alert">
            가격을 불러오지 못했습니다. 잠시 후 다시 열어 주세요.
          </p>
        </div>
      </main>
    );
  }

  if (!priced || priced.items.length === 0) {
    return (
      <main className="CartPage">
        <div className="cart-page-wrapper container">
          <h1 className="cart-page-heading">장바구니</h1>
          <div className="cart-empty">
            <p className="cart-empty-copy">
              {pricesReady || items.length === 0
                ? "장바구니가 비어 있습니다."
                : "장바구니를 불러오는 중…"}
            </p>
            <Link href="/#collection" className="button cart-empty-cta">
              쇼핑 계속하기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const shippingLabel =
    priced.shippingFee === 0 ? "무료" : formatPrice(priced.shippingFee);

  return (
    <main className="CartPage">
      <div className="cart-page-wrapper container">
        <h1 className="cart-page-heading">장바구니</h1>

        <div className="cart-page-layout">
          <ul className="cart-lines" aria-label="장바구니 상품">
            {priced.items.map((line) => (
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
                <dd>{formatPrice(priced.itemsTotal)}</dd>
              </div>
              <div className="cart-summary-row">
                <dt>배송비</dt>
                <dd>{shippingLabel}</dd>
              </div>
              <div className="cart-summary-row cart-summary-row--total">
                <dt>합계</dt>
                <dd>{formatPrice(priced.totalAmount)}</dd>
              </div>
            </dl>

            <Link href="/checkout" className="button cart-summary-checkout">
              주문하기
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CartLineItem({ line, onSetQuantity, onRemove }) {
  const catalog = getProductById(line.productId);
  const imageSrc = line.imageUrl || getProductPhotoSrc(catalog);
  const name = line.name || line.productName || catalog?.name || "상품";

  function decrease() {
    onSetQuantity(line.productId, line.quantity - 1);
  }

  function increase() {
    onSetQuantity(line.productId, Math.min(line.quantity + 1, CART_MAX_QUANTITY));
  }

  return (
    <li className="cart-line">
      <Link
        href={`/products/${line.productId}`}
        className="cart-line-media"
        aria-label={`${name} 상세 보기`}
      >
        <ProductImage
          name={name}
          categoryLabel={catalog?.categoryLabel}
          src={imageSrc}
          size="card"
        />
      </Link>

      <div className="cart-line-body">
        <div className="cart-line-info">
          {catalog?.categoryLabel ? (
            <p className="cart-line-category">{catalog.categoryLabel}</p>
          ) : null}
          <Link href={`/products/${line.productId}`} className="cart-line-name">
            {name}
          </Link>
          <p className="cart-line-unit">{formatPrice(line.unitPrice)}</p>
        </div>

        <div className="cart-line-controls">
          <div className="cart-qty" role="group" aria-label={`${name} 수량`}>
            <button
              type="button"
              className="cart-qty-btn"
              onClick={decrease}
              aria-label="수량 줄이기"
            >
              −
            </button>
            <span className="cart-qty-value" aria-live="polite">
              {line.quantity}
            </span>
            <button
              type="button"
              className="cart-qty-btn"
              onClick={increase}
              disabled={line.quantity >= CART_MAX_QUANTITY}
              aria-label="수량 늘리기"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="cart-line-remove"
            onClick={() => onRemove(line.productId)}
          >
            삭제
          </button>
        </div>

        <p className="cart-line-total">{formatPrice(line.lineTotal)}</p>
      </div>
    </li>
  );
}
