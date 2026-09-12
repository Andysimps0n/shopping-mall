import Link from "next/link";
import ProductBackButton from "./ProductBackButton";
import ProductCard from "./ProductCard";
import ProductDetailBanner from "./ProductDetailBanner";
import ProductImage from "./ProductImage";
import ProductReviews from "./ProductReviews";
import { getProductBanner } from "@/lib/productBanners";
import { formatPrice, getCollectionSectionId, getProductPhotoSrc } from "@/lib/products";

/**
 * Product detail layout:
 * - Left column (majority of the width): large product image, then a long banner.
 * - Right column: name, story, price, buy button. Stays sticky while you scroll.
 * - Below: customer reviews, then four recommended product cards.
 *
 * The long banner is opt-in per product. If `getProductBanner(id)` returns
 * content, we render the editorial story. Products without an entry keep
 * the short placeholder. Each banner can skip sections it has no copy for.
 */
export default function ProductDetail({ product, recommended, reviews }) {
  const banner = getProductBanner(product.id);
  const imageSrc = getProductPhotoSrc(product);

  return (
    <main className="ProductPage">
      <section className="product-page-layout" aria-labelledby="product-name">
        <div className="product-page-gallery">
          <div className="product-page-media">
            <ProductBackButton />
            <ProductImage
              name={product.name}
              categoryLabel={product.categoryLabel}
              src={imageSrc}
              size="detail"
            />
          </div>

          {banner ? (
            <ProductDetailBanner
              product={product}
              banner={banner}
              imageSrc={imageSrc}
            />
          ) : (
            <div className="product-page-banner">
              <ProductImage
                name={product.name}
                categoryLabel={product.categoryLabel}
                size="banner"
              />
              <div className="product-page-banner-content">
                <p className="product-page-banner-eyebrow">AnnChloe</p>
                <p className="product-page-banner-copy">{product.tagline}</p>
              </div>
            </div>
          )}
        </div>

        <aside className="product-page-info">
          <div className="product-page-info-content">
            <nav className="product-page-breadcrumb" aria-label="경로">
              <Link href="/">Home</Link>
              <span aria-hidden="true"> / </span>
              <Link href={`/#${getCollectionSectionId(product.category)}`}>
                {product.categoryLabel}
              </Link>
            </nav>

            <p className="product-page-category">{product.categoryLabel}</p>
            <h1 id="product-name" className="product-page-name">
              {product.name}
            </h1>
            <p className="product-page-tagline">{product.tagline}</p>
            <p className="product-page-description">{product.description}</p>
            <p className="product-page-story">{product.story}</p>
            <p className="product-page-price">{formatPrice(product.price)}</p>

            <div className="product-page-actions">
              <button type="button" className="button product-page-buy">
                구매하기
              </button>
              <button
                type="button"
                className="button button--secondary product-page-cart"
              >
                장바구니
              </button>
            </div>
          </div>
        </aside>
      </section>

      <ProductReviews reviews={reviews} />

      <section
        className="ProductRecommend"
        aria-labelledby="recommend-heading"
      >
        <div className="recommend-wrapper container">
          <h2 id="recommend-heading" className="recommend-heading">
            회원님을 위한 추천 제품
          </h2>

          <div className="recommend-content">
            {recommended.map((item) => (
              <ProductCard key={item.id} product={item} compact />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
