import React from 'react';

interface FishProps {
  size?: number;
  color?: string;
  className?: string;
  variant?: 'mackerel' | 'carp' | 'tilapia' | 'sardine';
}

export const Fish: React.FC<FishProps> = ({
  size = 24,
  color = '#0ea5e9',
  className = '',
  variant = 'mackerel',
}) => {
  const variations = {
    mackerel: (
      <g transform="translate(2, 4)">
        {/* Body */}
        <ellipse cx="12" cy="8" rx="10" ry="6" fill={color} opacity="0.9" />
        {/* Head */}
        <circle cx="4" cy="8" r="3.5" fill={color} />
        {/* Tail */}
        <path d="M 22 8 L 28 5 L 28 11 Z" fill={color} opacity="0.8" />
        {/* Dorsal fin */}
        <path d="M 10 2 L 12 -1 L 14 2" stroke={color} strokeWidth="1.5" fill="none" />
        {/* Eye */}
        <circle cx="5" cy="7" r="0.8" fill="white" />
        {/* Stripes */}
        <line x1="8" y1="6" x2="16" y2="5" stroke={color} strokeWidth="0.8" opacity="0.5" />
        <line x1="8" y1="10" x2="16" y2="11" stroke={color} strokeWidth="0.8" opacity="0.5" />
      </g>
    ),
    carp: (
      <g transform="translate(2, 3)">
        {/* Body */}
        <ellipse cx="12" cy="9" rx="11" ry="7" fill={color} opacity="0.9" />
        {/* Head */}
        <circle cx="3" cy="9" r="4" fill={color} />
        {/* Tail */}
        <path d="M 23 9 L 30 5 L 30 13 Z" fill={color} opacity="0.8" />
        {/* Dorsal fin */}
        <path d="M 10 1 L 12 -2 L 14 1" stroke={color} strokeWidth="1.5" fill="none" />
        {/* Pectoral fin */}
        <ellipse cx="8" cy="15" rx="2" ry="4" fill={color} opacity="0.6" />
        {/* Eye */}
        <circle cx="4" cy="8" r="1" fill="white" />
        {/* Whiskers */}
        <line x1="2" y1="11" x2="0" y2="13" stroke={color} strokeWidth="1" opacity="0.7" />
      </g>
    ),
    tilapia: (
      <g transform="translate(1, 3)">
        {/* Body */}
        <circle cx="12" cy="9" r="8" fill={color} opacity="0.85" />
        {/* Head accent */}
        <circle cx="5" cy="9" r="5" fill={color} opacity="0.95" />
        {/* Tail */}
        <path d="M 20 9 L 28 4 L 28 14 Z" fill={color} opacity="0.8" />
        {/* Dorsal fin */}
        <path d="M 10 1 L 13 -1 L 14 2" fill={color} opacity="0.7" />
        {/* Eye */}
        <circle cx="6" cy="8" r="1" fill="white" />
        {/* Gill */}
        <path d="M 4 11 Q 3 12 4 13" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
      </g>
    ),
    sardine: (
      <g transform="translate(3, 5)">
        {/* Body */}
        <ellipse cx="10" cy="7" rx="8" ry="4.5" fill={color} opacity="0.9" />
        {/* Head */}
        <circle cx="3" cy="7" r="2.5" fill={color} />
        {/* Tail */}
        <path d="M 18 7 L 24 4 L 24 10 Z" fill={color} opacity="0.8" />
        {/* Dorsal fin */}
        <path d="M 8 2 L 10 0 L 12 2" stroke={color} strokeWidth="1" fill="none" />
        {/* Eye */}
        <circle cx="4" cy="6.5" r="0.6" fill="white" />
        {/* Stripes */}
        <line x1="6" y1="5.5" x2="14" y2="5" stroke={color} strokeWidth="0.6" opacity="0.4" />
        <line x1="6" y1="8.5" x2="14" y2="9" stroke={color} strokeWidth="0.6" opacity="0.4" />
      </g>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {variations[variant]}
    </svg>
  );
};

export default Fish;
