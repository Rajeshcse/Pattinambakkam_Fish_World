import React from 'react';

interface ProductSearchBarProps {
  searchQuery: string;
  totalProducts: number;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

/**
 * ProductSearchBar Component
 *
 * Search input with product count display
 * Handles search query and form submission
 */
export const ProductSearchBar: React.FC<ProductSearchBarProps> = ({
  searchQuery,
  totalProducts,
  onSearchChange,
  onSearchSubmit,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      {/* Product Count - Desktop Only */}
      <div className="hidden md:block">
        <h2 className="text-2xl font-bold text-yellow-500">🐟 Fresh Seafood</h2>
        <p className="text-sm text-blue-600">{totalProducts} products</p>
      </div>

      {/* Search Form */}
      <form onSubmit={onSearchSubmit} className="w-full md:max-w-md">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-700 placeholder-slate-400 text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 text-sm"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};
