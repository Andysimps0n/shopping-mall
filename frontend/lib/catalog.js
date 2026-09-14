// DB읽고 Frontend에서 렌더링하는 방식으로 데이터 반환


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

export async function getProducts() {
  const rows = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toStoreProduct);
}

export async function getProductById(id) {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toStoreProduct(row) : undefined;
}

export async function getRecommendedProducts(productId, count = 4) {
  const products = await getProducts();
  const current = products.find((item) => item.id === productId);
  const others = products.filter((item) => item.id !== productId);
  if (!current) return others.slice(0, count);

  const sameCategory = others.filter((item) => item.category === current.category);
  const otherCategories = others.filter((item) => item.category !== current.category);
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