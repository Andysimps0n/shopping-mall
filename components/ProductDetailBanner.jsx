import ProductImage from "./ProductImage";
import { getProductBanner } from "@/lib/banners";
import { getProductImageSrc } from "@/lib/products";

function BannerEyebrow({ children }) {
  return <p className="banner-eyebrow">{children}</p>;
}

function BannerStill({ product, className }) {
  const src = getProductImageSrc(product);

  return (
    <div className={className}>
      <ProductImage
        name={product.name}
        categoryLabel={product.categoryLabel}
        src={src}
        size="banner"
      />
    </div>
  );
}

// Short overlay used when a product does not yet have long-form copy.
function FallbackBanner({ product }) {
  return (
    <div className="product-page-banner-fallback">
      <ProductImage
        name={product.name}
        categoryLabel={product.categoryLabel}
        src={getProductImageSrc(product)}
        size="banner"
      />
      <div className="product-page-banner-content">
        <p className="product-page-banner-eyebrow">AnnChloe</p>
        <p className="product-page-banner-copy">{product.tagline}</p>
      </div>
    </div>
  );
}

/**
 * Long-form PDP banner under the gallery image.
 * Renders editorial storytelling when `lib/banners.js` has an entry
 * for this product id. Other products keep the short tagline fallback.
 */
export default function ProductDetailBanner({ product }) {
  const banner = getProductBanner(product.id);

  if (!banner) {
    return <FallbackBanner product={product} />;
  }

  return (
    <article
      className="ProductDetailBanner"
      aria-label={`${product.name} 상세 스토리`}
    >
      <header className="banner-hero">
        <div className="banner-hero-copy">
          <BannerEyebrow>{banner.eyebrow}</BannerEyebrow>
          <p className="banner-kicker">{banner.kicker}</p>
          <h2 className="banner-hero-heading">{banner.headline}</h2>
          <p className="banner-lede">{banner.lede}</p>
        </div>
        <BannerStill product={product} className="banner-hero-media" />
      </header>

      <section
        className="banner-block"
        aria-labelledby="banner-formula-heading"
      >
        <h3 id="banner-formula-heading" className="banner-section-heading">
          아미노산으로 씻는 이유
        </h3>
        {banner.formula.map((paragraph) => (
          <p key={paragraph} className="banner-copy">
            {paragraph}
          </p>
        ))}
      </section>

      <section
        className="banner-block banner-block--wash"
        aria-labelledby="banner-symptoms-heading"
      >
        <BannerEyebrow>{banner.symptomsEyebrow}</BannerEyebrow>
        <h3 id="banner-symptoms-heading" className="banner-section-heading">
          {banner.symptomsHeading}
        </h3>
        <p className="banner-lede">{banner.symptomsLede}</p>
        <ul className="banner-checklist">
          {banner.symptoms.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section
        className="banner-block"
        aria-labelledby="banner-benefits-heading"
      >
        <h3 id="banner-benefits-heading" className="banner-section-heading">
          {banner.benefitsHeading}
        </h3>
        <ol className="banner-benefits">
          {banner.benefits.map((item) => (
            <li key={item.index} className="banner-benefit">
              <p className="banner-index">{item.index}</p>
              <h4 className="banner-item-title">{item.title}</h4>
              <p className="banner-item-body">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="banner-block banner-block--wash"
        aria-labelledby="banner-free-heading"
      >
        <BannerEyebrow>{banner.freeEyebrow}</BannerEyebrow>
        <h3 id="banner-free-heading" className="banner-section-heading">
          {banner.freeHeading}
        </h3>
        <p className="banner-lede">{banner.freeLede}</p>
        <ul className="banner-free-list">
          {banner.freeFrom.map((item) => (
            <li key={item.title} className="banner-free-item">
              <h4 className="banner-item-title">{item.title}</h4>
              <p className="banner-item-body">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="banner-block"
        aria-labelledby="banner-points-heading"
      >
        <h3 id="banner-points-heading" className="banner-section-heading">
          {banner.pointsHeading}
        </h3>
        <p className="banner-lede">{banner.pointsLede}</p>
        <ol className="banner-points">
          {banner.points.map((item) => (
            <li key={item.index} className="banner-point">
              <p className="banner-index">{item.index}</p>
              <div>
                <h4 className="banner-item-title">{item.title}</h4>
                <p className="banner-item-body">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="banner-block banner-block--ink"
        aria-labelledby="banner-science-heading"
      >
        <div className="banner-science-copy">
          <BannerEyebrow>{banner.scienceEyebrow}</BannerEyebrow>
          <h3 id="banner-science-heading" className="banner-section-heading">
            {banner.scienceHeading}
          </h3>
          <p className="banner-lede">{banner.scienceLede}</p>
          {banner.science.map((paragraph) => (
            <p key={paragraph} className="banner-copy">
              {paragraph}
            </p>
          ))}
          <div className="banner-orp">
            {banner.orpCompare.map((item) => (
              <div key={item.label} className="banner-orp-item">
                <p className="banner-orp-label">{item.label}</p>
                <p className="banner-orp-value">{item.value}</p>
                <p className="banner-orp-hint">{item.hint}</p>
              </div>
            ))}
          </div>
          <p className="banner-note">{banner.orpNote}</p>
        </div>
        <BannerStill product={product} className="banner-science-media" />
      </section>

      <section
        className="banner-block"
        aria-labelledby="banner-stats-heading"
      >
        <BannerEyebrow>{banner.statsEyebrow}</BannerEyebrow>
        <h3 id="banner-stats-heading" className="banner-section-heading">
          {banner.statsHeading}
        </h3>
        <p className="banner-lede">{banner.statsLede}</p>
        <ul className="banner-stats">
          {banner.stats.map((item) => (
            <li key={item.label} className="banner-stat">
              <p className="banner-stat-value">{item.value}</p>
              <p className="banner-stat-label">{item.label}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="banner-block banner-block--wash"
        aria-labelledby="banner-howto-heading"
      >
        <h3 id="banner-howto-heading" className="banner-section-heading">
          {banner.howToHeading}
        </h3>
        <p className="banner-tip">{banner.howToTip}</p>
        <ol className="banner-steps">
          {banner.steps.map((item) => (
            <li key={item.index} className="banner-step">
              <p className="banner-index">{item.index}</p>
              <p className="banner-item-body">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="banner-block banner-block--quiet"
        aria-labelledby="banner-caution-heading"
      >
        <h3 id="banner-caution-heading" className="banner-quiet-heading">
          {banner.cautionHeading}
        </h3>
        <ul className="banner-cautions">
          {banner.cautions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3 className="banner-quiet-heading">{banner.ingredientsHeading}</h3>
        <p className="banner-ingredients">{banner.ingredients}</p>
      </section>
    </article>
  );
}
