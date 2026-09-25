import { Suspense } from "react";
import OrderResultPage from "@/components/OrderResultPage";

export const metadata = {
  title: "주문 완료 · AnnChloe",
};

export default async function OrderCompleteRoute({ params }) {
  const { id } = await params;

  return (
    <Suspense fallback={null}>
      <OrderResultPage orderId={id} tone="complete" />
    </Suspense>
  );
}
