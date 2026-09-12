import ProductCard from "./ProductCard";
import { getCollectionSections } from "@/lib/products";

// Home catalog under the hero. Each category is its own grid so
// 헤어 케어 and 피부 케어 read as equal, top-level titles — matching
// the header links, not as children under a "Collection" label.
export default function ProductGrid() {
  const sections = getCollectionSections();

  return (
    <div id="collection">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="ProductGrid"
          aria-labelledby={`${section.id}-heading`}
        >
          <div className="grid-wrapper container">
            <h2 id={`${section.id}-heading`} className="grid-heading">
              {section.title}
            </h2>
            <p className="grid-copy">{section.copy}</p>
            <div className="grid-content">
              {section.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
