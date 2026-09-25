import "dotenv/config";
import { prisma } from "../lib/prisma.js";
// 화면 문장과 같은 id. price 는 여기 값을 DB Product.price 로 옮기는 시드다.
import { products } from "../../frontend/lib/products.js";

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      create: {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.image ?? null,
        isActive: true,
      },
      update: {
        name: product.name,
        price: product.price,
        imageUrl: product.image ?? null,
        isActive: true,
      },
    });
    console.log("seeded", product.id, product.price);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
