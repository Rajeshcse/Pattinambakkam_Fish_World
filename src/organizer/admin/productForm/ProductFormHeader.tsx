import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductFormHeaderProps {
  isEditMode: boolean;
}

/**
 * ProductFormHeader Component
 *
 * Displays back button, title, and description for product form
 */
export const ProductFormHeader: React.FC<ProductFormHeaderProps> = ({ isEditMode }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Products
      </button>
      <h1 className="text-3xl font-bold text-gray-900">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h1>
      <p className="text-gray-600 mt-2">
        {isEditMode ? 'Update product details' : 'Add a new fish product to your inventory'}
      </p>
    </div>
  );
};
