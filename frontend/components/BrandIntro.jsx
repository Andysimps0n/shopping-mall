import Link from "next/link";
import { brandPage } from "@/lib/brand";

// One sentence from the brand page, then a text link.
// The longer story lives on /brand, so the home catalog can start sooner.
export default function BrandIntro() {
  return (
    <section className="BrandIntro" aria-labelledby="brand-intro-heading">
      <div className="intro-wrapper container">
        <p id="brand-intro-heading" className="intro-copy">
          {brandPage.statement.sentence}
        </p>
        <Link href="/brand" className="intro-link">
          브랜드 이야기
        </Link>
      </div>
    </section>
  );
}
