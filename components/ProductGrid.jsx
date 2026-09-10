import ProductCard from "./ProductCard";
import { products } from "@/lib/products";

// Home catalog under the hero: two large cards per row so shoppers can
// scan the full collection without scrolling sideways.
export default function ProductGrid() {
  return (
    <section id="collection" className="ProductGrid" aria-labelledby="grid-heading">
      <div className="grid-wrapper container">
        <h2 id="grid-heading" className="grid-heading">
          COLLECTION
        </h2>
        <p className="grid-copy">
          헤어 · 두피 · 피부 케어를 큰 카드로 한눈에 살펴보세요
        </p>

        <div className="grid-content">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
