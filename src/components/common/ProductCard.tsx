import React from 'react';
import type { FishProduct } from '@/types';

interface ProductCardProps {
  product: FishProduct;
  onBuyNow?: (product: FishProduct) => void;
  showAdminActions?: boolean;
  onEdit?: (product: FishProduct) => void;
  onDelete?: (product: FishProduct) => void;
  onToggleAvailability?: (product: FishProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuyNow,
  showAdminActions = false,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  const whatsappNumber = '9994072395'; // Replace with your actual WhatsApp number

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(product);
    } else {
      // Default behavior: Open WhatsApp with pre-filled message
      const message = `Hi, I'm interested in buying *${product.name}* (${product.category}) priced at ₹${product.price}`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Fish: 'bg-blue-100 text-blue-800',
      Prawn: 'bg-pink-100 text-pink-800',
      Crab: 'bg-orange-100 text-orange-800',
      Squid: 'bg-purple-100 text-purple-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return { text: 'Out of Stock', color: 'text-red-600' };
    } else if (product.stock < 10) {
      return { text: `Only ${product.stock} left`, color: 'text-orange-600' };
    }
    return { text: 'In Stock', color: 'text-green-600' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'>
      {/* Product Image */}
      <div className='relative h-48 bg-gray-200 overflow-hidden'>
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className='w-full h-full object-cover'
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        ) : (
          <div className='flex items-center justify-center h-full'>
            <svg
              className='w-20 h-20 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
          </div>
        )}

        {/* Availability Badge */}
        {!product.isAvailable && (
          <div className='absolute top-0 left-0 right-0 bg-red-600 text-white text-center py-1 text-sm font-semibold'>
            Not Available
          </div>
        )}

        {/* Category Badge */}
        <div className='absolute bottom-2 right-2'>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(product.category)}`}
          >
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className='p-4'>
        <h3 className='text-lg font-semibold text-gray-800 mb-1 truncate'>
          {product.name}
        </h3>

        {product.description && (
          <p className='text-sm text-gray-600 mb-3 line-clamp-2'>
            {product.description}
          </p>
        )}

        {/* Price and Stock */}
        <div className='flex items-center justify-between mb-4'>
          <div className='text-2xl font-bold text-green-600'>
            ₹{product.price}
            <span className='text-sm text-gray-500 font-normal'>/kg</span>
          </div>
          <div className={`text-sm font-semibold ${stockStatus.color}`}>
            {stockStatus.text}
          </div>
        </div>

        {/* Action Buttons */}
        {showAdminActions ? (
          <div className='flex gap-2'>
            <button
              onClick={() => onEdit && onEdit(product)}
              className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold'
            >
              Edit
            </button>
            <button
              onClick={() =>
                onToggleAvailability && onToggleAvailability(product)
              }
              className={`flex-1 py-2 px-4 rounded-md transition-colors text-sm font-semibold ${
                product.isAvailable
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {product.isAvailable ? 'Hide' : 'Show'}
            </button>
            <button
              onClick={() => onDelete && onDelete(product)}
              className='bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm font-semibold'
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={handleBuyNow}
            disabled={!product.isAvailable || product.stock === 0}
            className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${
              !product.isAvailable || product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {!product.isAvailable || product.stock === 0
              ? 'Not Available'
              : 'Buy Now via WhatsApp'}
          </button>
        )}
      </div>
    </div>
  );
};
