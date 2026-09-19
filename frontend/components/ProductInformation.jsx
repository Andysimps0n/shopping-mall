import {
  formatCautionSubItems,
  getProductInformation,
} from "@/lib/productInformation";

/**
 * Legal / label table at the bottom of the product page.
 * Copy is assembled in productInformation.js so this file only lays out
 * the INFORMATION card.
 */
export default function ProductInformation({ product }) {
  const { rows } = getProductInformation(product);

  return (
    <section
      className="ProductInformation"
      aria-labelledby="product-information-heading"
    >
      <div className="product-information-wrapper container">
        <article className="product-information-card">
          <h2
            id="product-information-heading"
            className="product-information-heading"
          >
            INFORMATION
          </h2>

          <dl className="product-information-list">
            {rows.map((row) => (
              <div key={row.label} className="product-information-row">
                <dt className="product-information-label">{row.label}</dt>
                <dd className="product-information-value">
                  {row.cautions ? (
                    <ol className="product-information-cautions">
                      {row.cautions.map((item) => (
                        <li key={item.text}>
                          <span>{item.text}</span>
                          {item.subItems ? (
                            <ul className="product-information-subcautions">
                              {formatCautionSubItems(item.subItems).map(
                                (sub) => (
                                  <li key={sub}>{sub}</li>
                                ),
                              )}
                            </ul>
                          ) : null}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
    </section>
  );
}
