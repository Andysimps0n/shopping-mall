"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as PortOne from "@portone/browser-sdk/v2";
import { useCart } from "./CartProvider";
import { createOrder, finishBrowserPayment, recordCheckoutLogin } from "@/lib/checkoutApi";
import { formatPrice } from "@/lib/products";
import {
  NAVER_PAY_MIN_KRW,
  buildPortOnePaymentRequest,
} from "@/lib/portoneCheckout";

const PAY_METHODS = [
  {
    id: "kakaopay",
    label: "카카오페이",
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KAKAOPAY,
  },
  {
    id: "naverpay",
    label: "네이버페이",
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_NAVERPAY,
  },
];

const ORDER_ERRORS = {
  recipient_required: "받는 사람 이름을 입력해 주세요.",
  phone_invalid: "휴대폰 번호를 확인해 주세요.",
  postal_code_invalid: "우편번호 5자리를 입력해 주세요.",
  address_required: "주소를 입력해 주세요.",
  pay_method_invalid: "결제 수단을 선택해 주세요.",
  cart_empty: "장바구니가 비어 있습니다.",
  login_required: "로그인 후 주문할 수 있습니다.",
};

const EMPTY_FORM = {
  recipientName: "",
  phone: "",
  postalCode: "",
  address1: "",
  address2: "",
  memo: "",
  payMethod: "kakaopay",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, mode, accountCart, hasHydrated, reloadCart } = useCart();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState("form");

  useEffect(() => {
    if (!hasHydrated || user) return;

    // 비회원 결제는 없다. 로그인으로 보내기 전에 이탈 후보를 한 번 기록한다.
    window.sessionStorage.setItem("annchloe-checkout-login", "1");
    recordCheckoutLogin("prompted");
    router.replace("/profile?next=/checkout");
  }, [hasHydrated, user, router]);

  useEffect(() => {
    if (!hasHydrated || !user) return;
    if (window.sessionStorage.getItem("annchloe-checkout-login") !== "1") return;
    window.sessionStorage.removeItem("annchloe-checkout-login");
    recordCheckoutLogin("resumed");
  }, [hasHydrated, user]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!accountCart || accountCart.items.length === 0) {
      setError("장바구니가 비어 있습니다.");
      return;
    }

    const method = PAY_METHODS.find((item) => item.id === form.payMethod);
    const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
    if (!storeId || !method?.channelKey) {
      setError("결제 설정이 아직 없습니다. 테스트 채널 키를 확인해 주세요.");
      return;
    }

    if (form.payMethod === "naverpay" && accountCart.totalAmount < NAVER_PAY_MIN_KRW) {
      setError("네이버페이는 100원 미만 결제를 할 수 없습니다.");
      return;
    }

    setPhase("paying");

    const created = await createOrder({
      recipientName: form.recipientName,
      phone: form.phone,
      postalCode: form.postalCode,
      address1: form.address1,
      address2: form.address2,
      memo: form.memo,
      payMethod: form.payMethod,
    });

    if (!created.ok || !created.data?.paymentId) {
      setPhase("form");
      setError(ORDER_ERRORS[created.data?.error] || "주문을 만들지 못했습니다.");
      return;
    }

    const order = created.data;
    let response;
    try {
      response = await PortOne.requestPayment(
        buildPortOnePaymentRequest({
          order,
          payMethod: form.payMethod,
          storeId,
          channelKey: method.channelKey,
          redirectUrl: `${window.location.origin}/checkout/return`,
          customer: {
            fullName: order.recipientName,
            phoneNumber: order.phone,
            email: user.email || undefined,
            zipcode: order.postalCode,
          },
        }),
      );
    } catch (err) {
      console.error(err);
      setPhase("form");
      setError("결제창을 열지 못했습니다.");
      return;
    }

    // 모바일은 redirectUrl로 페이지가 바뀐다. 반환값이 없으면 여기서 끝낸다.
    if (!response) return;

    setPhase("confirming");
    const href = await finishBrowserPayment({
      paymentId: order.paymentId,
      message: response.message,
      pgMessage: response.pgMessage,
    });
    router.push(href);
  }

  if (!hasHydrated || !user) {
    return (
      <main className="CartPage">
        <div className="cart-page-wrapper container">
          <h1 className="cart-page-heading">주문하기</h1>
          <p className="cart-page-loading">로그인을 확인하고 있습니다.</p>
        </div>
      </main>
    );
  }

  if (mode !== "account") {
    return (
      <main className="CartPage">
        <div className="cart-page-wrapper container">
          <h1 className="cart-page-heading">주문하기</h1>
          <p className="checkout-error" role="alert">
            장바구니를 계정에 옮기지 못했습니다. 상품은 이 브라우저에 그대로 있습니다.
          </p>
          <button type="button" className="button" onClick={() => reloadCart()}>
            다시 시도
          </button>
        </div>
      </main>
    );
  }

  if (!accountCart || accountCart.items.length === 0) {
    return (
      <main className="CartPage">
        <div className="cart-page-wrapper container">
          <h1 className="cart-page-heading">주문하기</h1>
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

  const busy = phase !== "form";

  return (
    <main className="CartPage">
      <div className="cart-page-wrapper container">
        <h1 className="cart-page-heading">주문하기</h1>

        <div className="cart-page-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label className="login-field">
              <span className="login-field-label">받는 사람</span>
              <input
                name="recipientName"
                required
                maxLength={40}
                autoComplete="name"
                value={form.recipientName}
                onChange={(event) => updateField("recipientName", event.target.value)}
              />
            </label>

            <label className="login-field">
              <span className="login-field-label">휴대폰 번호</span>
              <input
                name="phone"
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder="010-0000-0000"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </label>

            <label className="login-field">
              <span className="login-field-label">우편번호</span>
              <input
                name="postalCode"
                required
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                value={form.postalCode}
                onChange={(event) => updateField("postalCode", event.target.value)}
              />
            </label>

            <label className="login-field">
              <span className="login-field-label">주소</span>
              <input
                name="address1"
                required
                autoComplete="address-line1"
                value={form.address1}
                onChange={(event) => updateField("address1", event.target.value)}
              />
            </label>

            <label className="login-field">
              <span className="login-field-label">상세 주소</span>
              <input
                name="address2"
                autoComplete="address-line2"
                value={form.address2}
                onChange={(event) => updateField("address2", event.target.value)}
              />
            </label>

            <label className="login-field">
              <span className="login-field-label">배송 메모</span>
              <input
                name="memo"
                maxLength={200}
                value={form.memo}
                onChange={(event) => updateField("memo", event.target.value)}
              />
            </label>

            <fieldset className="checkout-methods">
              <legend className="login-field-label">결제 수단</legend>
              {PAY_METHODS.map((method) => (
                <label key={method.id} className="checkout-method">
                  <input
                    type="radio"
                    name="payMethod"
                    value={method.id}
                    checked={form.payMethod === method.id}
                    onChange={() => updateField("payMethod", method.id)}
                  />
                  {method.label}
                </label>
              ))}
            </fieldset>

            {error ? (
              <p className="checkout-error" role="alert">
                {error}
              </p>
            ) : null}

            <button type="submit" className="button checkout-submit" disabled={busy}>
              {phase === "confirming" ? "결제 확인 중" : busy ? "결제창 여는 중" : "결제하기"}
            </button>
          </form>

          <aside className="cart-summary" aria-labelledby="checkout-summary-heading">
            <h2 id="checkout-summary-heading" className="cart-summary-heading">
              결제 금액
            </h2>
            <ul className="checkout-lines">
              {accountCart.items.map((item) => (
                <li key={item.productId}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="cart-summary-rows">
              <div className="cart-summary-row">
                <dt>배송비</dt>
                <dd>
                  {accountCart.shippingFee === 0
                    ? "무료"
                    : formatPrice(accountCart.shippingFee)}
                </dd>
              </div>
              <div className="cart-summary-row cart-summary-row--total">
                <dt>합계</dt>
                <dd>{formatPrice(accountCart.totalAmount)}</dd>
              </div>
            </dl>
            <p className="checkout-note">
              결제 금액은 서버가 상품 가격으로 다시 계산합니다.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
