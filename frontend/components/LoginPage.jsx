"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  DEFAULT_ACCOUNT_TYPE,
  getLoginAccount,
  getSocialLoginStartUrl,
  loginAccounts,
  loginCopy,
} from "@/lib/auth";
import { brand } from "@/lib/brand";

function NaverMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="login-provider-mark"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M4 4h6.2l5.6 8.2V4H20v16h-6.2L8.2 11.8V20H4V4Z"
      />
    </svg>
  );
}

function KakaoMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="login-provider-mark"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 4C6.9 4 2.8 7.2 2.8 11.2c0 2.6 1.8 4.8 4.5 6.1l-.9 3.3c-.1.3.3.5.5.4l3.7-2.4c.4 0 .9.1 1.4.1 5.1 0 9.2-3.2 9.2-7.2S17.1 4 12 4Z"
      />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="login-provider-mark"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09A6.96 6.96 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  );
}

/**
 * Login screen — B2B vs consumer, then social / email.
 * Kakao and Naver send the browser to our API, which redirects to the provider.
 */
export default function LoginPage() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const [accountType, setAccountType] = useState(DEFAULT_ACCOUNT_TYPE);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const account = getLoginAccount(accountType);

  function handleEmailSubmit(event) {
    // Stop the browser from navigating. Real email sign-in comes later.
    event.preventDefault();
  }

  function handleSocialLogin(provider) {
    window.location.assign(getSocialLoginStartUrl(provider, nextPath));
  }

  return (
    <main className="LoginPage">
      <div className="login-page-wrapper container">
        <div className="login-panel">
          <p className="login-eyebrow">{loginCopy.eyebrow}</p>
          <h1 className="login-heading">{loginCopy.heading}</h1>
          <p className="login-lead">{account.lead}</p>

          <div
            className="login-account-switch"
            role="radiogroup"
            aria-label={loginCopy.accountGroupLabel}
          >
            {loginAccounts.map((option) => {
              const isSelected = option.id === accountType;

              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={
                    isSelected
                      ? "login-account-option is-selected"
                      : "login-account-option"
                  }
                  onClick={() => setAccountType(option.id)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="login-providers">
            <button
              type="button"
              className="login-provider login-provider--naver"
              onClick={() => handleSocialLogin("naver")}
            >
              <NaverMark />
              {loginCopy.naver}
            </button>
            <button
              type="button"
              className="login-provider login-provider--kakao"
              onClick={() => handleSocialLogin("kakao")}
            >
              <KakaoMark />
              {loginCopy.kakao}
            </button>
            <button
              type="button"
              className="login-provider login-provider--google"
            >
              <GoogleMark />
              {loginCopy.google}
            </button>
          </div>

          <div className="login-divider">
            <span>{loginCopy.divider}</span>
          </div>

          <form className="login-form" onSubmit={handleEmailSubmit}>
            <label className="login-field">
              <span className="login-field-label">{account.emailLabel}</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                required
                placeholder={loginCopy.emailPlaceholder}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="login-field">
              <span className="login-field-label">
                {loginCopy.passwordLabel}
              </span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                placeholder={loginCopy.passwordPlaceholder}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            <button type="submit" className="button login-submit">
              {loginCopy.submit}
            </button>
          </form>

          {account.footnoteBefore ? (
            <p className="login-footnote">
              {account.footnoteBefore}{" "}
              <a href={brand.companyTelHref}>{brand.companyTelLabel}</a>
              {account.footnoteAfter}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
