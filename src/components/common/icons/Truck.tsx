import React from 'react';

interface TruckProps {
  size?: number;
  color?: string;
  className?: string;
}

export const Truck: React.FC<TruckProps> = ({ 
  size = 24, 
  color = '#0ea5e9', 
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
      {/* Cabin */}
      <rect x="2" y="7" width="8" height="8" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Cargo area */}
      <rect x="10" y="7" width="12" height="8" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Back wheel */}
      <circle cx="18" cy="16" r="2" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Front wheel */}
      <circle cx="6" cy="16" r="2" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Axle */}
      <line x1="6" y1="15" x2="18" y2="15" stroke={color} strokeWidth="0.8" opacity="0.5" />
      {/* Window */}
      <rect x="3" y="8" width="6" height="4" rx="0.5" stroke={color} strokeWidth="0.8" fill="none" opacity="0.7" />
    </svg>
  );
};

export default Truck;
