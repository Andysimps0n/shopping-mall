import { redirect } from "next/navigation";

/** Old login URL. Login now lives on the profile page. */
export default function LoginRoute() {
  redirect("/profile");
}
