import Link from "next/link";

// A quiet closing footer so the page ends intentionally rather than abruptly.
export default function Footer() {
  return (
    <footer className="Footer">
      <div className="footer-wrapper container">
        <div className="footer-content">
          <div className="footer-brand">
            <p className="footer-title">AnnChloe</p>
            <p className="footer-copy">
              Beauty People · 살롱이 큐레이션한 헤어 · 두피 · 피부 케어
            </p>
          </div>
          <div className="footer-aside">
            <nav className="footer-nav" aria-label="푸터 메뉴">
              <Link href="/#collection" className="footer-link">
                컬렉션
              </Link>
              <Link href="/brand" className="footer-link">
                브랜드
              </Link>
            </nav>
            <p className="footer-legal">
              © {new Date().getFullYear()} Ann Chloe. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
