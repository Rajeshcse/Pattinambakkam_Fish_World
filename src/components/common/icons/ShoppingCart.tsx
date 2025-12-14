import React from 'react';

interface ShoppingCartProps {
  size?: number;
  color?: string;
  className?: string;
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({
  size = 24,
  color = '#0ea5e9',
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
      {/* Cart basket */}
      <path
        d="M9 2L7 6H4C2.9 6 2 6.9 2 8V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V8C22 6.9 21.1 6 20 6H17L15 2H9Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handle */}
      <path d="M9 2L9 5M15 2L15 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Item indicators */}
      <circle cx="8" cy="14" r="1" fill={color} />
      <circle cx="16" cy="14" r="1" fill={color} />
    </svg>
  );
};

export default ShoppingCart;
