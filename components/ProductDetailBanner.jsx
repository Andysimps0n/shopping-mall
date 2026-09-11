/**
 * Long-form product story that sits under the gallery image.
 *
 * This component is data-driven: it only renders when `banner` is passed in.
 * ProductDetail looks the content up by product id, so other catalog items
 * can get a banner later without changing this layout.
 *
 * @param {object} props
 * @param {object} props.product
 * @param {import("@/lib/productBanners").ProductBanner} props.banner
 * @param {string} [props.imageSrc] Real photo path, if one exists in /public.
 */
export default function ProductDetailBanner({ product, banner, imageSrc }) {
  return (
    <article
      className="ProductDetailBanner"
      aria-labelledby="banner-hero-heading"
    >
      <section className="banner-block banner-hero">
        <p className="banner-kicker">{banner.kicker}</p>
        <h2 id="banner-hero-heading" className="banner-heading">
          {splitLines(banner.heading)}
        </h2>
        <p className="banner-copy">{banner.intro}</p>

        {imageSrc ? (
          <figure className="banner-hero-media">
            <img
              src={imageSrc}
              alt={`${product.name} 제품`}
              className="banner-hero-photo"
            />
          </figure>
        ) : null}
      </section>

      <section
        className="banner-block"
        aria-labelledby="banner-pillars-heading"
      >
        <h3 id="banner-pillars-heading" className="banner-subheading">
          네 가지 케어
        </h3>
        <ul className="banner-pillars">
          {banner.pillars.map((pillar, index) => (
            <li key={pillar.title} className="banner-pillar">
              <p className="banner-pillar-index">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h4 className="banner-pillar-title">{pillar.title}</h4>
              <p className="banner-pillar-copy">{pillar.copy}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="banner-block banner-block--wash"
        aria-labelledby="banner-symptoms-heading"
      >
        <h3 id="banner-symptoms-heading" className="banner-heading banner-heading--sm">
          {splitLines(banner.symptomsHeading)}
        </h3>
        <p className="banner-copy">{banner.symptomsLead}</p>
        <ul className="banner-symptoms">
          {banner.symptoms.map((symptom) => (
            <li key={symptom}>{symptom}</li>
          ))}
        </ul>
      </section>

      <section
        className="banner-block"
        aria-labelledby="banner-free-heading"
      >
        <h3 id="banner-free-heading" className="banner-heading banner-heading--sm">
          {splitLines(banner.freeHeading)}
        </h3>
        <p className="banner-copy">{banner.freeLead}</p>
        <p className="banner-highlights">
          {banner.freeHighlights.map((item) => (
            <span key={item} className="banner-highlight">
              {item}
            </span>
          ))}
        </p>
        <ul className="banner-free-list">
          {banner.freeItems.map((item) => (
            <li key={item.title} className="banner-free-item">
              <h4 className="banner-free-title">{item.title}</h4>
              <p className="banner-free-copy">{item.copy}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="banner-block banner-block--wash"
        aria-labelledby="banner-points-heading"
      >
        <h3 id="banner-points-heading" className="banner-heading banner-heading--sm">
          {splitLines(banner.pointsHeading)}
        </h3>
        <p className="banner-copy">{banner.pointsLead}</p>
        <ol className="banner-points">
          {banner.points.map((point) => (
            <li key={point.index} className="banner-point">
              <p className="banner-point-index" aria-hidden="true">
                {point.index}
              </p>
              <div>
                <h4 className="banner-point-title">{point.title}</h4>
                <p className="banner-point-copy">{point.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="banner-block banner-block--ink"
        aria-labelledby="banner-science-heading"
      >
        <p className="banner-kicker banner-kicker--on-ink">{banner.scienceKicker}</p>
        <h3 id="banner-science-heading" className="banner-heading banner-heading--on-ink">
          {banner.scienceHeading}
        </h3>
        <p className="banner-lead banner-lead--on-ink">{banner.scienceLead}</p>
        {banner.scienceCopy.map((paragraph) => (
          <p key={paragraph} className="banner-copy banner-copy--on-ink">
            {paragraph}
          </p>
        ))}
        <p className="banner-footnote">{banner.scienceFootnote}</p>
      </section>

      <section
        className="banner-block"
        aria-labelledby="banner-stats-heading"
      >
        <h3 id="banner-stats-heading" className="banner-heading banner-heading--sm">
          {splitLines(banner.statsHeading)}
        </h3>
        <p className="banner-copy">{banner.statsLead}</p>
        <ul className="banner-stats">
          {banner.stats.map((stat) => (
            <li key={stat.label} className="banner-stat">
              <p className="banner-stat-value">{stat.value}</p>
              <p className="banner-stat-label">{stat.label}</p>
            </li>
          ))}
        </ul>
        <p className="banner-caption">{banner.statsCaption}</p>
      </section>

      <section
        className="banner-block banner-block--wash banner-guide"
        aria-labelledby="banner-how-heading"
      >
        <h3 id="banner-how-heading" className="banner-heading banner-heading--sm">
          {banner.howHeading}
        </h3>
        <p className="banner-note">{banner.howNote}</p>
        <ol className="banner-steps">
          {banner.howSteps.map((step, index) => (
            <li key={step} className="banner-step">
              <span className="banner-step-index" aria-hidden="true">
                {index + 1}
              </span>
              <p>{step}</p>
            </li>
          ))}
        </ol>

        <h3 className="banner-guide-heading">{banner.cautionHeading}</h3>
        <ul className="banner-cautions">
          {banner.cautions.map((caution) => (
            <li key={caution}>{caution}</li>
          ))}
        </ul>

        <h3 className="banner-guide-heading">{banner.ingredientsHeading}</h3>
        <p className="banner-ingredients">{banner.ingredients}</p>
      </section>
    </article>
  );
}

// Headlines in the data file use \n so a designer can control line breaks
// without putting JSX in the copy. We turn each line into a <span> that
// CSS can stack with `display: block`.
function splitLines(text) {
  return text.split("\n").map((line) => (
    <span key={line} className="banner-heading-line">
      {line}
    </span>
  ));
}
