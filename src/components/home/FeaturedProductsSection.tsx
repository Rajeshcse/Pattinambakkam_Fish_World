import React from 'react';
import { Link } from 'react-router-dom';
import { FeaturedProductCard } from './FeaturedProductCard';
import { featuredProducts } from '@/data/featuredProducts';

export const FeaturedProductsSection: React.FC = () => {
  return (
    <div className="relative py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-6">
        <span className="inline-block px-3 sm:px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
          🔥 TODAY'S FRESH CATCH
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4">
          Premium{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Seafood
          </span>
        </h2>
        <p className="text-sm sm:text-base lg:text-xl text-gray-400 max-w-2xl mx-auto px-2">
          Hand-picked by local fishermen this morning. Fresh, delicious, and ready for your
          kitchen!
        </p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
          {featuredProducts.map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 sm:mt-10 lg:mt-12 px-4">
          <Link to="/products">
            <button className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30">
              View All Fresh Fish →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
