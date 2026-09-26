"use client";

import LoginPage from "./LoginPage";
import ProfileShell from "./ProfileShell";
import { profileCopy } from "@/lib/auth";
import { useCurrentUser } from "@/lib/useCurrentUser";

/**
 * Subpages under /profile need a session.
 * Guests see the same login form as /profile.
 */
export default function RequireProfile({ children }) {
  const { user, hasLoaded } = useCurrentUser();

  if (!hasLoaded) {
    return (
      <ProfileShell>
        <p className="login-lead">{profileCopy.loading}</p>
      </ProfileShell>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return children(user);
}
