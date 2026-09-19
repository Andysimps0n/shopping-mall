"use client";

import { useId, useState } from "react";
import StorePicture from "./StorePicture";

/**
 * Long-form product story that sits under the gallery image.
 *
 * Starts collapsed so the reviews section can enter the first viewport.
 * Shoppers expand to read the full editorial story.
 *
 * This component is data-driven: it only renders when `banner` is passed in.
 * ProductDetail looks the content up by product id. Each product can include
 * only the sections it has copy for — missing arrays are skipped.
 *
 * Photos come from `banner.images` (lifestyle / studio cuts from the
 * product source files). The catalog thumbnail is only a fallback when
 * a banner has no extra photos yet.
 *
 * @param {object} props
 * @param {object} props.product
 * @param {import("@/lib/productBanners").ProductBanner} props.banner
 * @param {string} [props.imageSrc] Catalog thumbnail, used only if banner.images is empty.
 */
export default function ProductDetailBanner({ product, banner, imageSrc }) {
  // Collapsed by default so "고객 리뷰" is closer when you land on the page.
  const [expanded, setExpanded] = useState(false);
  const bodyId = useId();

  // Prefer the editorial set. Fall back to the catalog shot so older
  // banners without `images` still show a photo.
  const photos = hasItems(banner.images)
    ? banner.images
    : imageSrc
      ? [imageSrc]
      : [];

  const hasPillars = hasItems(banner.pillars);
  const hasSymptoms = hasItems(banner.symptoms);
  const hasFree = hasItems(banner.freeItems);
  const hasPoints = hasItems(banner.points);
  const hasScience = Boolean(banner.scienceHeading);
  const hasStats = hasItems(banner.stats);
  const hasHow =
    hasItems(banner.howSteps) || hasItems(banner.howGroups);
  const hasCautions = hasItems(banner.cautions);
  const hasIngredients = Boolean(banner.ingredients);
  const hasGuide = hasHow || hasCautions || hasIngredients;

  const guideHeadingId = hasHow
    ? "banner-how-heading"
    : hasCautions
      ? "banner-caution-heading"
      : "banner-ingredients-heading";

  function toggleExpanded() {
    setExpanded((prev) => !prev);
  }

  return (
    <article
      className={
        expanded
          ? "ProductDetailBanner is-expanded"
          : "ProductDetailBanner is-collapsed"
      }
      aria-labelledby="banner-hero-heading"
    >
      <section className="banner-block banner-hero">
        <p className="banner-kicker">{banner.kicker}</p>
        <p className="banner-product-name">{product.name}</p>
        <h2 id="banner-hero-heading" className="banner-heading">
          {flowText(banner.heading)}
        </h2>
        <p className="banner-copy banner-copy--preview">{banner.intro}</p>

        <button
          type="button"
          className="banner-fold-toggle"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={toggleExpanded}
        >
          {expanded ? "스토리 접기" : "제품 스토리 더보기"}
          <FoldChevron expanded={expanded} />
        </button>
      </section>

      <div
        id={bodyId}
        className="banner-fold-body"
        hidden={!expanded}
      >
        {photos[0] ? <BannerPhoto src={photos[0]} /> : null}

        {hasPillars ? (
          <section
            className="banner-block"
            aria-labelledby="banner-pillars-heading"
          >
            <h3 id="banner-pillars-heading" className="banner-subheading">
              {banner.pillarsHeading}
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
        ) : null}

        {photos[1] ? <BannerPhoto src={photos[1]} /> : null}

        {hasSymptoms ? (
          <section
            className="banner-block banner-block--wash"
            aria-labelledby="banner-symptoms-heading"
          >
            <h3
              id="banner-symptoms-heading"
              className="banner-heading banner-heading--sm"
            >
              {flowText(banner.symptomsHeading)}
            </h3>
            {banner.symptomsLead ? (
              <p className="banner-copy">{banner.symptomsLead}</p>
            ) : null}
            <ul className="banner-symptoms">
              {banner.symptoms.map((symptom) => (
                <li key={symptom}>{symptom}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {hasFree ? (
          <section
            className="banner-block"
            aria-labelledby="banner-free-heading"
          >
            <h3
              id="banner-free-heading"
              className="banner-heading banner-heading--sm"
            >
              {flowText(banner.freeHeading)}
            </h3>
            {banner.freeLead ? (
              <p className="banner-copy">{banner.freeLead}</p>
            ) : null}
            {hasItems(banner.freeHighlights) ? (
              <p className="banner-highlights">
                {banner.freeHighlights.map((item) => (
                  <span key={item} className="banner-highlight">
                    {item}
                  </span>
                ))}
              </p>
            ) : null}
            <ul className="banner-free-list">
              {banner.freeItems.map((item) => (
                <li key={item.title} className="banner-free-item">
                  <h4 className="banner-free-title">{item.title}</h4>
                  <p className="banner-free-copy">{item.copy}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {hasPoints ? (
          <section
            className="banner-block banner-block--wash"
            aria-labelledby="banner-points-heading"
          >
            <h3
              id="banner-points-heading"
              className="banner-heading banner-heading--sm"
            >
              {flowText(banner.pointsHeading)}
            </h3>
            {banner.pointsLead ? (
              <p className="banner-copy">{banner.pointsLead}</p>
            ) : null}
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
        ) : null}

        {photos[2] ? <BannerPhoto src={photos[2]} /> : null}

        {hasScience ? (
          <section
            className="banner-block banner-block--ink"
            aria-labelledby="banner-science-heading"
          >
            {banner.scienceKicker ? (
              <p className="banner-kicker banner-kicker--on-ink">
                {banner.scienceKicker}
              </p>
            ) : null}
            <h3
              id="banner-science-heading"
              className="banner-heading banner-heading--on-ink"
            >
              {flowText(banner.scienceHeading)}
            </h3>
            {banner.scienceLead ? (
              <p className="banner-lead banner-lead--on-ink">
                {banner.scienceLead}
              </p>
            ) : null}
            {hasItems(banner.scienceCopy)
              ? banner.scienceCopy.map((paragraph) => (
                  <p key={paragraph} className="banner-copy banner-copy--on-ink">
                    {paragraph}
                  </p>
                ))
              : null}
            {banner.scienceFootnote ? (
              <p className="banner-footnote">{banner.scienceFootnote}</p>
            ) : null}
          </section>
        ) : null}

        {hasStats ? (
          <section
            className="banner-block"
            aria-labelledby="banner-stats-heading"
          >
            <h3
              id="banner-stats-heading"
              className="banner-heading banner-heading--sm"
            >
              {flowText(banner.statsHeading)}
            </h3>
            {banner.statsLead ? (
              <p className="banner-copy">{banner.statsLead}</p>
            ) : null}
            <ul className="banner-stats">
              {banner.stats.map((stat) => (
                <li key={stat.label} className="banner-stat">
                  <p className="banner-stat-value">{stat.value}</p>
                  <p className="banner-stat-label">{stat.label}</p>
                </li>
              ))}
            </ul>
            {banner.statsCaption ? (
              <p className="banner-caption">{banner.statsCaption}</p>
            ) : null}
          </section>
        ) : null}

        {hasGuide ? (
          <section
            className="banner-block banner-block--wash banner-guide"
            aria-labelledby={guideHeadingId}
          >
            {hasHow ? (
              <>
                <h3
                  id="banner-how-heading"
                  className="banner-heading banner-heading--sm"
                >
                  {banner.howHeading}
                </h3>
                {banner.howNote ? (
                  <p className="banner-note">{banner.howNote}</p>
                ) : null}
                {hasItems(banner.howGroups)
                  ? banner.howGroups.map((group) => (
                      <div key={group.title} className="banner-how-group">
                        <h4 className="banner-how-group-title">{group.title}</h4>
                        {group.note ? (
                          <p className="banner-copy">{group.note}</p>
                        ) : null}
                        <ol className="banner-steps">
                          {group.steps.map((step, index) => (
                            <li
                              key={`${group.title}-${index}`}
                              className="banner-step"
                            >
                              <span
                                className="banner-step-index"
                                aria-hidden="true"
                              >
                                {index + 1}
                              </span>
                              <p>{step}</p>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))
                  : null}
                {hasItems(banner.howSteps) ? (
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
                ) : null}
              </>
            ) : null}

            {hasCautions ? (
              <>
                <h3 id="banner-caution-heading" className="banner-guide-heading">
                  {banner.cautionHeading}
                </h3>
                <ul className="banner-cautions">
                  {banner.cautions.map((caution) => (
                    <li key={caution}>{caution}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {hasIngredients ? (
              <>
                <h3
                  id="banner-ingredients-heading"
                  className="banner-guide-heading"
                >
                  {banner.ingredientsHeading}
                </h3>
                <p className="banner-ingredients">{banner.ingredients}</p>
              </>
            ) : null}
          </section>
        ) : null}

        {photos.slice(3).map((src) => (
          <BannerPhoto key={src} src={src} />
        ))}

        <div className="banner-fold-footer">
          <button
            type="button"
            className="banner-fold-toggle"
            aria-expanded={expanded}
            aria-controls={bodyId}
            onClick={toggleExpanded}
          >
            스토리 접기
            <FoldChevron expanded />
          </button>
        </div>
      </div>
    </article>
  );
}

function BannerPhoto({ src }) {
  return (
    <section className="banner-block banner-hero-media-block" aria-hidden="true">
      <figure className="banner-hero-media">
        <StorePicture
          src={src}
          alt=""
          className="banner-hero-photo"
          loading="lazy"
        />
      </figure>
    </section>
  );
}

function FoldChevron({ expanded }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        expanded ? "banner-fold-chevron is-expanded" : "banner-fold-chevron"
      }
      aria-hidden="true"
    >
      <path d="M3 6l5 5 5-5" />
    </svg>
  );
}

function hasItems(items) {
  return Array.isArray(items) && items.length > 0;
}

// Headings may still contain \n from older copy. Join them so the
// browser wraps on width, instead of forcing a new line in the middle
// of a phrase.
function flowText(text) {
  return text.replaceAll("\n", " ");
}
