"use client";

import ProfileShell from "./ProfileShell";
import RequireProfile from "./RequireProfile";
import { profileCopy } from "@/lib/auth";

export default function InquiryHistoryPage() {
  return (
    <RequireProfile>
      {() => (
        <ProfileShell title={profileCopy.inquiryHistory} backHref="/profile">
          <p className="login-lead">{profileCopy.inquiryHistoryEmpty}</p>
        </ProfileShell>
      )}
    </RequireProfile>
  );
}
