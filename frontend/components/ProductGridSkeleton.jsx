import ProductSkeleton from "./ProductSkeleton";

// Stack of product-row skeletons while the catalog is still loading.
export default function ProductGridSkeleton({ count = 6, flush = false }) {
  const placeholders = Array.from({ length: count }, (_, index) => index);

  return (
    <div
      className={
        flush ? "ProductGridSkeleton ProductGridSkeleton--flush" : "ProductGridSkeleton"
      }
    >
      {placeholders.map((index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}
