import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import BrandIntro from "@/components/BrandIntro";
import { fetchPriceMap } from "@/lib/fetchPrice";
import { products, getCollectionSections } from "@/lib/products";

// 가격은 DB에 있다. 빌드 시점에 숫자를 박아 두면 나중에 바꿔도 옛 값이 남는다.
export const dynamic = "force-dynamic";

export default async function Home() {
  const sections = getCollectionSections();
  const prices = await fetchPriceMap();

  return (
    <main className="Home">
      <HeroCarousel products={products} prices={prices} />
      <BrandIntro />
      <ProductGrid sections={sections} prices={prices} />
    </main>
  );
}
