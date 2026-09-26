export default function LegalDocument({ eyebrow, title, children }) {
  return (
    <main className="LegalPage">
      <div className="container">
        <div className="legal-wrap">
          <p className="legal-banner">
            이 문서는 고객사가 법률 검토 후 채워 넣을 초안입니다. 대괄호 안은 확인이
            필요한 자리이며, 스마트스토어 약관을 그대로 가져온 글이 아닙니다.
          </p>
          <p className="login-eyebrow">{eyebrow}</p>
          <h1 className="cart-page-heading">{title}</h1>
          <div className="legal-body">{children}</div>
        </div>
      </div>
    </main>
  );
}
