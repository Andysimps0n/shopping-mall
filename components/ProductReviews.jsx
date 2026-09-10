import { getAverageRating } from "@/lib/reviews";

// One star. Filled stars use the brand color via CSS.
function StarIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      className="StarIcon"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// Renders 5 stars. `value` is a number from 1 to 5.
function StarRating({ value, label }) {
  return (
    <span className="StarRating" aria-label={label}>
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon key={index} filled={index < value} />
      ))}
    </span>
  );
}

/**
 * Customer reviews block on the product page.
 * Sits above the recommended products so shoppers see social proof first.
 */
export default function ProductReviews({ reviews }) {
  const averageRating = getAverageRating(reviews);
  const roundedAverage = Math.round(averageRating);

  return (
    <section className="ProductReviews" aria-labelledby="reviews-heading">
      <div className="reviews-wrapper container">
        <h2 id="reviews-heading" className="reviews-heading">
          고객 리뷰
        </h2>

        {reviews.length === 0 ? (
          <p className="reviews-empty">아직 등록된 리뷰가 없습니다.</p>
        ) : (
          <>
            <p className="reviews-summary">
              <StarRating
                value={roundedAverage}
                label={`평균 별점 ${averageRating}점`}
              />
              <span className="reviews-summary-score">{averageRating}</span>
              <span className="reviews-summary-count">
                {reviews.length}개의 리뷰
              </span>
            </p>

            <div className="reviews-content">
              {reviews.map((review) => (
                <article key={review.id} className="ReviewCard">
                  <header className="review-card-header">
                    <StarRating
                      value={review.rating}
                      label={`${review.rating}점`}
                    />
                    <p className="review-card-meta">
                      <span className="review-card-author">{review.author}</span>
                      <span aria-hidden="true"> · </span>
                      <time dateTime={review.date.replaceAll(".", "-")}>
                        {review.date}
                      </time>
                    </p>
                  </header>
                  <h3 className="review-card-title">{review.title}</h3>
                  <p className="review-card-body">{review.body}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
