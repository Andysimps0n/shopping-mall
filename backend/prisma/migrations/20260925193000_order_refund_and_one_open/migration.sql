-- 금액이 달라 취소한 결과를 주문에 남긴다.
CREATE TYPE "RefundStatus" AS ENUM ('SUCCEEDED', 'FAILED');

ALTER TABLE "orders" ADD COLUMN "refundStatus" "RefundStatus",
ADD COLUMN "refundMessage" TEXT;

-- 한 사용자에게 열린 주문은 하나만 둔다.
-- 이미 두 건 이상이면 가장 최근 것만 남기고 나머지는 닫는다.
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "createdAt" DESC) AS n
  FROM "orders"
  WHERE status IN ('PENDING', 'CONFIRMING')
)
UPDATE "orders"
SET status = 'FAILED',
    "failureMessage" = '결제 확인 시간이 지났습니다.'
WHERE id IN (SELECT id FROM ranked WHERE n > 1);

CREATE UNIQUE INDEX "orders_one_open_per_user"
ON "orders" ("userId")
WHERE status IN ('PENDING', 'CONFIRMING');
