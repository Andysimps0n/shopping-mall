"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchOrder } from "@/lib/checkoutApi";
import { formatPrice } from "@/lib/products";
import { formatOrderDate, orderStatusLabel, PAY_METHOD_LABELS } from "@/lib/orderStatus";

export default function OrderResultPage({ orderId, tone }) {
  const params = useSearchParams();
  const [state, setState] = useState({ status: "loading", order: null });
  const browserMessage = params.get("message") || "";

  useEffect(() => {
    let ignore = false;

    fetchOrder(orderId).then((result) => {
      if (ignore) return;
      if (result.error === "login") {
        setState({ status: "login", order: null });
        return;
      }
      if (result.error === "missing" || !result.order) {
        setState({ status: "missing", order: null });
        return;
      }
      setState({ status: "ready", order: result.order });
    });

    return () => {
      ignore = true;
    };
  }, [orderId]);

  if (state.status === "loading") {
    return (
      <Shell title="주문">
        <p className="cart-page-loading">주문을 확인하고 있습니다.</p>
      </Shell>
    );
  }

  if (state.status === "login") {
    return (
      <Shell title="주문">
        <p className="cart-empty-copy">로그인 후 주문을 확인할 수 있습니다.</p>
        <Link href={`/profile?next=/orders/${orderId}/${tone === "complete" ? "complete" : "fail"}`} className="button cart-empty-cta">
          로그인
        </Link>
      </Shell>
    );
  }

  if (state.status === "missing") {
    return (
      <Shell title="주문">
        <p className="cart-empty-copy">주문을 찾을 수 없습니다.</p>
        <Link href="/mypage/orders" className="button button--secondary cart-empty-cta">
          내 주문
        </Link>
      </Shell>
    );
  }

  const order = state.order;
  const paid = order.status === "PAID";
  const title = paid ? "주문이 접수되었습니다" : "결제가 완료되지 않았습니다";
  // PG가 준 문장은 앞에 설명을 붙이지 않고 그대로 보여 준다.
  const pgMessage = browserMessage || order.failureMessage || "";

  return (
    <Shell title={title}>
      <p className="order-status">{orderStatusLabel(order.status)}</p>
      {pgMessage ? <p className="order-pg-message">{pgMessage}</p> : null}
      {!paid && !pgMessage ? (
        <p className="cart-empty-copy">
          결제창이 닫혀 결제가 끝나지 않았습니다. 주문은 결제 대기로 남아 있습니다.
        </p>
      ) : null}
      <OrderSummary order={order} />
      <div className="order-actions">
        {paid ? (
          <Link href="/mypage/orders" className="button">
            주문 내역
          </Link>
        ) : (
          <Link href="/cart" className="button">
            장바구니로 돌아가기
          </Link>
        )}
      </div>
    </Shell>
  );
}

export function OrderSummary({ order }) {
  const address = [order.address1, order.address2].filter(Boolean).join(" ");

  return (
    <section className="order-summary">
      <p className="order-date">{formatOrderDate(order.createdAt)}</p>
      <ul className="checkout-lines">
        {order.items.map((item) => (
          <li key={`${item.productId}-${item.productName}`}>
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>{formatPrice(item.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <dl className="cart-summary-rows">
        <div className="cart-summary-row">
          <dt>상품 금액</dt>
          <dd>{formatPrice(order.itemsTotal)}</dd>
        </div>
        <div className="cart-summary-row">
          <dt>배송비</dt>
          <dd>{order.shippingFee === 0 ? "무료" : formatPrice(order.shippingFee)}</dd>
        </div>
        <div className="cart-summary-row cart-summary-row--total">
          <dt>합계</dt>
          <dd>{formatPrice(order.totalAmount)}</dd>
        </div>
      </dl>
      <div className="order-address">
        <p>{order.recipientName}</p>
        <p>{order.phone}</p>
        <p>
          ({order.postalCode}) {address}
        </p>
        {order.memo ? <p>{order.memo}</p> : null}
        <p>{PAY_METHOD_LABELS[order.payMethod] ?? order.payMethod}</p>
      </div>
    </section>
  );
}

function Shell({ title, children }) {
  return (
    <main className="CartPage">
      <div className="cart-page-wrapper container order-result">
        <h1 className="cart-page-heading">{title}</h1>
        {children}
      </div>
    </main>
  );
}
