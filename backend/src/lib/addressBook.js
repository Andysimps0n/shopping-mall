import { prisma } from "../../lib/prisma.js";
import { samePlace } from "./address.js";

/** 한 계정이 저장할 수 있는 배송지 수. */
export const MAX_ADDRESSES = 10;

function present(row) {
  return {
    id: row.id,
    postalCode: row.postalCode,
    address1: row.address1,
    address2: row.address2,
    isDefault: row.isDefault,
  };
}

function byDefaultThenAge(left, right) {
  if (left.isDefault !== right.isDefault) return left.isDefault ? -1 : 1;
  return left.createdAt - right.createdAt;
}

export async function listAddresses(userId) {
  const rows = await prisma.shippingAddress.findMany({ where: { userId } });
  rows.sort(byDefaultThenAge);
  return rows.map(present);
}

async function clearDefault(tx, userId) {
  await tx.shippingAddress.updateMany({
    where: { userId, isDefault: true },
    data: { isDefault: false },
  });
}

function isUniqueViolation(error) {
  return error?.code === "P2002";
}

export async function createAddress(userId, value) {
  try {
    return await prisma.$transaction(async (tx) => {
      const count = await tx.shippingAddress.count({ where: { userId } });
      if (count >= MAX_ADDRESSES) return { error: "address_limit" };

      const rows = await tx.shippingAddress.findMany({ where: { userId } });
      if (rows.some((row) => samePlace(row, value))) {
        return { error: "address_duplicate" };
      }

      const isDefault = value.isDefault || count === 0;
      if (isDefault) await clearDefault(tx, userId);

      await tx.shippingAddress.create({
        data: {
          userId,
          postalCode: value.postalCode,
          address1: value.address1,
          address2: value.address2,
          isDefault,
        },
      });

      const saved = await tx.shippingAddress.findMany({ where: { userId } });
      saved.sort(byDefaultThenAge);
      return { addresses: saved.map(present) };
    });
  } catch (error) {
    if (isUniqueViolation(error)) return { error: "address_duplicate" };
    throw error;
  }
}

export async function updateAddress(userId, addressId, value) {
  try {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.shippingAddress.findFirst({
        where: { id: addressId, userId },
      });
      if (!existing) return { error: "not_found" };

      const rows = await tx.shippingAddress.findMany({ where: { userId } });
      const duplicate = rows.some(
        (row) => row.id !== existing.id && samePlace(row, value),
      );
      if (duplicate) return { error: "address_duplicate" };

      const isDefault = value.isDefault || existing.isDefault;
      if (isDefault) await clearDefault(tx, userId);

      await tx.shippingAddress.update({
        where: { id: existing.id },
        data: {
          postalCode: value.postalCode,
          address1: value.address1,
          address2: value.address2,
          isDefault,
        },
      });

      const saved = await tx.shippingAddress.findMany({ where: { userId } });
      saved.sort(byDefaultThenAge);
      return { addresses: saved.map(present) };
    });
  } catch (error) {
    if (isUniqueViolation(error)) return { error: "address_duplicate" };
    throw error;
  }
}

export async function deleteAddress(userId, addressId) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.shippingAddress.findFirst({
      where: { id: addressId, userId },
    });
    if (!existing) return { error: "not_found" };

    await tx.shippingAddress.delete({ where: { id: existing.id } });

    if (existing.isDefault) {
      const next = await tx.shippingAddress.findFirst({
        where: { userId },
        orderBy: { createdAt: "asc" },
      });
      if (next) {
        await tx.shippingAddress.update({
          where: { id: next.id },
          data: { isDefault: true },
        });
      }
    }

    const rows = await tx.shippingAddress.findMany({ where: { userId } });
    rows.sort(byDefaultThenAge);
    return { addresses: rows.map(present) };
  });
}
