import Link from "next/link";

export const metadata = {
  title: "페이지를 찾을 수 없습니다, AnnChloe",
};

/**
 * App Router 404. Unknown URLs like /foo render this inside root layout.
 * The Pages Router /404 file exists separately so `next build` does not
 * prerender Next's default `_error` page (that path crashes on 15.5).
 */
export default function NotFound() {
  return (
    <main className="NotFound">
      <div className="container">
        <div className="not-found-wrapper">
          <p className="not-found-eyebrow">404</p>
          <h1 className="not-found-heading">페이지를 찾을 수 없습니다</h1>
          <p className="not-found-copy">
            요청하신 주소가 없거나 옮겨졌습니다. 앤클로이 컬렉션으로 돌아가 보세요.
          </p>
          <Link href="/" className="not-found-cta">
            홈으로
          </Link>
        </div>
      </div>
    </main>
  );
}
