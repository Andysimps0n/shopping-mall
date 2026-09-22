import { brand } from "@/lib/brand";

// Quiet close. Company lines come from brand.js so the address
// stays the same as the brand page.
export default function Footer() {
  return (
    <footer className="Footer">
      <div className="footer-wrapper container">
        <div className="footer-content">
          <div className="footer-brand">
            <p className="footer-title">AnnChloe</p>
            <p className="footer-copy">{brand.companyName}</p>
            <p className="footer-copy">{brand.companyAddress}</p>
            <p className="footer-copy">
              <a href={brand.companyTelHref}>{brand.companyTelLabel}</a>
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
