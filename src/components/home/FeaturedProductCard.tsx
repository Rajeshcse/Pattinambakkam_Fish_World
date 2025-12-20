import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from '@/components/common/icons';
import type { FeaturedProduct } from '@/data/featuredProducts';

interface FeaturedProductCardProps {
  product: FeaturedProduct;
}

export const FeaturedProductCard: React.FC<FeaturedProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products?category=${product.category}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="fish-card group bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-cyan-500/20 transition-shadow duration-300"
    >
      <div
        className={`relative h-28 sm:h-36 lg:h-48 bg-gradient-to-br ${product.gradient} flex items-center justify-center`}
      >
        <div className="text-5xl sm:text-6xl lg:text-8xl group-hover:scale-110 transition-transform duration-500">
          {product.emoji}
        </div>
        <div
          className={`absolute top-2 sm:top-4 left-2 sm:left-4 ${product.badgeColor} px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white`}
        >
          {product.badge}
        </div>
      </div>
      <div className="p-3 sm:p-4 lg:p-6">
        <h3 className="text-base sm:text-lg lg:text-2xl font-bold text-white mb-1 sm:mb-2">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2">
          {product.tamilName} - {product.description}
        </p>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="price-tag px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl">
            <span className="text-white font-black text-sm sm:text-base lg:text-xl">
              ₹{product.price}
            </span>
            <span className="text-white/70 text-xs sm:text-sm">/{product.unit || 'kg'}</span>
          </div>
        </div>
        <div className="flex justify-center gap-0.5 sm:gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} color="#fbbf24" filled={i < product.rating} />
          ))}
        </div>
      </div>
    </div>
  );
};
