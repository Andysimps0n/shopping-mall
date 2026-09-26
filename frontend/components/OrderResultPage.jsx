"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchOrder, refreshOrder } from "@/lib/checkoutApi";
import { clearCheckoutAddress } from "@/lib/checkoutDraft";
import { formatPrice } from "@/lib/products";
import { formatOrderDate, orderStatusClassName, orderStatusLabel, PAY_METHOD_LABELS } from "@/lib/orderStatus";
import InquiryLink from "./InquiryLink";
import OrderConfetti from "./OrderConfetti";

const RESULT_COPY = {
  PAID: {
    title: "주문이 접수되었습니다",
    body: "",
  },
  CANCELLED: {
    title: "결제를 취소했습니다",
    body: "결제가 취소되었습니다. 장바구니와 입력한 배송지는 그대로 남아 있습니다.",
  },
  FAILED: {
    title: "결제에 실패했습니다",
    body: "결제가 완료되지 않았습니다. 장바구니와 입력한 배송지는 그대로 남아 있습니다.",
  },
  CONFIRMING: {
    title: "결제를 확인하고 있습니다",
    body: "같은 주문은 확인이 끝날 때까지 다시 결제하지 않습니다. 확인이 끝나면 이 화면이 바뀝니다.",
  },
  PENDING: {
    title: "결제 대기",
    body: "아직 결제 확인을 시작하지 않은 주문입니다.",
  },
};

export default function OrderResultPage({ orderId, tone }) {
  const params = useSearchParams();
  const [state, setState] = useState({ status: "loading", order: null });
  const browserMessage = params.get("message") || "";

  useEffect(() => {
    let ignore = false;

    function apply(result) {
      if (ignore) return;
      if (result.error === "login") {
        setState({ status: "login", order: null });
        return;
      }
      if (result.error === "missing" || !result.order) {
        setState({ status: "missing", order: null });
        return;
      }
      if (result.order.status === "PAID") {
        clearCheckoutAddress();
      }
      setState({ status: "ready", order: result.order });
    }

    fetchOrder(orderId).then(apply);

    return () => {
      ignore = true;
    };
  }, [orderId]);

  const orderStatus = state.order?.status;

  useEffect(() => {
    if (orderStatus !== "CONFIRMING" && orderStatus !== "PENDING") return undefined;

    // 처음 여덟 번은 4초마다 PortOne에 묻는다.
    // 그 뒤에도 15초마다 계속 물어, 웹훅이 없어도 만료나 결제 없음으로 화면이 끝난다.
    const fastPolls = 8;
    let polls = 0;
    let ignore = false;
    let timer = 0;

    async function tick() {
      polls += 1;
      const result = await refreshOrder(orderId);
      if (ignore) return;
      if (result.order) {
        if (result.order.status === "PAID") {
          clearCheckoutAddress();
        }
        setState({ status: "ready", order: result.order });
        if (result.order.status !== "CONFIRMING" && result.order.status !== "PENDING") {
          return;
        }
      }
      const delay = polls < fastPolls ? 4000 : 15000;
      timer = window.setTimeout(tick, delay);
    }

    timer = window.setTimeout(tick, 0);
    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [orderStatus, orderId]);

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
  const copy = RESULT_COPY[order.status] ?? RESULT_COPY.PENDING;
  const confirming = order.status === "CONFIRMING";
  const paid = order.status === "PAID";
  const showPgMessage = order.status === "FAILED" || order.status === "CANCELLED";
  // PG가 준 문장은 앞에 설명을 붙이지 않고 그대로 보여 준다.
  const pgMessage = showPgMessage ? browserMessage || order.failureMessage || "" : "";

  return (
    <>
      {paid ? <OrderConfetti orderId={order.id} /> : null}
      <Shell title={copy.title}>
        <p className={orderStatusClassName("order-status", order.status)}>
          {orderStatusLabel(order.status)}
        </p>
        {copy.body ? <p className="cart-empty-copy">{copy.body}</p> : null}
        {pgMessage ? <p className="order-pg-message">{pgMessage}</p> : null}
        <OrderSummary order={order} />
        {paid ? (
          <p className="order-inquiry-link">
            <InquiryLink variant="text" label="배송·교환·환불 문의하기" />
          </p>
        ) : null}
        <div className={paid || confirming ? "order-actions" : "order-actions order-actions--fail"}>
          {paid ? (
            <Link href="/mypage/orders" className="button">
              주문 내역
            </Link>
          ) : confirming ? (
            <button type="button" className="button" disabled>
              결제 확인 중
            </button>
          ) : (
            <>
              <Link href="/checkout" className="button">
                다시 결제하기
              </Link>
              <InquiryLink variant="secondary-button" label="문의하기" />
            </>
          )}
        </div>
      </Shell>
    </>
  );
}

export function OrderSummary({ order, showDate = true }) {
  return (
    <section className="order-summary">
      {showDate ? <p className="order-date">{formatOrderDate(order.createdAt)}</p> : null}
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
      <OrderAddress order={order} />
    </section>
  );
}

function AddressRow({ label, children }) {
  return (
    <div className="order-address-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function OrderAddress({ order, showPayMethod = true, extra = null }) {
  const address = [order.address1, order.address2].filter(Boolean).join(" ");

  return (
    <dl className="order-address">
      <AddressRow label="받는 사람">{order.recipientName}</AddressRow>
      <AddressRow label="휴대폰 번호">{order.phone}</AddressRow>
      <AddressRow label="주소">
        ({order.postalCode}) {address}
      </AddressRow>
      {order.memo ? <AddressRow label="배송 메모">{order.memo}</AddressRow> : null}
      {showPayMethod ? (
        <AddressRow label="결제 수단">
          {PAY_METHOD_LABELS[order.payMethod] ?? order.payMethod}
        </AddressRow>
      ) : null}
      {extra}
    </dl>
  );
}

function Shell({ title, children }) {
  return (
    <main className="CartPage">
      <div className="cart-page-wrapper container">
        <div className="order-result">
          <h1 className="cart-page-heading">{title}</h1>
          {children}
        </div>
      </div>
    </main>
  );
}
