// A quiet closing footer so the page ends intentionally rather than abruptly.
export default function Footer() {
  return (
    <footer className="Footer">
      <div className="footer-wrapper container">
        <div className="footer-content">
          <div className="footer-brand">
            <p className="footer-title">AnnChloe</p>
            <p className="footer-copy">
              Beauty People, 살롱이 큐레이션한 헤어, 두피, 피부 케어
            </p>
          </div>
          <p className="footer-legal">
            © {new Date().getFullYear()} Ann Chloe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
