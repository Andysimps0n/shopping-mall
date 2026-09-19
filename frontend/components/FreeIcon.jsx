// Small line icons for 6無 / free-from cards. Same stroke language as the
// header icons — thin, round caps, no fill — so brand and PDP match.

const FREE_ICON_BY_TITLE = {
  무오일: "oil",
  논오일: "oil",
  무방부제: "preservative",
  무알코올: "alcohol",
  무합성계면활성제: "surfactant",
  무색소: "color",
  무향료: "fragrance",
  무화학: "chemical",
  논실리콘: "silicon",
};

export function freeIconName(item) {
  if (item.id) {
    return item.id;
  }

  return FREE_ICON_BY_TITLE[item.title] ?? "fragrance";
}

export default function FreeIcon({ name, className }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: ["free-icon", className].filter(Boolean).join(" "),
    "aria-hidden": true,
  };

  if (name === "oil") {
    return (
      <svg {...common}>
        <path d="M12 3s5 6.2 5 10.2A5 5 0 0 1 7 13.2C7 9.2 12 3 12 3z" />
        <path d="M5 19h14" />
      </svg>
    );
  }

  if (name === "preservative") {
    return (
      <svg {...common}>
        <path d="M9 3h6" />
        <path d="M10 3v4.5L7 12v7a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-7l-3-4.5V3" />
      </svg>
    );
  }

  if (name === "alcohol") {
    return (
      <svg {...common}>
        <path d="M8 3h8" />
        <path d="M9 3v6l-3 8a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4l-3-8V3" />
      </svg>
    );
  }

  if (name === "surfactant") {
    return (
      <svg {...common}>
        <circle cx="7" cy="12" r="2.5" />
        <circle cx="17" cy="7" r="2.5" />
        <circle cx="17" cy="17" r="2.5" />
        <path d="M9.2 10.8 14.8 8.2" />
        <path d="M9.2 13.2 14.8 15.8" />
      </svg>
    );
  }

  if (name === "color") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  if (name === "chemical") {
    return (
      <svg {...common}>
        <path d="M9 3h6" />
        <path d="M10 3v6L6 17.5A3.2 3.2 0 0 0 8.8 22h6.4A3.2 3.2 0 0 0 18 17.5L14 9V3" />
      </svg>
    );
  }

  if (name === "silicon") {
    return (
      <svg {...common}>
        <path d="M5 8h14" />
        <rect x="4.5" y="10" width="15" height="8" rx="1.5" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M5 14c3-1 5-5 7-9 2 4 4 8 7 9" />
      <path d="M12 5v14" />
    </svg>
  );
}
