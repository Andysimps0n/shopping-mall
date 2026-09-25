import { redirect } from "next/navigation";

/** Old login URL. Login now lives on the profile page. */
export default async function LoginRoute({ searchParams }) {
  const params = await searchParams;
  const next = typeof params?.next === "string" ? params.next : "";
  const safe =
    next.startsWith("/") && !next.startsWith("//") && !next.includes("://");

  if (safe) {
    redirect(`/profile?next=${encodeURIComponent(next)}`);
  }

  redirect("/profile");
}
