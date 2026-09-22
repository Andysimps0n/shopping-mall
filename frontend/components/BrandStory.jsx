import Link from "next/link";
import BrandPageNav from "@/components/BrandPageNav";
import { brand, brandPage } from "@/lib/brand";
import { getProductPhotoSrc, products } from "@/lib/products";

/**
 * Editorial /brand page.
 *
 * Layout only — every sentence lives in lib/brand.js (brandPage), and the
 * product list comes from lib/products.js.
 *
 * Section order:
 *   hero → statement → salon origin → observation archive →
 *   product principles → ritual → product family → transparency + closing
 */

/**
 * Photo slot. `ratio` keeps the frame when the image is missing.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {"landscape" | "portrait" | "square"} props.ratio
 * @param {string} [props.src]
 * @param {string} [props.alt]
 */
function BrandMedia({ label, ratio, src, alt }) {
  return (
    <figure className={`bp-media bp-media--${ratio}`}>
      {src ? (
        <img src={src} alt={alt || label} className="bp-media-photo" />
      ) : (
        <span className="bp-media-label">{label}</span>
      )}
    </figure>
  );
}

export default function BrandStory() {
  const { nav, hero, statement, origin, observation, principles, ritual, family, transparency } =
    brandPage;

  return (
    <main className="BrandPage">
      {/* Outside the hero so sticky lasts for the whole page.
          Scroll direction lives in BrandPageNav (client). */}
      <BrandPageNav links={[...nav.links, nav.contact]} />

      {/* 1. Hero — lineup photo, then the title under the frame. */}
      <section className="bp-hero container" aria-label="브랜드 소개">
        <div className="bp-hero-frame">
          <img
            className="bp-hero-photo"
            src={brand.lineupImage}
            alt={brand.lineupAlt}
          />
        </div>

        <div className="bp-hero-copy">
          <div>
            <p className="bp-hero-eyebrow">{hero.eyebrow}</p>
            <h1 className="bp-hero-title">{hero.title}</h1>
          </div>
          <div className="bp-hero-aside">
            <p className="bp-hero-desc">{hero.description}</p>
            <a className="button" href={hero.ctaHref}>
              {hero.ctaLabel}
            </a>
          </div>
        </div>
      </section>

      {/* 2. Brand statement — one sentence, the longest-lasting message. */}
      <section
        id="brand-statement"
        className="bp-section"
        aria-labelledby="bp-statement-heading"
      >
        <div className="bp-statement-wrapper container">
          <p className="bp-eyebrow">{statement.eyebrow}</p>
          <h2 id="bp-statement-heading" className="bp-statement">
            {statement.sentence}
          </h2>
        </div>
      </section>

      {/* 3. Salon origin — asymmetric 7:5 split. */}
      <section
        className="bp-section bp-section--parchment"
        aria-labelledby="bp-origin-heading"
      >
        <div className="bp-origin-grid container">
          <BrandMedia
            label={origin.placeholderLabel}
            ratio="landscape"
            src="/products/shampoo/lifestyle.jpg"
            alt="앤클로이 두피 샴푸"
          />
          <div>
            <p className="bp-eyebrow">{origin.eyebrow}</p>
            <h2 id="bp-origin-heading" className="bp-section-heading">
              {origin.heading}
            </h2>
            {origin.paragraphs.map((paragraph) => (
              <p key={paragraph} className="bp-copy">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Observation archive — document list, thin dividers. */}
      <section className="bp-section" aria-labelledby="bp-observation-heading">
        <div className="container">
          <p className="bp-eyebrow">{observation.eyebrow}</p>
          <h2 id="bp-observation-heading" className="bp-section-heading">
            {observation.heading}
          </h2>

          <ol className="bp-archive-list">
            {observation.items.map((item) => (
              <li key={item.index} className="bp-archive-item">
                <span className="bp-archive-index">{item.index}</span>
                <div>
                  <h3 className="bp-archive-title">{item.title}</h3>
                  <p className="bp-archive-copy">{item.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Product principles — the trust section, styled as a record. */}
      <section
        id="principles"
        className="bp-section bp-section--parchment"
        aria-labelledby="bp-principles-heading"
      >
        <div className="container">
          <p className="bp-eyebrow">{principles.eyebrow}</p>
          <h2 id="bp-principles-heading" className="bp-section-heading">
            {principles.heading}
          </h2>
          <p className="bp-free-line">
            {brand.freeItems.map((item) => item.title).join(" · ")}
          </p>

          <dl className="bp-principles-table">
            {principles.rows.map((row) => (
              <div key={row.term} className="bp-principles-row">
                <dt>{row.term}</dt>
                <dd>{row.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 6. Ritual — portrait media + three large step numbers. */}
      <section className="bp-section" aria-labelledby="bp-ritual-heading">
        <div className="bp-ritual-grid container">
          <BrandMedia
            label={ritual.placeholderLabel}
            ratio="portrait"
            src="/products/lotion/lifestyle.jpg"
            alt="앤클로이 스킨&바디 보습 로션"
          />
          <div>
            <p className="bp-eyebrow">{ritual.eyebrow}</p>
            <h2 id="bp-ritual-heading" className="bp-section-heading">
              {ritual.heading}
            </h2>

            <ol className="bp-ritual-steps">
              {ritual.steps.map((step) => (
                <li key={step.number} className="bp-ritual-step">
                  <div className="bp-ritual-step-body">
                    <span className="bp-ritual-number" aria-hidden="true">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="bp-ritual-title">{step.title}</h3>
                      <p className="bp-ritual-copy">{step.copy}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 7. Product family — no prices, no badges, text link only. */}
      <section
        id="products"
        className="bp-section bp-section--parchment"
        aria-labelledby="bp-family-heading"
      >
        <div className="container">
          <p className="bp-eyebrow">{family.eyebrow}</p>
          <h2 id="bp-family-heading" className="bp-section-heading">
            {family.heading}
          </h2>

          <ul className="bp-family-grid">
            {products.map((product) => (
              <li key={product.id} className="bp-family-item">
                <Link
                  href={`/products/${product.id}`}
                  className="bp-family-link"
                >
                  <BrandMedia
                    label={product.name}
                    ratio="square"
                    src={getProductPhotoSrc(product)}
                    alt=""
                  />
                  <h3 className="bp-family-name">{product.name}</h3>
                  <p className="bp-family-role">{product.description}</p>
                  <span className="bp-text-link">{family.linkLabel}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. Transparency + closing. Only verifiable records. */}
      <section
        id="contact"
        className="bp-section"
        aria-labelledby="bp-transparency-heading"
      >
        <div className="container">
          <p className="bp-eyebrow">{transparency.eyebrow}</p>
          <h2 id="bp-transparency-heading" className="bp-section-heading">
            {transparency.heading}
          </h2>

          <dl className="bp-transparency-table">
            {transparency.rows.map((row) => (
              <div key={row.term} className="bp-principles-row">
                <dt>{row.term}</dt>
                <dd>{row.detail}</dd>
              </div>
            ))}
          </dl>

          <div className="bp-closing">
            <p className="bp-closing-sentence">
              {transparency.closingSentence}
            </p>
            <Link href={transparency.ctaHref} className="bp-pill bp-pill--ink">
              {transparency.ctaLabel}
            </Link>

            <p className="bp-company-line">
              {brand.companyName} · {brand.companyAddress} ·{" "}
              <a href={brand.companyTelHref}>{brand.companyTelLabel}</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
