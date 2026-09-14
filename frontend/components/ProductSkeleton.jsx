// One gray product row: square on the left, text lines on the right.
// Matches the loading wireframe — not a real product.

export default function ProductSkeleton() {
  return (
    <article className="ProductSkeleton" aria-hidden="true">
      <div className="product-skeleton-thumb" />
      <div className="product-skeleton-lines">
        <span className="product-skeleton-line" />
        <span className="product-skeleton-line" />
        <span className="product-skeleton-line" />
        <span className="product-skeleton-line product-skeleton-line--short" />
      </div>
    </article>
  );
}
