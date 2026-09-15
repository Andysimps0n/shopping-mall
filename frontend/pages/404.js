/**
 * Pages Router 404.
 *
 * Next.js 15.5 still statically generates `/404` from the old Pages
 * `_error` component even in an App Router app. That default page calls
 * `next/head` → `useContext` while React's dispatcher is null, and the
 * production build dies with:
 *   Cannot read properties of null (reading 'useContext')
 *
 * This file replaces that default. Keep it free of next/head, context
 * providers, and client hooks so prerender stays a plain HTML render.
 */
export default function PagesNotFound() {
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
        404
      </p>
      <h1 style={{ margin: "0 0 0.75rem", fontSize: "1.75rem", fontWeight: 600 }}>
        페이지를 찾을 수 없습니다
      </h1>
      <p style={{ margin: "0 0 1.5rem", color: "#6b6b6b" }}>
        요청하신 주소가 없거나 옮겨졌습니다.
      </p>
      <a href="/" style={{ color: "#63298c", textDecoration: "none" }}>
        홈으로
      </a>
    </main>
  );
}
