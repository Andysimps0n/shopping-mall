"use client";

import ProfileShell from "./ProfileShell";
import RequireProfile from "./RequireProfile";
import { profileCopy } from "@/lib/auth";
import { business } from "@/lib/business";

export default function InquiryPage() {
  return (
    <RequireProfile>
      {() => (
        <ProfileShell title={profileCopy.inquiry} backHref="/profile">
          <p className="login-lead">{profileCopy.inquiryEmpty}</p>
          <p className="login-lead">
            <a href={business.phoneHref}>{business.phoneLabel}</a>
          </p>
        </ProfileShell>
      )}
    </RequireProfile>
  );
}
