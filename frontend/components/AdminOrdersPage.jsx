"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAdminOrders } from "@/lib/checkoutApi";
import { formatPrice } from "@/lib/products";
import { formatOrderDate, orderStatusLabel, PAY_METHOD_LABELS } from "@/lib/orderStatus";

export default function AdminOrdersPage() {
  const [state, setState] = useState({ status: "loading", orders: [] });

  useEffect(() => {
    let ignore = false;

    fetchAdminOrders().then((result) => {
      if (ignore) return;
      if (result.error) {
        setState({ status: result.error, orders: [] });
        return;
      }
      setState({ status: "ready", orders: result.orders });
    });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="CartPage">
      <div className="cart-page-wrapper container">
        <h1 className="cart-page-heading">주문 목록</h1>
        <p className="cart-page-loading">
          결제된 주문과, 금액이 달라 환불을 시도한 주문입니다. 발송은 결제 완료 주문의 받는 사람 정보로 진행합니다.
        </p>

        {state.status === "loading" ? (
          <p className="cart-page-loading">불러오는 중…</p>
        ) : null}
        {state.status === "login" ? (
          <p className="cart-empty-copy">
            <Link href="/profile?next=/admin/orders">로그인</Link> 후 다시 열어 주세요.
          </p>
        ) : null}
        {state.status === "forbidden" ? (
          <p className="checkout-error" role="alert">
            이 계정의 주문 목록 권한이 없습니다.
          </p>
        ) : null}
        {state.status === "failed" ? (
          <p className="checkout-error" role="alert">
            목록을 불러오지 못했습니다.
          </p>
        ) : null}
        {state.status === "ready" && state.orders.length === 0 ? (
          <p className="cart-empty-copy">표시할 주문이 없습니다.</p>
        ) : null}

        <div className="order-list">
          {state.orders.map((order) => {
            const address = [order.address1, order.address2].filter(Boolean).join(" ");
            return (
              <article key={order.id} className="order-card">
                <p className="order-date">{formatOrderDate(order.paidAt || order.createdAt)}</p>
                <p className="order-status">
                  {orderStatusLabel(order.status)}
                  {" · "}
                  {PAY_METHOD_LABELS[order.payMethod] ?? order.payMethod}
                </p>
                {order.refundStatus ? (
                  <p className="order-pg-message">
                    환불 {order.refundStatus === "SUCCEEDED" ? "완료" : "실패"}
                    {order.refundMessage ? ` · ${order.refundMessage}` : ""}
                  </p>
                ) : null}
                <ul className="checkout-lines">
                  {order.items.map((item) => (
                    <li key={`${order.id}-${item.productId}`}>
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.lineTotal)}</span>
                    </li>
                  ))}
                </ul>
                <div className="order-address">
                  <p>{order.recipientName}</p>
                  <p>{order.phone}</p>
                  <p>
                    ({order.postalCode}) {address}
                  </p>
                  {order.memo ? <p>{order.memo}</p> : null}
                  {order.buyerName || order.buyerEmail ? (
                    <p>
                      계정 {order.buyerName || "이름 없음"}
                      {order.buyerEmail ? ` · ${order.buyerEmail}` : ""}
                    </p>
                  ) : null}
                  <p>합계 {formatPrice(order.totalAmount)}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
