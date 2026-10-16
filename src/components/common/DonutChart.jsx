import React, { useState } from 'react';

/**
 * Reusable Interactive SVG Donut Chart
 * Renders high-precision vector donut slices with hover interaction and center metrics
 */
export default function DonutChart({
  items = [],
  centerLabel = 'Total',
  centerValue = '',
  size = 170,
  strokeWidth = 22,
  ariaLabel = 'Donut Chart',
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate sum of percentages or amounts
  const totalPercent = items.reduce((acc, item) => acc + (Number(item.percent) || 0), 0) || 100;

  let cumulativeAngle = 0;
  const slices = items.map((item, idx) => {
    const pct = Number(item.percent) || 0;
    // Normalized percentage slice length
    const strokeDash = (pct / totalPercent) * circumference;
    const strokeOffset = -(cumulativeAngle / totalPercent) * circumference;
    cumulativeAngle += pct;

    const fallbackColor = ['#0f6130', '#c9a55a', '#0d9488', '#2563eb', '#8b5e34', '#9b2113', '#dc2626', '#b45309', '#d97706'][idx % 9];

    return {
      ...item,
      strokeDash,
      strokeOffset,
      percentVal: pct,
      color: item.color || fallbackColor,
    };
  });

  const activeItem = hoveredIndex !== null ? slices[hoveredIndex] : null;

  return (
    <div
      className="interactive-donut-container"
      style={{
        position: 'relative',
        width: size,
        height: size,
        margin: '0 auto',
        flexShrink: 0,
      }}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
      >
        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(0, 0, 0, 0.05)"
          strokeWidth={strokeWidth}
        />

        {/* Dynamic Slices */}
        {slices.map((slice, idx) => (
          <circle
            key={idx}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={slice.color}
            strokeWidth={hoveredIndex === idx ? strokeWidth + 4 : strokeWidth}
            strokeDasharray={`${slice.strokeDash} ${circumference}`}
            strokeDashoffset={slice.strokeOffset}
            style={{
              transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
              cursor: 'pointer',
              opacity: hoveredIndex === null || hoveredIndex === idx ? 1 : 0.45,
            }}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
      </svg>

      {/* Center Details */}
      <div
        className="donut-center-info"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          maxWidth: size - strokeWidth * 2 - 12,
          padding: '0 4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: activeItem ? activeItem.color : '#6b7f74',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
          }}
        >
          {activeItem ? activeItem.label : centerLabel}
        </span>
        <strong
          style={{
            fontSize: activeItem ? '15px' : '13.5px',
            color: '#0c2b1d',
            fontWeight: 800,
            lineHeight: 1.2,
            marginTop: '2px',
          }}
        >
          {activeItem ? `${activeItem.percentVal}%` : centerValue}
        </strong>
      </div>
    </div>
  );
}
