import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  ...props
}) => {
  return (
    <div
      {...props}
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {(title || subtitle) && (
        <div className='px-6 py-4 border-b border-gray-200'>
          {title && (
            <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
          )}
          {subtitle && <p className='mt-1 text-sm text-gray-600'>{subtitle}</p>}
        </div>
      )}
      <div className='px-6 py-4'>{children}</div>
    </div>
  );
};
