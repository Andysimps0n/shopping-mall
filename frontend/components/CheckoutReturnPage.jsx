"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { finishBrowserPayment } from "@/lib/checkoutApi";

/**
 * 모바일 결제창은 이 주소로 돌아온다.
 * 쿼리의 code는 힌트일 뿐이고, 완료 여부는 서버 확인 결과로 정한다.
 */
export default function CheckoutReturnPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const paymentId = params.get("paymentId");
    if (!paymentId) {
      router.replace("/cart");
      return;
    }

    let ignore = false;

    finishBrowserPayment({
      paymentId,
      code: params.get("code") ?? "",
      message: params.get("message") ?? "",
      pgMessage: params.get("pgMessage") ?? "",
    }).then((href) => {
      if (!ignore) router.replace(href);
    });

    return () => {
      ignore = true;
    };
  }, [params, router]);

  return (
    <main className="CartPage">
      <div className="cart-page-wrapper container">
        <h1 className="cart-page-heading">결제 확인</h1>
        <p className="cart-page-loading">결제 결과를 확인하고 있습니다.</p>
      </div>
    </main>
  );
}
