/**
 * Pages Router error page.
 *
 * Next still compiles a default `_error` that uses `next/head`. That
 * component calls `useContext` during prerender and crashes this app's
 * production build. Keep this file free of `next/head` and hooks.
 */
export default function PagesError({ statusCode }) {
  const isNotFound = statusCode === 404;

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
        {statusCode || "Error"}
      </p>
      <h1 style={{ margin: "0 0 0.75rem", fontSize: "1.75rem", fontWeight: 600 }}>
        {isNotFound
          ? "페이지를 찾을 수 없습니다"
          : "잠시 후 다시 시도해 주세요"}
      </h1>
      <a href="/" style={{ color: "#63298c", textDecoration: "none" }}>
        홈으로
      </a>
    </main>
  );
}

PagesError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
