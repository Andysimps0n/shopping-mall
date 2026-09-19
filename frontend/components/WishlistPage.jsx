"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { useWishlist } from "./WishlistProvider";
import { getWishlistProducts } from "@/lib/wishlist";

/**
 * Saved products, shown as the same cards used on the home grid.
 * The heart on each card is the way to un-save an item.
 */
export default function WishlistPage() {
  const { ids, hasHydrated } = useWishlist();
  const products = getWishlistProducts(ids);

  if (!hasHydrated) {
    return (
      <main className="WishlistPage">
        <div className="wishlist-page-wrapper container">
          <h1 className="wishlist-page-heading">찜한 상품</h1>
          <p className="wishlist-page-loading">찜한 상품을 불러오는 중…</p>
        </div>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="WishlistPage">
        <div className="wishlist-page-wrapper container">
          <h1 className="wishlist-page-heading">찜한 상품</h1>
          <div className="wishlist-empty">
            <p className="wishlist-empty-copy">아직 찜한 상품이 없습니다.</p>
            <Link href="/#collection" className="button wishlist-empty-cta">
              쇼핑 계속하기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="WishlistPage">
      <div className="wishlist-page-wrapper container">
        <h1 className="wishlist-page-heading">찜한 상품</h1>
        <p className="wishlist-page-count">{products.length}개의 상품</p>

        <div className="grid-content">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
