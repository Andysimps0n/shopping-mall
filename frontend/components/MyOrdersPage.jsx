"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchMyOrders } from "@/lib/checkoutApi";
import { formatPrice } from "@/lib/products";
import { formatOrderDate, orderStatusClassName, orderStatusLabel } from "@/lib/orderStatus";
import { OrderSummary } from "./OrderResultPage";
import InquiryLink from "./InquiryLink";

function orderItemPreview(order) {
  const items = order.items ?? [];
  if (items.length === 0) return order.orderName || "주문 상품";

  const first = items[0];
  const label = `${first.productName} × ${first.quantity}`;
  const extra = items.length - 1;
  if (extra <= 0) return label;
  return `${label} 외 ${extra}건`;
}

function OrderAccordion({ order }) {
  return (
    <details className="order-accordion">
      <summary>
        <span className="order-accordion-main">
          <span className="order-accordion-meta">
            <span className="order-accordion-date">{formatOrderDate(order.createdAt)}</span>
            <span className={orderStatusClassName("order-accordion-status", order.status)}>
              {orderStatusLabel(order.status)}
            </span>
          </span>
          <span className="order-accordion-preview">{orderItemPreview(order)}</span>
        </span>
        <span className="order-accordion-aside">
          <span className="order-accordion-total">{formatPrice(order.totalAmount)}</span>
          <span className="order-accordion-chevron" aria-hidden="true" />
        </span>
      </summary>
      <div className="order-accordion-body">
        <OrderSummary order={order} showDate={false} />
      </div>
    </details>
  );
}

export default function MyOrdersPage() {
  const [state, setState] = useState({ status: "loading", orders: [] });

  useEffect(() => {
    let ignore = false;

    fetchMyOrders().then((result) => {
      if (ignore) return;
      if (result.error === "login") {
        setState({ status: "login", orders: [] });
        return;
      }
      if (result.error) {
        setState({ status: "failed", orders: [] });
        return;
      }
      setState({ status: "ready", orders: result.orders });
    });

    return () => {
      ignore = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <main className="CartPage">
        <div className="cart-page-wrapper container">
          <h1 className="cart-page-heading">내 주문</h1>
          <p className="cart-page-loading">주문을 불러오는 중…</p>
        </div>
      </main>
    );
  }

  if (state.status === "login") {
    return (
      <main className="CartPage">
        <div className="cart-page-wrapper container">
          <h1 className="cart-page-heading">내 주문</h1>
          <div className="cart-empty">
            <p className="cart-empty-copy">로그인 후 주문 내역을 볼 수 있습니다.</p>
            <Link href="/profile?next=/mypage/orders" className="button cart-empty-cta">
              로그인
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="CartPage">
      <div className="cart-page-wrapper container">
        <h1 className="cart-page-heading">내 주문</h1>
        {state.status === "failed" ? (
          <p className="checkout-error" role="alert">
            주문 내역을 불러오지 못했습니다.
          </p>
        ) : null}
        {state.status === "ready" && state.orders.length === 0 ? (
          <div className="cart-empty">
            <p className="cart-empty-copy">아직 주문이 없습니다.</p>
            <Link href="/#collection" className="button cart-empty-cta">
              쇼핑 계속하기
            </Link>
          </div>
        ) : null}
        {state.status === "ready" && state.orders.length > 0 ? (
          <div className="order-list order-list--accordion">
            {state.orders.map((order) => (
              <OrderAccordion key={order.id} order={order} />
            ))}
          </div>
        ) : null}
        {state.status === "ready" || state.status === "failed" ? (
          <p className="my-orders-inquiry">
            <InquiryLink variant="text" label="배송·교환·환불 문의하기" />
          </p>
        ) : null}
      </div>
    </main>
  );
}
