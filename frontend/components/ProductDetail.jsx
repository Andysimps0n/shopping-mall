import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";
import ProductBackButton from "./ProductBackButton";
import ProductCard from "./ProductCard";
import ProductDetailBanner from "./ProductDetailBanner";
import ProductImage from "./ProductImage";
import ProductInformation from "./ProductInformation";
import ProductIngredients from "./ProductIngredients";
import ProductPageTabs from "./ProductPageTabs";
import ProductPlaceholderBanner from "./ProductPlaceholderBanner";
import ProductReviews from "./ProductReviews";
import { getProductBanner } from "@/lib/productBanners";
import { formatPrice, getCollectionSectionId, getProductPhotoSrc } from "@/lib/products";
import { fetchPrice } from "@/lib/fetchPrice";


export default async function ProductDetail({ id, product, recommended, reviews }) {
  const banner = getProductBanner(product.id);
  const imageSrc = getProductPhotoSrc(product);

  const price = (await fetchPrice(id))?.price;
  

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

          <div id="product-information" className="product-page-catalog">
            <ProductPageTabs />

            {banner ? (
              <ProductDetailBanner
                product={product}
                banner={banner}
                imageSrc={imageSrc}
              />
            ) : (
              <ProductPlaceholderBanner product={product} />
            )}

            <section
              className="banner-block"
              aria-labelledby="product-information-heading"
            >
              <h2
                id="product-information-heading"
                className="product-information-heading"
              >
                제품 정보
              </h2>
              <ProductInformation product={product} />
            </section>
          </div>
        </div>

        <aside className="product-page-info">
          <div className="product-page-info-content">
            <nav className="product-page-breadcrumb" aria-label="경로">
              <Link href="/">홈</Link>
              <span aria-hidden="true"> / </span>
              <Link href={`/#${getCollectionSectionId(product.category)}`}>
                {product.categoryLabel}
              </Link>
            </nav>

            <h1 id="product-name" className="product-page-name">
              {product.name}
            </h1>
            <p className="product-page-description">{product.description}</p>
            <p className="product-page-price">{price != null ? formatPrice(price) : "가격 확인 중"}</p>

            <div className="product-page-actions">
              <AddToCartButton productId={product.id} />
              <button type="button" className="button button--secondary product-page-buy">
                구매하기
              </button>
              <WishlistButton productId={product.id} />
            </div>
          </div>
        </aside>
      </section>

      <ProductIngredients product={product} />

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
