/**
 * Pages Router 500.
 *
 * Same reason as `pages/404.js`: Next 15.5 prerenders `/500` from the
 * default `_error` page, which calls `next/head` → `useContext` with a
 * null React dispatcher and fails the production build.
 */
export default function PagesServerError() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "4rem 1.25rem",
        fontFamily:
          'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: "#1a1a1a",
      }}
    >
      <p style={{ margin: "0 0 0.5rem", fontSize: "0.8125rem", color: "#6b6b6b" }}>
        500
      </p>
      <h1 style={{ margin: "0 0 0.75rem", fontSize: "1.75rem", fontWeight: 600 }}>
        잠시 후 다시 시도해 주세요
      </h1>
      <p style={{ margin: "0 0 1.5rem", color: "#6b6b6b" }}>
        서버에서 요청을 처리하지 못했습니다.
      </p>
      <a href="/" style={{ color: "#63298c", textDecoration: "none" }}>
        홈으로
      </a>
    </main>
  );
}
