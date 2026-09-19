import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import BrandIntro from "@/components/BrandIntro";
import { products, getCollectionSections } from "@/lib/products";

export default function Home() {
  const sections = getCollectionSections();

  return (
    <main className="Home">
      <HeroCarousel products={products} />
      <BrandIntro />
      <ProductGrid sections={sections} />
    </main>
  );
}
