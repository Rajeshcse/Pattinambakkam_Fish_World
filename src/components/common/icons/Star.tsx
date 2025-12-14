import React from 'react';

interface StarProps {
  size?: number;
  color?: string;
  className?: string;
  filled?: boolean;
}

export const Star: React.FC<StarProps> = ({
  size = 24,
  color = '#fbbf24',
  className = '',
  filled = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2L15.09 10.26H24L17.55 15.74L20.64 24L12 18.52L3.36 24L6.45 15.74L0 10.26H8.91L12 2Z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={filled ? '0' : '1.5'}
      />
    </svg>
  );
};

export default Star;
