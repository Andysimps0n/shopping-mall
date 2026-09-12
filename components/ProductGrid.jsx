import ProductCard from "./ProductCard";
import { getCollectionSections } from "@/lib/products";

// Home catalog under the hero. Products are split into the same two
// groups as the header: 헤어 케어 and 피부 케어.
export default function ProductGrid() {
  const sections = getCollectionSections();

  return (
    <section id="collection" className="ProductGrid" aria-labelledby="grid-heading">
      <div className="grid-wrapper container">
        <h2 id="grid-heading" className="grid-heading">
          COLLECTION
        </h2>
        <p className="grid-copy">
          헤어 케어와 피부 케어를 나눠 살펴보세요
        </p>

        {sections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            className="grid-group"
            aria-labelledby={`${section.id}-heading`}
          >
            <h3 id={`${section.id}-heading`} className="grid-group-heading">
              {section.title}
            </h3>
            <div className="grid-content">
              {section.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
