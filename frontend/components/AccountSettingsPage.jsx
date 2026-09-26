"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import ProfileMenuRow from "./ProfileMenuRow";
import ProfileShell from "./ProfileShell";
import RequireProfile from "./RequireProfile";
import {
  DISPLAY_NAME_MAX,
  logout,
  profileCopy,
  updateDisplayName,
} from "@/lib/auth";

export default function AccountSettingsPage() {
  return (
    <RequireProfile>
      {(user) => <AccountSettings user={user} />}
    </RequireProfile>
  );
}

function AccountSettings({ user }) {
  const { setCurrentUser } = useCart();
  const [name, setName] = useState(user.name ?? "");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(user.name ?? "");
  }, [user.name]);

  async function handleSave(event) {
    event.preventDefault();
    setError("");
    setSaved(false);
    setIsSaving(true);

    const result = await updateDisplayName(name);
    setIsSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.user) {
      setCurrentUser(result.user);
      setName(result.user.name ?? "");
    }
    setSaved(true);
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    await logout();
    window.location.assign("/profile");
  }

  return (
    <ProfileShell title={profileCopy.accountHeading} backHref="/profile">
      <p className="login-lead">
        {user.email?.trim() || profileCopy.missingEmail}
      </p>

      <form className="account-name" onSubmit={handleSave}>
        <label className="login-field">
          <span className="login-field-label">{profileCopy.nameLabel}</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={DISPLAY_NAME_MAX}
            placeholder={profileCopy.namePlaceholder}
            value={name}
            aria-invalid={error ? "true" : "false"}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
              setSaved(false);
            }}
          />
        </label>
        <p className="account-name-hint">{profileCopy.nameHint}</p>
        {error ? (
          <p className="checkout-error" role="alert">
            {error}
          </p>
        ) : null}
        {saved ? (
          <p className="account-name-saved" role="status">
            {profileCopy.nameSaved}
          </p>
        ) : null}
        <button type="submit" className="button login-submit" disabled={isSaving}>
          {isSaving ? profileCopy.nameSaving : profileCopy.nameSave}
        </button>
      </form>

      <nav className="profile-menu" aria-label="계정 설정">
        <ProfileMenuRow
          href="/profile/account/password"
          title={profileCopy.password}
        />
        <ProfileMenuRow
          href="/profile/account/photo"
          title={profileCopy.photo}
        />
        <ProfileMenuRow
          href="/profile/account/address"
          title={profileCopy.address}
        />
        <ProfileMenuRow
          href="/profile/account/leave"
          title={profileCopy.leave}
        />
      </nav>

      <button
        type="button"
        className="button button--secondary profile-logout"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? profileCopy.loggingOut : profileCopy.logout}
      </button>
    </ProfileShell>
  );
}
