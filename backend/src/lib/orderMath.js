import { calculateShippingFee } from "../config/shipping.js";

/** 한 줄에 담을 수 있는 최대 수량. 장바구니와 주문이 같은 상한을 쓴다. */
export const MAX_QUANTITY = 99;

export function capQuantity(quantity) {
  const next = Math.floor(Number(quantity));
  if (!Number.isFinite(next) || next < 0) return 0;
  return Math.min(next, MAX_QUANTITY);
}

/**
 * 주문명. 네이버페이는 "외 N개"를 자체적으로 붙이므로
 * 상품이 여러 개여도 첫 상품명만 보낸다.
 *
 * @param {{ productName: string }[]} items
 */
export function orderNameFromItems(items) {
  const first = items[0]?.productName?.trim() || "앤클로이 주문";
  return first.slice(0, 100);
}

/**
 * DB에서 읽은 상품과 수량으로만 금액을 만든다.
 * 호출하는 쪽은 클라이언트가 보낸 가격을 이 함수에 넣지 않는다.
 *
 * @param {{ product: { id: string, name: string, price: number }, quantity: number }[]} rows
 */
export function priceLines(rows) {
  const items = [];
  let itemsTotal = 0;

  for (const row of rows) {
    const lineTotal = row.product.price * row.quantity;
    itemsTotal += lineTotal;
    items.push({
      productId: row.product.id,
      productName: row.product.name,
      unitPrice: row.product.price,
      quantity: row.quantity,
      lineTotal,
    });
  }

  const shippingFee = calculateShippingFee(itemsTotal);

  return {
    items,
    itemsTotal,
    shippingFee,
    totalAmount: itemsTotal + shippingFee,
    orderName: orderNameFromItems(items),
  };
}
