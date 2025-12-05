import React from 'react';

interface WaveProps {
  size?: number;
  color?: string;
  className?: string;
  animated?: boolean;
}

export const Wave: React.FC<WaveProps> = ({ 
  size = 24, 
  color = '#0ea5e9', 
  className = '',
  animated = true
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={animated ? `${className} animate-pulse` : className}
      preserveAspectRatio="none"
    >
      <path
        d="M0,10 Q25,0 50,10 T100,10"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M0,15 Q25,5 50,15 T100,15"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
};

export default Wave;
