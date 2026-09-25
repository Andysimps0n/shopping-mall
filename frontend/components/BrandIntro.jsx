import Link from "next/link";

// One sentence from the brand page, then a text link.
// The longer story lives on /brand, so the home catalog can start sooner.
export default function BrandIntro() {
  return (
    <section className="BrandIntro" aria-labelledby="brand-intro-heading">
      <div className="intro-wrapper container">
        <p id="brand-intro-heading" className="intro-copy">
          무늬만 천연이 아니라, 빼야 할 여섯 가지를 뺀 퍼펙트 천연. 침투가
          아니라 순환으로 헤어, 두피, 피부를 돌봅니다.
        </p>
        <Link href="/brand" className="intro-link">
          브랜드 이야기
        </Link>
      </div>
    </section>
  );
}
