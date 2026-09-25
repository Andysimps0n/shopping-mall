import { Suspense } from "react";
import OrderResultPage from "@/components/OrderResultPage";

export const metadata = {
  title: "결제 실패 · AnnChloe",
};

export default async function OrderFailRoute({ params }) {
  const { id } = await params;

  return (
    <Suspense fallback={null}>
      <OrderResultPage orderId={id} tone="fail" />
    </Suspense>
  );
}
