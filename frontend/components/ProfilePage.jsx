"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import LoginPage from "./LoginPage";
import ProfileMenuRow, { Chevron } from "./ProfileMenuRow";
import ProfileShell from "./ProfileShell";
import { profileCopy, safeNextPath } from "@/lib/auth";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const { user, hasLoaded } = useCurrentUser();

  useEffect(() => {
    if (!hasLoaded || !user || !nextPath || nextPath === "/profile") return;
    router.replace(nextPath);
  }, [hasLoaded, user, nextPath, router]);

  if (!hasLoaded) {
    return (
      <ProfileShell>
        <p className="login-eyebrow">{profileCopy.eyebrow}</p>
        <h1 className="profile-page-heading">{profileCopy.heading}</h1>
        <p className="login-lead">{profileCopy.loading}</p>
      </ProfileShell>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const displayName = user.name?.trim() || profileCopy.missingName;

  return (
    <ProfileShell>
      <h1 className="visually-hidden">{profileCopy.heading}</h1>
      <Link href="/profile/account" className="profile-hero">
        {user.avatarUrl ? (
          <img className="profile-avatar" src={user.avatarUrl} alt="" />
        ) : (
          <span className="profile-avatar profile-avatar--placeholder" aria-hidden="true">
            {(user.name || "앤").slice(0, 1)}
          </span>
        )}
        <span className="profile-hero-body">
          <span className="profile-hero-name">
            {displayName}
            <Chevron />
          </span>
          <span className="profile-hero-copy">{profileCopy.heroHint}</span>
        </span>
      </Link>

      <nav className="profile-menu" aria-label="내 정보">
        <ProfileMenuRow
          href="/mypage/orders"
          title={profileCopy.orders}
          copy={profileCopy.ordersHint}
        />
        <ProfileMenuRow
          href="/profile/support"
          title={profileCopy.support}
          copy={profileCopy.supportHint}
        />
        <ProfileMenuRow href="/profile/inquiry" title={profileCopy.inquiry} />
        <ProfileMenuRow
          href="/profile/inquiries"
          title={profileCopy.inquiryHistory}
        />
        {user.isAdmin ? (
          <ProfileMenuRow
            href="/admin/orders"
            title={profileCopy.adminOrders}
          />
        ) : null}
      </nav>
    </ProfileShell>
  );
}
