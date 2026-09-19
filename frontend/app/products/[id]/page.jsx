import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import {
  getProductById,
  getRecommendedProducts,
  products,
} from "@/lib/products";
import { getReviewsByProductId } from "@/lib/reviews";

// Pre-build one page per product so each card has a real URL.
export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: "제품을 찾을 수 없습니다, AnnChloe" };
  }

  return {
    title: `${product.name}, AnnChloe`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const recommended = getRecommendedProducts(product.id);
  const reviews = getReviewsByProductId(product.id);

  return (
    <ProductDetail
      product={product}
      recommended={recommended}
      reviews={reviews}
    />
  );
}
