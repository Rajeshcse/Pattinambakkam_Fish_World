import React from 'react';

interface CheckCircleProps {
  size?: number;
  color?: string;
  className?: string;
}

export const CheckCircle: React.FC<CheckCircleProps> = ({
  size = 24,
  color = '#22c55e',
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Circle */}
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
      {/* Checkmark */}
      <path
        d="M8 12L11 15L16 9"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default CheckCircle;
