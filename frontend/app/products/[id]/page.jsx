import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import {
  getProductById,
  getRecommendedProducts,
  getProducts,
} from "@/lib/catalog";
import { getReviewsByProductId } from "@/lib/reviews";

// Reuse this page for 60 seconds so grid clicks are not a fresh DB trip.
export const revalidate = 60;

// Pre-build one page per product so each card has a real URL.
export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "제품을 찾을 수 없습니다 · Ann Chloe" };
  }

  return {
    title: `${product.name} · Ann Chloe`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);


  if (!product) {
    notFound();
  }

  const recommended = await getRecommendedProducts(product.id);
  const reviews = await getReviewsByProductId(product.id);

  return (
    <ProductDetail
      product={product}
      recommended={recommended}
      reviews={reviews}
    />
  );
}
