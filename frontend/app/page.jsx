import { Suspense } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import BrandIntro from "@/components/BrandIntro";
import HomeSkeleton from "@/components/HomeSkeleton";
import { getProducts, getCollectionSections } from "@/lib/catalog";

export const revalidate = 60;

async function HomeCatalog() {
  const products = await getProducts();
  const sections = await getCollectionSections();

  return (
    <>
      <HeroCarousel products={products} />
      <BrandIntro />
      <ProductGrid sections={sections} />
    </>
  );
}

export default function Home() {
  return (
    <main className="Home">
      <Suspense fallback={<HomeSkeleton />}>
        <HomeCatalog />
      </Suspense>
    </main>
  );
}
