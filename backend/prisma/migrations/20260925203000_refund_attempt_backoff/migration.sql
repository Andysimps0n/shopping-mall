-- 환불 재시도 횟수와 마지막 시도 시각. 화면을 열 때마다 취소 API를 부르지 않는다.
ALTER TABLE "orders" ADD COLUMN "refundAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "refundAttemptAt" TIMESTAMP(3);
