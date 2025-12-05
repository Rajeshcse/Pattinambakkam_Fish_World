import React from 'react';

interface LeafProps {
  size?: number;
  color?: string;
  className?: string;
}

export const Leaf: React.FC<LeafProps> = ({ 
  size = 24, 
  color = '#10b981', 
  className = ''
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
      {/* Leaf shape */}
      <path
        d="M12 2C12 2 6 8 6 14C6 18.4 8.9 22 12 22C15.1 22 18 18.4 18 14C18 8 12 2 12 2Z"
        fill={color}
        opacity="0.8"
      />
      {/* Vein */}
      <path
        d="M12 2V22"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
      />
      {/* Side veins */}
      <path d="M12 8L8 11" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <path d="M12 8L16 11" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <path d="M12 14L9 16" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <path d="M12 14L15 16" stroke={color} strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
};

export default Leaf;
