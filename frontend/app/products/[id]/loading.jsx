import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function ProductLoading() {
  return (
    <main className="ProductPage" aria-busy="true" aria-label="상품 불러오는 중">
      <section className="product-page-layout">
        <div className="product-page-gallery">
          <div className="product-page-media">
            <div className="ProductImage ProductImage--detail product-page-loading-block" />
          </div>
        </div>
        <aside className="product-page-info">
          <div className="product-page-info-content">
            <div className="product-page-loading-line" />
            <div className="product-page-loading-line product-page-loading-line--title" />
            <div className="product-page-loading-line" />
            <div className="product-page-loading-line product-page-loading-line--short" />
          </div>
        </aside>
      </section>

      <section className="ProductRecommend">
        <div className="recommend-wrapper container">
          <ProductGridSkeleton count={6} flush />
        </div>
      </section>
    </main>
  );
}
