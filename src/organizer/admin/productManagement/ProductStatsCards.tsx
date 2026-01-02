import React from 'react';

interface ProductStatsCardsProps {
  stats: {
    totalProducts: number;
    availableProducts: number;
    totalStock: number;
    averagePrice: number;
  };
}

export const ProductStatsCards: React.FC<ProductStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
        <div className="text-xs sm:text-sm text-gray-600 mb-1">Total</div>
        <div className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalProducts}</div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
        <div className="text-xs sm:text-sm text-gray-600 mb-1">Available</div>
        <div className="text-lg sm:text-2xl font-bold text-green-600">
          {stats.availableProducts}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
        <div className="text-xs sm:text-sm text-gray-600 mb-1">Stock</div>
        <div className="text-lg sm:text-2xl font-bold text-blue-600">{stats.totalStock} kg</div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
        <div className="text-xs sm:text-sm text-gray-600 mb-1">Avg Price</div>
        <div className="text-lg sm:text-2xl font-bold text-purple-600">
          ₹{stats.averagePrice.toFixed(0)}
        </div>
      </div>
    </div>
  );
};
