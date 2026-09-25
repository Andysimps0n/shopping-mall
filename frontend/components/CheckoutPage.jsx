"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as PortOne from "@portone/browser-sdk/v2";
import { useCart } from "./CartProvider";
import {
  createOrder,
  fetchMyOrders,
  finishBrowserPayment,
  recordCheckoutLogin,
} from "@/lib/checkoutApi";
import { readCheckoutAddress, writeCheckoutAddress } from "@/lib/checkoutDraft";
import { formatPrice } from "@/lib/products";
import {
  NAVER_PAY_MIN_KRW,
  buildPortOnePaymentRequest,
} from "@/lib/portoneCheckout";

const PAY_METHODS = [
  {
    id: "kakaopay",
    label: "카카오페이",
    className: "checkout-pay-button checkout-pay-button--kakao",
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KAKAOPAY,
  },
  {
    id: "naverpay",
    label: "네이버페이",
    className: "checkout-pay-button checkout-pay-button--naver",
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
  payment_confirming: "이전 결제를 확인하는 동안에는 다시 결제할 수 없습니다.",
};

export default function CheckoutPage() {
  const router = useRouter();
  const formRef = useRef(null);
  const { user, mode, accountCart, hasHydrated, reloadCart } = useCart();
  const [form, setForm] = useState({
    recipientName: "",
    phone: "",
    postalCode: "",
    address1: "",
    address2: "",
    memo: "",
  });
  const [draftReady, setDraftReady] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [confirmingOrderId, setConfirmingOrderId] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState("form");

  useEffect(() => {
    setForm(readCheckoutAddress());
    setDraftReady(true);
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    writeCheckoutAddress(form);
  }, [form, draftReady]);

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

  useEffect(() => {
    if (!hasHydrated || !user) return;
    let ignore = false;

    fetchMyOrders().then((result) => {
      if (ignore) return;
      const open = (result.orders ?? []).find((order) => order.status === "CONFIRMING");
      setConfirmingOrderId(open?.id ?? "");
    });

    return () => {
      ignore = true;
    };
  }, [hasHydrated, user]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function startPay(payMethod) {
    setError("");

    if (!formRef.current?.reportValidity()) return;

    if (!agreed) {
      setError("구매 조건과 개인정보 제공에 동의해 주세요.");
      return;
    }

    if (confirmingOrderId) {
      setError(ORDER_ERRORS.payment_confirming);
      return;
    }

    if (!accountCart || accountCart.items.length === 0) {
      setError("장바구니가 비어 있습니다.");
      return;
    }

    const method = PAY_METHODS.find((item) => item.id === payMethod);
    const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
    if (!storeId || !method?.channelKey) {
      setError("결제 설정이 아직 없습니다. 테스트 채널 키를 확인해 주세요.");
      return;
    }

    if (payMethod === "naverpay" && accountCart.totalAmount < NAVER_PAY_MIN_KRW) {
      setError("네이버페이는 100원 미만 결제를 할 수 없습니다.");
      return;
    }

    writeCheckoutAddress(form);
    setPhase("paying");

    const created = await createOrder({
      recipientName: form.recipientName,
      phone: form.phone,
      postalCode: form.postalCode,
      address1: form.address1,
      address2: form.address2,
      memo: form.memo,
      payMethod,
    });

    if (!created.ok || !created.data?.paymentId) {
      setPhase("form");
      if (created.data?.error === "payment_confirming" && created.data?.orderId) {
        setConfirmingOrderId(created.data.orderId);
      }
      setError(ORDER_ERRORS[created.data?.error] || "주문을 만들지 못했습니다.");
      return;
    }

    const order = created.data;
    let response;
    try {
      response = await PortOne.requestPayment(
        buildPortOnePaymentRequest({
          order,
          payMethod,
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
      code: response.code,
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
  const payDisabled = busy || !agreed || Boolean(confirmingOrderId);

  return (
    <main className="CartPage">
      <div className="cart-page-wrapper container">
        <h1 className="cart-page-heading">주문하기</h1>

        <form
          ref={formRef}
          className="checkout-form"
          onSubmit={(event) => event.preventDefault()}
        >
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
          <div className="cart-summary-row">
            <span>배송비</span>
            <span>
              {accountCart.shippingFee === 0 ? "무료" : formatPrice(accountCart.shippingFee)}
            </span>
          </div>

          <label className="checkout-consent">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
            />
            <span>주문 내용을 확인했으며 아래 안내에 동의합니다.</span>
          </label>

          <details className="checkout-details">
            <summary>구매 조건 확인</summary>
            <p>
              [안내 문구 초안] 주문 상품, 수량, 결제 금액, 배송지를 확인했습니다.
              앤클로이 이용약관과 교환·환불 안내의 확정본이 이 자리에 들어갑니다.
              지금은 자리만 잡아 둔 문장입니다.
            </p>
            <p>
              <Link href="/terms">이용약관 초안</Link>
              {" · "}
              <Link href="/refund">교환·환불 초안</Link>
            </p>
          </details>

          <details className="checkout-details">
            <summary>개인정보 제3자 제공 (PG사·택배사)</summary>
            <p>
              [안내 문구 초안] 결제와 배송을 진행하려면 이름, 연락처, 주소, 주문
              정보가 결제대행사(PG사)와 택배사에 제공될 수 있습니다. 제공 항목,
              목적, 보유 기간은 약관이 확정되면 이 문장을 교체합니다.
            </p>
            <p>
              <Link href="/privacy">개인정보처리방침 초안</Link>
            </p>
          </details>

          {confirmingOrderId ? (
            <p className="checkout-error" role="status">
              이전 결제를 확인하고 있습니다. 확인이 끝나기 전에는 다시 결제할 수 없습니다.{" "}
              <Link href={`/orders/${confirmingOrderId}/fail`}>확인 상태 보기</Link>
            </p>
          ) : null}

          {error ? (
            <p className="checkout-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="checkout-pay">
            <p className="checkout-total">
              <span>최종 결제 금액</span>
              <strong>{formatPrice(accountCart.totalAmount)}</strong>
            </p>
            {PAY_METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                className={method.className}
                disabled={payDisabled}
                onClick={() => startPay(method.id)}
              >
                {phase === "confirming"
                  ? "결제 확인 중"
                  : busy
                    ? "결제창 여는 중"
                    : method.label}
              </button>
            ))}
          </div>
          <p className="checkout-note">
            위 금액은 상품 금액과 배송비를 더한 값이며, 서버가 상품 가격으로 다시 계산합니다.
          </p>
        </form>
      </div>
    </main>
  );
}
