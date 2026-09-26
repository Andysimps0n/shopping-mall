-- Keep one row for each identical place. Prefer the default, then the oldest.
DELETE FROM "shipping_addresses" AS extra
USING "shipping_addresses" AS kept
WHERE extra."userId" = kept."userId"
  AND extra."postalCode" = kept."postalCode"
  AND extra.address1 = kept.address1
  AND extra.address2 = kept.address2
  AND extra.id <> kept.id
  AND (
    (extra."isDefault" = false AND kept."isDefault" = true)
    OR (
      extra."isDefault" = kept."isDefault"
      AND (
        extra."createdAt" > kept."createdAt"
        OR (extra."createdAt" = kept."createdAt" AND extra.id > kept.id)
      )
    )
  );

-- CreateIndex
CREATE UNIQUE INDEX "shipping_addresses_userId_postalCode_address1_address2_key" ON "shipping_addresses"("userId", "postalCode", "address1", "address2");
