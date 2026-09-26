-- 배송지는 주소만 둔다. 받는 사람과 전화번호는 주문할 때 따로 받는다.
ALTER TABLE "shipping_addresses" DROP COLUMN "recipientName";
ALTER TABLE "shipping_addresses" DROP COLUMN "phone";
