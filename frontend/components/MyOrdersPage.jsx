"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchMyOrders } from "@/lib/checkoutApi";
import { OrderSummary } from "./OrderResultPage";
import { orderStatusLabel } from "@/lib/orderStatus";

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
        <div className="order-list">
          {state.orders.map((order) => (
            <article key={order.id} className="order-card">
              <p className="order-status">{orderStatusLabel(order.status)}</p>
              <OrderSummary order={order} />
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
