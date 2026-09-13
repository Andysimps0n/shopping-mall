import Link from "next/link";

// Same copy and layout as before. Only the typeface changes:
// Playfair for the Latin heading, Pretendard with looser tracking for body.

export default function BrandIntro() {
  return (
    <section className="BrandIntro" aria-labelledby="brand-intro-heading">
      <div className="intro-wrapper container">
        <div className="intro-content">
          <h2 id="brand-intro-heading" className="intro-heading">
            AnnChloe Beauty People
          </h2>

          <p className="intro-copy">
            AnnChloe는 살롱의 손길에서 시작된 퍼펙트 천연 브랜드입니다.
            오일 · 방부제 · 합성 계면활성제를 빼는 6無 처방으로, 헤어 · 두피 ·
            피부의 순환 리듬을 지키는 제품을 선보입니다.
          </p>

          <Link href="/brand" className="button intro-button">
            브랜드 이야기
          </Link>
        </div>
      </div>
    </section>
  );
}
