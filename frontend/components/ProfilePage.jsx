"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import LoginPage from "./LoginPage";
import {
  fetchCurrentUser,
  logout,
  profileCopy,
  providerLabels,
  safeNextPath,
} from "@/lib/auth";

/**
 * /profile has two states, and the header always lands here.
 * No session → the existing login form.
 * Session → account details, and the only logout control.
 */
export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const [user, setUser] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchCurrentUser().then((nextUser) => {
      if (!cancelled) {
        setUser(nextUser);
        setHasLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasLoaded || !user || !nextPath || nextPath === "/profile") return;
    router.replace(nextPath);
  }, [hasLoaded, user, nextPath, router]);

  async function handleLogout() {
    setIsLoggingOut(true);
    await logout();
    setUser(null);
    setIsLoggingOut(false);
  }

  if (!hasLoaded) {
    return (
      <main className="ProfilePage">
        <div className="login-page-wrapper container">
          <div className="login-panel">
            <p className="login-eyebrow">{profileCopy.eyebrow}</p>
            <h1 className="login-heading">{profileCopy.heading}</h1>
            <p className="login-lead">{profileCopy.loading}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const providerName = providerLabels[user.provider] ?? user.provider;

  return (
    <main className="ProfilePage">
      <div className="login-page-wrapper container">
        <div className="login-panel">
          <p className="login-eyebrow">{profileCopy.eyebrow}</p>
          <h1 className="login-heading">{profileCopy.heading}</h1>
          <p className="login-lead">{profileCopy.lead}</p>

          <div className="profile-card">
            {user.avatarUrl ? (
              <img
                className="profile-avatar"
                src={user.avatarUrl}
                alt=""
              />
            ) : (
              <span
                className="profile-avatar profile-avatar--placeholder"
                aria-hidden="true"
              >
                {(user.name || "앤").slice(0, 1)}
              </span>
            )}

            <dl className="profile-details">
              <div>
                <dt>{profileCopy.nameLabel}</dt>
                <dd>{user.name || profileCopy.missingName}</dd>
              </div>
              <div>
                <dt>{profileCopy.emailLabel}</dt>
                <dd>{user.email || profileCopy.missingEmail}</dd>
              </div>
              <div>
                <dt>{profileCopy.providerLabel}</dt>
                <dd>{providerName}</dd>
              </div>
            </dl>
          </div>

          <div className="profile-links">
            <Link href="/mypage/orders">주문 내역</Link>
            {user.isAdmin ? <Link href="/admin/orders">주문 관리</Link> : null}
          </div>

          <button
            type="button"
            className="button button--secondary profile-logout"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? profileCopy.loggingOut : profileCopy.logout}
          </button>
        </div>
      </div>
    </main>
  );
}
