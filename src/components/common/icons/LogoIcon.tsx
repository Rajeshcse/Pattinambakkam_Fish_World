import React from 'react';

interface LogoIconProps {
  size?: number;
  className?: string;
  showBackground?: boolean;
}

export const LogoIcon: React.FC<LogoIconProps> = ({
  size = 48,
  className = '',
  showBackground = true,
}) => {
  const fishSize = showBackground ? size * 0.6 : size;

  const SilverFish = () => (
    <svg
      width={fishSize}
      height={fishSize}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {}
      <ellipse
        cx="14"
        cy="16"
        rx="10"
        ry="6"
        fill="url(#brightFishGradient)"
        stroke="#0284c7"
        strokeWidth="0.5"
      />

      {}
      <circle
        cx="6"
        cy="16"
        r="4"
        fill="url(#brightFishGradient)"
        stroke="#0284c7"
        strokeWidth="0.5"
      />

      {}
      <path
        d="M 24 16 L 30 10 L 28 16 L 30 22 Z"
        fill="url(#tailGradient)"
        stroke="#0284c7"
        strokeWidth="0.5"
      />

      {}
      <path
        d="M 12 10 L 14 6 L 16 10 Z"
        fill="url(#finGradient)"
        stroke="#0284c7"
        strokeWidth="0.5"
      />

      {}
      <path
        d="M 12 22 L 14 26 L 16 22 Z"
        fill="url(#finGradient)"
        stroke="#0284c7"
        strokeWidth="0.5"
      />

      {}
      <ellipse
        cx="10"
        cy="20"
        rx="2.5"
        ry="4"
        fill="url(#finGradient)"
        opacity="0.9"
        stroke="#0284c7"
        strokeWidth="0.3"
      />

      {}
      <circle cx="6" cy="15" r="1.8" fill="#1e3a8a" />
      <circle cx="6.5" cy="14.5" r="0.7" fill="white" />

      {}
      <path d="M 9 13.5 Q 8 16 9 18.5" stroke="#0284c7" strokeWidth="1" fill="none" />
      <path
        d="M 10.5 14 Q 9.5 16 10.5 18"
        stroke="#0284c7"
        strokeWidth="0.7"
        fill="none"
        opacity="0.7"
      />

      {}
      <circle cx="12" cy="14" r="1.2" fill="none" stroke="white" strokeWidth="0.4" opacity="0.6" />
      <circle cx="15" cy="15" r="1.2" fill="none" stroke="white" strokeWidth="0.4" opacity="0.6" />
      <circle cx="18" cy="16" r="1.2" fill="none" stroke="white" strokeWidth="0.4" opacity="0.6" />
      <circle cx="12" cy="18" r="1.2" fill="none" stroke="white" strokeWidth="0.4" opacity="0.6" />
      <circle cx="15" cy="17" r="1.2" fill="none" stroke="white" strokeWidth="0.4" opacity="0.6" />

      {}
      <line
        x1="10"
        y1="13"
        x2="22"
        y2="13"
        stroke="white"
        strokeWidth="0.8"
        opacity="0.7"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="19"
        x2="22"
        y2="19"
        stroke="white"
        strokeWidth="0.8"
        opacity="0.7"
        strokeLinecap="round"
      />
      <line
        x1="11"
        y1="16"
        x2="21"
        y2="16"
        stroke="white"
        strokeWidth="0.6"
        opacity="0.5"
        strokeLinecap="round"
      />

      {}
      <path
        d="M 3 16 Q 2.5 16.5 3 17"
        stroke="#0284c7"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />

      {}
      <defs>
        {}
        <linearGradient id="brightFishGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#f0f9ff" />
          <stop offset="70%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>

        {}
        <linearGradient id="tailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>

        {}
        <linearGradient id="finGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
      </defs>
    </svg>
  );

  if (!showBackground) {
    return <SilverFish />;
  }

  return (
    <div
      className={`bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <SilverFish />
    </div>
  );
};

export default LogoIcon;
