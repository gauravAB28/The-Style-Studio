import React from 'react';

interface SpaSealProps {
  size?: number; // diameter in px, default 120
  className?: string;
}

/**
 * Rotating circular gold SVG seal:
 * "30% WELLNESS PRIVILEGE ✦ ON EVERY SPA RITUAL ✦"
 * Uses a <textPath> on a circular path so the text curves around the ring.
 * The whole SVG rotates slowly via CSS animation.
 * Respects prefers-reduced-motion — static when motion is reduced.
 */
export const SpaSeal: React.FC<SpaSealProps> = ({ size = 120, className = '' }) => {
  const r = 44; // text path radius
  const cx = 50;
  const cy = 50;
  const pathId = 'spa-seal-path';
  const shimId = 'spa-seal-shim';

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`spa-seal-spin ${className}`}
      aria-label="30% Wellness Privilege on every spa ritual"
      role="img"
      style={{ display: 'block' }}
    >
      <defs>
        {/* Circular path for text */}
        <path
          id={pathId}
          d={`M ${cx},${cy - r} A ${r},${r} 0 1,1 ${cx - 0.01},${cy - r}`}
        />
        {/* Gold shimmer gradient */}
        <linearGradient id={shimId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c59b4b" />
          <stop offset="40%" stopColor="#f0d080" />
          <stop offset="60%" stopColor="#e8c060" />
          <stop offset="100%" stopColor="#c59b4b" />
        </linearGradient>
      </defs>

      {/* Gold ring background */}
      <circle
        cx={cx} cy={cy} r={r + 4}
        fill="none"
        stroke="url(#spa-seal-shim)"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <circle
        cx={cx} cy={cy} r={r - 2}
        fill="none"
        stroke="url(#spa-seal-shim)"
        strokeWidth="0.6"
        opacity="0.35"
      />

      {/* Centre numeral */}
      <text
        x={cx} y={cy - 4}
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fill="url(#spa-seal-shim)"
        fontFamily="Georgia, serif"
      >
        30%
      </text>
      <text
        x={cx} y={cy + 7}
        textAnchor="middle"
        fontSize="4.4"
        fill="#c59b4b"
        fontFamily="Georgia, serif"
        letterSpacing="0.5"
      >
        PRIVILEGE
      </text>

      {/* Curved ring text */}
      <text
        fontSize="4.6"
        fill="url(#spa-seal-shim)"
        fontFamily="Georgia, serif"
        letterSpacing="1.2"
      >
        <textPath href={`#${pathId}`} startOffset="0%">
          30% WELLNESS PRIVILEGE ✦ ON EVERY SPA RITUAL ✦
        </textPath>
      </text>
    </svg>
  );
};

