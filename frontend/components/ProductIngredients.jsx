import { getProductIngredients } from "@/lib/productInformation";

/**
 * Full-ingredients block on the product page.
 * The same text also appears as a row in the legal information table.
 * This section exists so the "전성분" tab has a clear place to land.
 */
export default function ProductIngredients({ product }) {
  const ingredients = getProductIngredients(product);

  return (
    <section
      id="product-ingredients"
      className="ProductIngredients"
      aria-labelledby="product-ingredients-heading"
    >
      <div className="product-ingredients-wrapper container">
        <h2
          id="product-ingredients-heading"
          className="product-ingredients-heading"
        >
          전성분
        </h2>
        <p className="product-ingredients-copy">{ingredients}</p>
      </div>
    </section>
  );
}
