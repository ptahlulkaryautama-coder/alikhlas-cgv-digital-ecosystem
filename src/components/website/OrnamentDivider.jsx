export default function OrnamentDivider() {
  return (
    <div className="ornament-divider" aria-hidden="true">
      <svg viewBox="0 0 700 40" preserveAspectRatio="xMidYMid meet" fill="none">
        <line x1="0" y1="20" x2="285" y2="20" />
        <line x1="415" y1="20" x2="700" y2="20" />
        <g className="ornament-center" transform="translate(320 20)">
          <rect x="-18" y="-18" width="36" height="36" transform="rotate(45 0 0)" />
          <rect x="-11" y="-11" width="22" height="22" />
          <circle cx="0" cy="0" r="4" />
        </g>
        <g className="ornament-small" transform="translate(290 20)">
          <rect x="-9" y="-9" width="18" height="18" transform="rotate(45 0 0)" />
        </g>
        <g className="ornament-small" transform="translate(350 20)">
          <rect x="-9" y="-9" width="18" height="18" transform="rotate(45 0 0)" />
        </g>
      </svg>
    </div>
  );
}
