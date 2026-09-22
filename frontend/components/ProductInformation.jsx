import {
  formatCautionSubItems,
  getProductInformation,
} from "@/lib/productInformation";

/**
 * Legal / label table. The "INFORMATION" heading lives on the parent
 * section in ProductDetail, the same way story headings sit on the banner.
 * This file only draws the table itself.
 */
export default function ProductInformation({ product }) {
  const { rows } = getProductInformation(product);

  return (
    <article className="ProductInformation product-information-card">
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
  );
}
