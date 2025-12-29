import React from 'react';

interface ProductInfoProps {
  name: string;
  category: string;
  price: number;
  stockStatus: {
    text: string;
    color: string;
  };
}

/**
 * ProductInfo Component
 *
 * Displays product name, category badge, price, and stock status
 */
export const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  category,
  price,
  stockStatus,
}) => {
  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      Fish: 'bg-blue-100 text-blue-800 border-blue-300',
      Prawn: 'bg-pink-100 text-pink-800 border-pink-300',
      Crab: 'bg-orange-100 text-orange-800 border-orange-300',
      Squid: 'bg-purple-100 text-purple-800 border-purple-300',
    };
    return colors[cat] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <>
      {/* Category Badge */}
      <div className="mb-3">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(
            category,
          )}`}
        >
          {category}
        </span>
      </div>

      {/* Product Name */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{name}</h1>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-green-600">₹{price}</span>
          <span className="text-base text-gray-500">/250g</span>
        </div>
      </div>

      {/* Stock Status */}
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${stockStatus.color}`}
        >
          {stockStatus.text}
        </span>
      </div>
    </>
  );
};
