"use client";

import ProfileShell from "./ProfileShell";
import RequireProfile from "./RequireProfile";
import { ACCOUNT_FEATURES } from "@/lib/accountFeatures";

export default function AccountFeaturePage({ featureId }) {
  const feature = ACCOUNT_FEATURES[featureId];

  return (
    <RequireProfile>
      {() => (
        <ProfileShell title={feature.title} backHref="/profile/account">
          <p className="login-lead">{feature.body}</p>
        </ProfileShell>
      )}
    </RequireProfile>
  );
}
