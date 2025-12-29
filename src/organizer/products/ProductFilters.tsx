import React from 'react';
import type { ProductCategory } from '@/types';

interface ProductFiltersProps {
  selectedCategory: ProductCategory | '';
  showAvailableOnly: boolean;
  onCategoryChange: (category: ProductCategory | '') => void;
  onAvailabilityToggle: (checked: boolean) => void;
}

/**
 * ProductFilters Component
 *
 * Category filter buttons and availability toggle
 * Displays category buttons with emojis and colors
 */
export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedCategory,
  showAvailableOnly,
  onCategoryChange,
  onAvailabilityToggle,
}) => {
  const categories: { name: ProductCategory; emoji: string; color: string }[] = [
    { name: 'Fish', emoji: '🐟', color: 'from-blue-500 to-cyan-500' },
    { name: 'Prawn', emoji: '🦐', color: 'from-pink-500 to-rose-500' },
    { name: 'Crab', emoji: '🦀', color: 'from-orange-500 to-red-500' },
    { name: 'Squid', emoji: '🦑', color: 'from-purple-500 to-indigo-500' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* All Categories Button */}
      <button
        onClick={() => onCategoryChange('')}
        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
          selectedCategory === ''
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        🌊 All
      </button>

      {/* Category Buttons */}
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onCategoryChange(cat.name)}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
            selectedCategory === cat.name
              ? `bg-gradient-to-r ${cat.color} text-white shadow-md`
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {cat.emoji} {cat.name}
        </button>
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Availability Toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <div
          className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${
            showAvailableOnly ? 'bg-green-500' : 'bg-slate-300'
          }`}
        >
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={(e) => onAvailabilityToggle(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
              showAvailableOnly ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline">In Stock</span>
      </label>
    </div>
  );
};
