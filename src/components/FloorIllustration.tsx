const LINE = "#D8D2C4";
const PINE = "#2E4034";
const PINE_LIGHT = "#3F5A4B";
const SAND = "#C9A876";
const SAND_LIGHT = "#E8DCC3";
const SKY = "#A9C2C9";

export default function FloorIllustration({ variant }: { variant: "empty" | "styled" }) {
  if (variant === "empty") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className="h-9 w-9 xl:h-11 xl:w-11"
      >
        <rect x="8" y="8" width="48" height="48" rx="2" fill="none" stroke={LINE} strokeWidth="2" />
        <rect
          x="20"
          y="20"
          width="24"
          height="24"
          fill="none"
          stroke={LINE}
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <line x1="8" y1="56" x2="56" y2="56" stroke={LINE} strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="h-9 w-9 xl:h-11 xl:w-11">
      <rect x="8" y="8" width="48" height="48" rx="2" fill="none" stroke={PINE} strokeWidth="2" />
      <rect x="16" y="34" width="20" height="6" rx="2" fill={SAND_LIGHT} />
      <rect x="16" y="38" width="20" height="10" rx="2" fill={SAND} />
      <line x1="44" y1="46" x2="44" y2="24" stroke={PINE} strokeWidth="1.5" />
      <path d="M40 24 L48 24 L46 18 L42 18 Z" fill={SKY} />
      <circle cx="20" cy="22" r="4" fill={PINE_LIGHT} />
      <line x1="20" y1="26" x2="20" y2="32" stroke={PINE} strokeWidth="1.5" />
    </svg>
  );
}
