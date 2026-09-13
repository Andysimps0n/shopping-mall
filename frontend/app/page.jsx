import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import BrandIntro from "@/components/BrandIntro";

export default function Home() {
  return (
    <main className="Home">
      {/* Visual rhythm: hero carousel → 3-column product grid → brand */}
      <HeroCarousel />
      <BrandIntro />
      <ProductGrid />
    </main>
  );
}
