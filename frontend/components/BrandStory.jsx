import Link from "next/link";
import { brand } from "@/frontend/lib/brand";

// Small line icons for the 6無 cards. Same stroke language as the header
// icons — thin, round caps, no fill — so the brand page does not suddenly
// look like a different site.
function FreeIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "brand-free-icon",
    "aria-hidden": true,
  };

  if (name === "oil") {
    return (
      <svg {...common}>
        <path d="M12 3s5 6.2 5 10.2A5 5 0 0 1 7 13.2C7 9.2 12 3 12 3z" />
        <path d="M5 19h14" />
      </svg>
    );
  }

  if (name === "preservative") {
    return (
      <svg {...common}>
        <path d="M9 3h6" />
        <path d="M10 3v4.5L7 12v7a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-7l-3-4.5V3" />
      </svg>
    );
  }

  if (name === "alcohol") {
    return (
      <svg {...common}>
        <path d="M8 3h8" />
        <path d="M9 3v6l-3 8a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4l-3-8V3" />
      </svg>
    );
  }

  if (name === "surfactant") {
    return (
      <svg {...common}>
        <circle cx="7" cy="12" r="2.5" />
        <circle cx="17" cy="7" r="2.5" />
        <circle cx="17" cy="17" r="2.5" />
        <path d="M9.2 10.8 14.8 8.2" />
        <path d="M9.2 13.2 14.8 15.8" />
      </svg>
    );
  }

  if (name === "color") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M5 14c3-1 5-5 7-9 2 4 4 8 7 9" />
      <path d="M12 5v14" />
    </svg>
  );
}

function BrandIndexList({ items, className }) {
  return (
    <ol className={className}>
      {items.map((item) => (
        <li key={item.index} className="brand-index-card">
          <p className="brand-pillar-index">{item.index}</p>
          <h3 className="brand-pillar-title">{item.title}</h3>
          <p className="brand-pillar-copy">{item.copy}</p>
        </li>
      ))}
    </ol>
  );
}

// Full brand story for /brand. Copy lives in lib/brand.js so this file
// stays about layout. The order follows the catalog PDF: cover →
// philosophy → 6無 → challenge → turnover → mineral → approach →
// vial → word of mouth → who-it's-for / stats → company close.
export default function BrandStory() {
  return (
    <main className="BrandPage">
      <section className="brand-hero" aria-labelledby="brand-page-heading">
        <div className="brand-hero-copy container">
          <p className="brand-eyebrow">{brand.eyebrow}</p>
          <p className="brand-kicker">{brand.kicker}</p>
          <p className="brand-heading-line">{brand.headingLine}</p>
          <h1 id="brand-page-heading" className="brand-heading">
            {brand.heading}
          </h1>
          <p className="brand-lead">{brand.lead}</p>

          <ul className="brand-highlights">
            {brand.highlights.map((item) => (
              <li key={item.value} className="brand-highlight">
                <p className="brand-highlight-value">{item.value}</p>
                <p className="brand-highlight-label">{item.label}</p>
              </li>
            ))}
          </ul>
        </div>

        <figure className="brand-hero-media">
          <img
            src={brand.lineupImage}
            alt={brand.lineupAlt}
            className="brand-hero-photo"
          />
        </figure>
      </section>

      <section
        className="brand-section"
        aria-labelledby="brand-story-heading"
      >
        <div className="brand-section-wrapper container">
          <p className="brand-eyebrow">{brand.storyKicker}</p>
          <h2 id="brand-story-heading" className="brand-section-heading">
            {brand.storyHeading}
          </h2>
          <p className="brand-lead">{brand.storyLead}</p>
          <p className="brand-copy">{brand.storyCopy}</p>

          <BrandIndexList items={brand.pillars} className="brand-pillars" />
        </div>
      </section>

      <section
        className="brand-section brand-section--wash"
        aria-labelledby="brand-free-heading"
      >
        <div className="brand-section-wrapper container">
          <p className="brand-eyebrow">{brand.freeKicker}</p>
          <h2 id="brand-free-heading" className="brand-section-heading">
            {brand.freeHeading}
          </h2>
          <p className="brand-lead">{brand.freeLead}</p>

          <ul className="brand-free-grid">
            {brand.freeItems.map((item) => (
              <li key={item.id} className="brand-free-card">
                <FreeIcon name={item.id} />
                <h3 className="brand-free-title">{item.title}</h3>
                <p className="brand-free-copy">{item.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="brand-section"
        aria-labelledby="brand-challenge-heading"
      >
        <div className="brand-section-wrapper container">
          <p className="brand-eyebrow">{brand.challengeKicker}</p>
          <h2 id="brand-challenge-heading" className="brand-section-heading">
            {brand.challengeHeading}
          </h2>
          <p className="brand-lead">{brand.challengeLead}</p>
          <p className="brand-copy">{brand.challengeCopy}</p>

          <BrandIndexList
            items={brand.challengeItems}
            className="brand-pillars"
          />
        </div>
      </section>

      <section
        className="brand-section brand-section--wash"
        aria-labelledby="brand-turnover-heading"
      >
        <div className="brand-section-wrapper container">
          <p className="brand-eyebrow">{brand.turnoverKicker}</p>
          <h2 id="brand-turnover-heading" className="brand-section-heading">
            {brand.turnoverHeading}
          </h2>
          <p className="brand-lead">{brand.turnoverLead}</p>

          <BrandIndexList
            items={brand.turnoverItems}
            className="brand-pillars"
          />
        </div>
      </section>

      <section
        className="brand-section"
        aria-labelledby="brand-mineral-heading"
      >
        <div className="brand-mineral-wrapper container">
          <figure className="brand-photo-frame">
            <img
              src={brand.mineralPhoto}
              alt={brand.mineralPhotoAlt}
              className="brand-pack-photo"
            />
          </figure>

          <div className="brand-mineral-content">
            <p className="brand-eyebrow">{brand.mineralKicker}</p>
            <h2 id="brand-mineral-heading" className="brand-section-heading">
              {brand.mineralHeading}
            </h2>
            <p className="brand-lead">{brand.mineralLead}</p>
            <p className="brand-copy">{brand.mineralCopy}</p>

            <dl className="brand-compare">
              {brand.mineralCompare.map((row) => (
                <div key={row.label} className="brand-compare-row">
                  <dt className="brand-compare-label">{row.label}</dt>
                  <dd className="brand-compare-value">{row.value}</dd>
                  <dd className="brand-compare-note">{row.note}</dd>
                </div>
              ))}
            </dl>
            <p className="brand-footnote">{brand.mineralFootnote}</p>
          </div>
        </div>
      </section>

      <section
        className="brand-section brand-section--wash"
        aria-labelledby="brand-approach-heading"
      >
        <div className="brand-section-wrapper container">
          <p className="brand-eyebrow">{brand.approachKicker}</p>
          <h2 id="brand-approach-heading" className="brand-section-heading">
            {brand.approachHeading}
          </h2>
          <p className="brand-lead">{brand.approachLead}</p>

          <BrandIndexList
            items={brand.approachItems}
            className="brand-approach-grid"
          />
        </div>
      </section>

      <section
        className="brand-section"
        aria-labelledby="brand-vial-heading"
      >
        <div className="brand-mineral-wrapper container">
          <figure className="brand-photo-frame">
            <img
              src={brand.vialPhoto}
              alt={brand.vialPhotoAlt}
              className="brand-pack-photo"
            />
          </figure>

          <div className="brand-mineral-content">
            <p className="brand-eyebrow">{brand.vialKicker}</p>
            <h2 id="brand-vial-heading" className="brand-section-heading">
              {brand.vialHeading}
            </h2>
            <p className="brand-lead">{brand.vialLead}</p>
            <p className="brand-copy">{brand.vialCopy}</p>
          </div>
        </div>
      </section>

      <section
        className="brand-quote"
        aria-labelledby="brand-quote-heading"
      >
        <div className="brand-quote-wrapper container">
          <p className="brand-eyebrow">{brand.quoteKicker}</p>
          <h2 id="brand-quote-heading" className="visually-hidden">
            {brand.quoteCredit}
          </h2>
          <blockquote className="brand-quote-text">
            {brand.quote}
          </blockquote>
          <p className="brand-quote-credit">{brand.quoteCredit}</p>
        </div>
      </section>

      <section
        className="brand-section"
        aria-labelledby="brand-for-heading"
      >
        <div className="brand-split-wrapper container">
          <div className="brand-split-copy">
            <p className="brand-eyebrow">FOR YOU</p>
            <h2 id="brand-for-heading" className="brand-section-heading">
              {brand.forHeading}
            </h2>
            <ul className="brand-for-list">
              {brand.forItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="brand-split-stats">
            <h3 className="brand-stats-heading">{brand.statsHeading}</h3>
            <p className="brand-copy">{brand.statsLead}</p>
            <ul className="brand-stats">
              {brand.stats.map((stat) => (
                <li key={stat.label} className="brand-stat">
                  <p className="brand-stat-value">{stat.value}</p>
                  <p className="brand-stat-label">{stat.label}</p>
                </li>
              ))}
            </ul>
            <p className="brand-footnote">{brand.statsCaption}</p>
          </div>
        </div>
      </section>

      <section
        className="brand-company"
        aria-labelledby="brand-company-heading"
      >
        <div className="brand-company-wrapper container">
          <p className="brand-company-wordmark">AnnChloe</p>
          <p className="brand-company-subtitle">TOTAL BEAUTY</p>
          <h2 id="brand-company-heading" className="brand-company-name">
            {brand.companyName}
          </h2>
          <p className="brand-company-address">{brand.companyAddress}</p>
          <a href={brand.companyTelHref} className="brand-company-tel">
            tel {brand.companyTelLabel}
          </a>
          <Link href={brand.companyCtaHref} className="button brand-company-button">
            {brand.companyCta}
          </Link>
        </div>
      </section>
    </main>
  );
}
