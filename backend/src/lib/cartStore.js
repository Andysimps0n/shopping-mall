import { prisma } from "../../lib/prisma.js";
import { capQuantity, MAX_QUANTITY, priceLines } from "./orderMath.js";

function presentCart(priced, rows) {
  const imageById = new Map(
    rows.map((row) => [row.product.id, row.product.imageUrl ?? null]),
  );

  return {
    ...priced,
    items: priced.items.map((item) => ({
      ...item,
      name: item.productName,
      imageUrl: imageById.get(item.productId) ?? null,
    })),
  };
}

const cartInclude = {
  items: {
    include: {
      product: true,
    },
    orderBy: { id: "asc" },
  },
};

async function ensureCart(userId) {
  return prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

/**
 * 팔지 않는 상품은 장바구니에서 빼고, 남은 줄의 금액은 DB 가격으로 계산한다.
 */
async function loadPricedCart(userId) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: cartInclude,
  });

  if (!cart) {
    return priceLines([]);
  }

  const staleIds = cart.items
    .filter((item) => !item.product?.isActive)
    .map((item) => item.id);

  if (staleIds.length > 0) {
    await prisma.cartItem.deleteMany({ where: { id: { in: staleIds } } });
  }

  const rows = cart.items
    .filter((item) => item.product?.isActive)
    .map((item) => ({
      product: item.product,
      quantity: capQuantity(item.quantity),
    }))
    .filter((row) => row.quantity > 0);

  return presentCart(priceLines(rows), rows);
}

export async function getCart(userId) {
  return loadPricedCart(userId);
}

async function addQuantity(userId, productId, delta) {
  const add = capQuantity(delta);
  if (add <= 0) return getCart(userId);

  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
  });
  if (!product) return null;

  const cart = await ensureCart(userId);
  const item = await prisma.cartItem.upsert({
    where: {
      cartId_productId: { cartId: cart.id, productId },
    },
    create: {
      cartId: cart.id,
      productId,
      quantity: add,
    },
    update: {
      quantity: { increment: add },
    },
  });

  if (item.quantity > MAX_QUANTITY) {
    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: MAX_QUANTITY },
    });
  }

  return getCart(userId);
}

export async function addCartItem(userId, productId, quantity = 1) {
  return addQuantity(userId, productId, quantity);
}

export async function setCartItemQuantity(userId, productId, quantity) {
  const next = capQuantity(quantity);
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return getCart(userId);

  if (next <= 0) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId },
    });
    return getCart(userId);
  }

  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
  });
  if (!product) return null;

  await prisma.cartItem.upsert({
    where: {
      cartId_productId: { cartId: cart.id, productId },
    },
    create: {
      cartId: cart.id,
      productId,
      quantity: next,
    },
    update: { quantity: next },
  });

  return getCart(userId);
}

export async function removeCartItem(userId, productId) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return getCart(userId);

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id, productId },
  });

  return getCart(userId);
}

/**
 * 로그인 전 localStorage 장바구니를 DB 장바구니에 더한다.
 * 없는 상품, 숨긴 상품은 건너뛴다. 같은 상품은 수량을 더하고 99를 넘기지 않는다.
 *
 * @param {string} userId
 * @param {unknown} rawItems
 */
export async function mergeCart(userId, rawItems) {
  const items = Array.isArray(rawItems) ? rawItems : [];

  for (const entry of items) {
    if (!entry || typeof entry !== "object") continue;
    const productId = entry.productId;
    if (typeof productId !== "string" || productId.length === 0) continue;
    await addQuantity(userId, productId, entry.quantity);
  }

  return getCart(userId);
}

export async function clearCart(userId) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

/**
 * 로그인 없이 금액만 다시 계산할 때. 장바구니에는 저장하지 않는다.
 *
 * @param {unknown} rawItems
 */
export async function quoteItems(rawItems) {
  const items = Array.isArray(rawItems) ? rawItems : [];
  const wanted = [];

  for (const entry of items) {
    if (!entry || typeof entry !== "object") continue;
    if (typeof entry.productId !== "string" || entry.productId.length === 0) {
      continue;
    }
    const quantity = capQuantity(entry.quantity);
    if (quantity <= 0) continue;
    wanted.push({ productId: entry.productId, quantity });
  }

  if (wanted.length === 0) return presentCart(priceLines([]), []);

  const products = await prisma.product.findMany({
    where: {
      id: { in: wanted.map((item) => item.productId) },
      isActive: true,
    },
  });
  const byId = new Map(products.map((product) => [product.id, product]));
  const rows = [];

  for (const item of wanted) {
    const product = byId.get(item.productId);
    if (!product) continue;
    rows.push({ product, quantity: item.quantity });
  }

  return presentCart(priceLines(rows), rows);
}
