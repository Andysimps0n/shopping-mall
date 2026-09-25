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
            <h1 className="cart-page-heading">결제를 확인하고 있습니다</h1>
            <p className="cart-page-loading">
              결제 앱에서 돌아왔습니다. 확인이 끝날 때까지 다시 결제할 수 없습니다.
            </p>
          </div>
        </main>
      }
    >
      <CheckoutReturnPage />
    </Suspense>
  );
}
