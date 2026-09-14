// Catalog data for the storefront. Rows live in Postgres (Prisma).
// We cache the full list so clicking a product card does not wait on
// a new Neon round-trip every time (the DB is in us-east-2).

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "./db";
import { CATEGORY_LABELS, COLLECTION_SECTIONS } from "./products";

function toStoreProduct(row) {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    price: row.price,
    category: row.category,
    categoryLabel: CATEGORY_LABELS[row.category],
    image: row.image ?? undefined,
    heroImage: row.heroImage ?? undefined,
    imageZoom: row.imageZoom ?? undefined,
    story: row.story,
  };
}

async function fetchProductsFromDb() {
  const rows = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toStoreProduct);
}

// Cross-request cache: reuse the list for 60 seconds.
const getCachedProducts = unstable_cache(fetchProductsFromDb, ["catalog-products"], {
  revalidate: 60,
});

// Per-request cache: metadata + page + recommendations share one fetch.
export const getProducts = cache(async () => getCachedProducts());

export async function getProductById(id) {
  const products = await getProducts();
  return products.find((product) => product.id === id);
}

export async function getRecommendedProducts(productId, count = 4) {
  const products = await getProducts();
  const current = products.find((item) => item.id === productId);
  const others = products.filter((item) => item.id !== productId);
  if (!current) return others.slice(0, count);

  const sameCategory = others.filter((item) => item.category === current.category);
  const otherCategories = others.filter(
    (item) => item.category !== current.category,
  );
  return [...sameCategory, ...otherCategories].slice(0, count);
}

export async function getCollectionSections() {
  const products = await getProducts();
  return COLLECTION_SECTIONS.map((section) => ({
    ...section,
    products: products.filter((item) =>
      section.categories.includes(item.category),
    ),
  }));
}
