"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { finishBrowserPayment } from "@/lib/checkoutApi";

function firstParam(params, names) {
  for (const name of names) {
    const value = params.get(name);
    if (value) return value;
  }
  return "";
}

/**
 * 휴대폰의 카카오페이·네이버페이 앱은 결제창 프로미스 대신 redirectUrl로 돌아온다.
 * 데스크톱 팝업은 CheckoutPage가 같은 finishBrowserPayment를 호출한다.
 * 쿼리의 code는 힌트일 뿐이고, 완료 여부는 서버 확인 결과로 정한다.
 */
export default function CheckoutReturnPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const paymentId = firstParam(params, ["paymentId", "payment_id"]);
    if (!paymentId) {
      router.replace("/cart");
      return;
    }

    let ignore = false;

    finishBrowserPayment({
      paymentId,
      code: firstParam(params, ["code"]),
      message: firstParam(params, ["message"]),
      pgMessage: firstParam(params, ["pgMessage", "pg_message"]),
    })
      .then((href) => {
        if (!ignore) router.replace(href);
      })
      .catch(() => {
        if (!ignore) router.replace("/cart");
      });

    return () => {
      ignore = true;
    };
  }, [params, router]);

  return (
    <main className="CartPage">
      <div className="cart-page-wrapper container order-result">
        <h1 className="cart-page-heading">결제를 확인하고 있습니다</h1>
        <p className="cart-page-loading">
          결제 앱에서 돌아왔습니다. 확인이 끝날 때까지 다시 결제할 수 없습니다.
        </p>
      </div>
    </main>
  );
}
