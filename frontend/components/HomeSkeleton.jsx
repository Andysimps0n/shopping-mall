function ProductCardSkeleton() {
  return (
    <article className="ProductCard" aria-hidden="true">
      <div className="product-card-media">
        <div className="ProductImage ProductImage--card skeleton-box" />
      </div>
      <div className="product-card-content">
        <span className="skeleton-box product-card-skeleton-name" />
        <span className="skeleton-box product-card-skeleton-rating" />
        <span className="skeleton-box product-card-skeleton-price" />
      </div>
    </article>
  );
}

function GridSectionSkeleton({ cardCount }) {
  const cards = Array.from({ length: cardCount }, (_, index) => index);

  return (
    <section className="ProductGrid">
      <div className="grid-wrapper container">
        <div className="skeleton-box grid-skeleton-heading" />
        <div className="skeleton-box grid-skeleton-copy" />
        <div className="grid-content">
          {cards.map((index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Same home structure as page.jsx: hero, brand intro, two collection grids.
// Only photos and copy are grey boxes.
export default function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="페이지 불러오는 중">
      <section className="HeroCarousel" aria-hidden="true">
        <div className="hero-slides">
          <div className="hero-skeleton-photo skeleton-box" />
        </div>

        <div className="hero-wrapper container">
          <div className="hero-content">
            <span className="skeleton-box hero-skeleton-title" />
            <span className="skeleton-box hero-skeleton-title hero-skeleton-title--second" />
            <span className="skeleton-box hero-skeleton-name" />
            <span className="skeleton-box hero-skeleton-price" />
            <span className="skeleton-box hero-skeleton-button" />
          </div>
        </div>

        <span className="hero-arrow hero-arrow--prev hero-skeleton-arrow skeleton-box" />
        <span className="hero-arrow hero-arrow--next hero-skeleton-arrow skeleton-box" />

        <div className="hero-dots">
          <span className="hero-dot" />
          <span className="hero-dot is-active" />
          <span className="hero-dot" />
        </div>
      </section>

      <section className="BrandIntro" aria-hidden="true">
        <div className="intro-wrapper container">
          <div className="intro-content">
            <div className="skeleton-box intro-skeleton-heading" />
            <div className="skeleton-box intro-skeleton-copy" />
            <div className="skeleton-box intro-skeleton-copy intro-skeleton-copy--short" />
            <div className="skeleton-box intro-skeleton-button" />
          </div>
        </div>
      </section>

      <GridSectionSkeleton cardCount={3} />
      <GridSectionSkeleton cardCount={4} />
    </div>
  );
}
