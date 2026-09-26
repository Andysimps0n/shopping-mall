import { inquiry } from "@/lib/business";

function joinClassNames(...names) {
  return names.filter(Boolean).join(" ");
}

/**
 * PC에서는 tel: 링크가 동작하지 않을 수 있어서 번호만 글자로 보여 준다.
 * 모바일에서만 누르면 전화가 걸린다.
 */
export function InquiryPhone({ className, label }) {
  const visibleLabel = label || inquiry.phoneLabel;
  const isButton = className?.includes("inquiry-link--button");
  const desktopText = isButton || !label
    ? inquiry.phoneLabel
    : `${label} ${inquiry.phoneLabel}`;

  return (
    <span className="inquiry-phone-pair">
      <a
        href={inquiry.phoneHref}
        className={joinClassNames("inquiry-phone", "inquiry-phone--mobile", className)}
        aria-label={`${inquiry.phoneLabel}로 전화 문의하기`}
      >
        {visibleLabel}
      </a>
      <span
        className={joinClassNames("inquiry-phone", "inquiry-phone--desktop", className)}
      >
        {desktopText}
      </span>
    </span>
  );
}

export default function InquiryLink({ variant = "text", label }) {
  const isButton = variant === "secondary-button";
  const className = isButton
    ? "button button--secondary inquiry-link inquiry-link--button"
    : "inquiry-link inquiry-link--text";

  if (inquiry.kakaoChannelUrl) {
    return (
      <a
        href={inquiry.kakaoChannelUrl}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label}, 새 창`}
      >
        {label}
      </a>
    );
  }

  return <InquiryPhone className={className} label={label} />;
}
