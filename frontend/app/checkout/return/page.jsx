import { Suspense } from "react";
import CheckoutReturnPage from "@/components/CheckoutReturnPage";

export const metadata = {
  title: "결제 확인 · AnnChloe",
};

export default function CheckoutReturnRoute() {
  return (
    <Suspense
      fallback={
        <main className="CartPage">
          <div className="cart-page-wrapper container">
            <h1 className="cart-page-heading">결제 확인</h1>
            <p className="cart-page-loading">결제 결과를 확인하고 있습니다.</p>
          </div>
        </main>
      }
    >
      <CheckoutReturnPage />
    </Suspense>
  );
}
