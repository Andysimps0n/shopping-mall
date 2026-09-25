import { notFound } from "next/navigation";
import { connection } from "next/server";
import ProductDetail from "@/components/ProductDetail";
import {
  getProductById,
  getRecommendedProducts,
} from "@/lib/products";
import { getReviewsByProductId } from "@/lib/reviews";

// Do not prerender this page. The price comes from the API, and a static
// build would freeze yesterday's number.
export const dynamic = "force-dynamic";

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
  await connection();
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const recommended = getRecommendedProducts(product.id);
  const reviews = getReviewsByProductId(product.id);

  return (
    <ProductDetail
      id={id}
      product={product}
      recommended={recommended}
      reviews={reviews}
    />
  );
}
