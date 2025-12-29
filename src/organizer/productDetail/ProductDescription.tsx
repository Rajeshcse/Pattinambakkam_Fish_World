import React from 'react';

interface ProductDescriptionProps {
  description?: string;
}

/**
 * ProductDescription Component
 *
 * Displays product description if available
 */
export const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
  if (!description) return null;

  return (
    <div className="mb-4">
      <h3 className="text-base font-semibold text-gray-800 mb-2">Description</h3>
      <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
    </div>
  );
};
