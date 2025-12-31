import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '@/components/common';
import type { FishProduct } from '@/types';

interface ProductsGridProps {
  products: FishProduct[];
  onEdit: (product: FishProduct) => void;
  onDelete: (product: FishProduct) => void;
  onToggleAvailability: (product: FishProduct) => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 bg-white rounded-lg">
        <svg
          className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-500 mb-4">Get started by adding a new product</p>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold text-sm"
        >
          + Add New Product
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          showAdminActions
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleAvailability={onToggleAvailability}
        />
      ))}
    </div>
  );
};
