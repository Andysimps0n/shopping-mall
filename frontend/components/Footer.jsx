import Link from "next/link";
import { business, legalLinks } from "@/lib/business";

// Quiet close. Known company lines come from brand.js via business.js.
// Representative, business number, and mail-order number are still placeholders.
export default function Footer() {
  return (
    <footer className="Footer">
      <div className="footer-wrapper container">
        <div className="footer-content">
          <div className="footer-brand">
            <p className="footer-title">AnnChloe</p>
            <p className="footer-copy">{business.companyName}</p>
            <p className="footer-copy">대표자 {business.representative}</p>
            <p className="footer-copy">사업자등록번호 {business.businessNumber}</p>
            <p className="footer-copy">
              통신판매업 신고번호 {business.mailOrderNumber}
            </p>
            <p className="footer-copy">{business.address}</p>
            <p className="footer-copy">
              <a href={business.phoneHref}>{business.phoneLabel}</a>
            </p>
            <p className="footer-copy">{business.placeholderNote}</p>
            <nav className="footer-links" aria-label="약관">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <p className="footer-legal">
            © {new Date().getFullYear()} Ann Chloe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
