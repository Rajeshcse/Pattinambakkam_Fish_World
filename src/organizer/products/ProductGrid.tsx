import React from 'react';
import { ProductCard } from '@/components/common';
import type { FishProduct } from '@/types';

interface ProductGridProps {
  products: FishProduct[];
  loading: boolean;
  searchQuery: string;
  onClearFilters: () => void;
}

/**
 * ProductGrid Component
 *
 * Displays products in a responsive grid layout
 * Handles loading, empty states, and search results
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  searchQuery,
  onClearFilters,
}) => {
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mb-4 animate-pulse">
            <div className="text-6xl">🐟</div>
          </div>
          <p className="text-slate-500 font-medium">Loading fresh catches...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 sm:py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mb-4">
          <span className="text-4xl">🐠</span>
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">No fish found</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          {searchQuery
            ? "We couldn't find any matches. Try different keywords!"
            : 'Our nets are empty right now. Check back soon!'}
        </p>
        {searchQuery && (
          <button
            onClick={onClearFilters}
            className="mt-4 px-6 py-2 bg-cyan-500 text-white font-semibold rounded-full hover:bg-cyan-600 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  // Products grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
