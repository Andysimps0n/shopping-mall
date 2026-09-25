import "dotenv/config";
import { prisma } from "../lib/prisma.js";
// 프론트 카탈로그에서 id·price만 빌려 씀
import { products } from "../../frontend/lib/products.js";

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      create: { id: p.id, price: p.price },
      update: { price: p.price }, // 다시 돌리면 가격 동기화
    });
    console.log("seeded", p.id, p.price);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());