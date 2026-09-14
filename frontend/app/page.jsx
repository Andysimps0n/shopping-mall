import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import BrandIntro from "@/components/BrandIntro";
import { getProducts, getCollectionSections } from "@/lib/catalog";


export default async function Home() {
  const products = await getProducts();
  const sections = await getCollectionSections();


  return (
    <main className="Home">
      <HeroCarousel products={products} />
      <BrandIntro />
      <ProductGrid sections={sections} />
    </main>
  );
}
