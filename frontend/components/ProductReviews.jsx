import StarRating from "./StarRating";
import { getAverageRating } from "@/lib/reviews";

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
                      <span className="review-card-author">{review.author}</span>,{" "}
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
