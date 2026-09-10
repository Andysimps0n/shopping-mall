export const metadata = {
  title: "브랜드 · Ann Chloe",
  description: "AnnChloe Beauty People — 살롱에서 시작된 헤어, 두피, 피부 케어 브랜드.",
};

export default function BrandPage() {
  return (
    <main className="BrandPage">
      <section aria-labelledby="brand-page-heading">
        <div className="brand-page-wrapper container">
          <div className="brand-page-content">
            <p className="brand-page-eyebrow">BRAND</p>
            <h1 id="brand-page-heading" className="brand-page-heading">
              AnnChloe Beauty People
            </h1>

            <p className="brand-page-copy">
              AnnChloe는 살롱의 손길에서 시작된 뷰티 브랜드입니다. 현장에서 쌓아 온
              감각과 신뢰를 바탕으로, 헤어 · 두피 · 피부 케어를 위한 제품을
              정성껏 선보입니다.
            </p>

            <p className="brand-page-copy">
              매일의 루틴이 더 섬세하고 아름다워지도록, 우리는 본질에 집중합니다.
              과장된 약속보다 쓸 때마다 느껴지는 차이를 만들고자 합니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
