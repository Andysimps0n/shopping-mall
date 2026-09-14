import { prisma } from "../lib/prisma.js";
import { products } from "../../frontend/lib/products.js";

function toProductRow(product) {
  return {
    id: product.id,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image,
    heroImage: product.heroImage,
    imageZoom: product.imageZoom ?? null,
    story: product.story,
  };
}

async function main() {
  for (const product of products) {
    const row = toProductRow(product);

    await prisma.product.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  console.log(`seeded ${products.length} products`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });