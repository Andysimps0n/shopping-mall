// Company description interstitial — text pause after the product grid.
// Neutral gray band keeps it distinct from the white sections around it.

export default function BrandIntro() {
  return (
    <section
      className="BrandIntro"
      aria-labelledby="brand-intro-heading"
    >
      <div className="intro-wrapper container">
        <div className="intro-content">
          <h2 id="brand-intro-heading" className="intro-heading">
            AnnChloe Beauty People
          </h2>

          <p className="intro-copy">
            AnnChloe는 살롱의 손길에서 시작된 뷰티 브랜드입니다. 현장에서 쌓아 온
            감각과 신뢰를 바탕으로, 헤어 · 두피 · 피부 케어를 위한 제품을
            정성껏 선보입니다. 매일의 루틴이 더 섬세하고 아름다워지도록,
            우리는 본질에 집중합니다.
          </p>

          <a href="/brand" className="button intro-button">
            브랜드 이야기
          </a>
        </div>
      </div>
    </section>
  );
}
