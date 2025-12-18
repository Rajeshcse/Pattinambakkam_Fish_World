import React from 'react';
import { Link } from 'react-router-dom';
import { OceanBackground } from './OceanBackground';

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isAuthenticated }) => {
  return (
    <div className="relative min-h-[90vh] overflow-hidden ocean-gradient">
      <OceanBackground bubbleCount={15} includeSparkles={true} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 flex flex-col items-center justify-center min-h-[90vh]">
        <div className="text-center space-y-5 sm:space-y-8 max-w-4xl w-full">
          <div className="inline-flex items-center gap-2 px-6 py-3 fresh-badge rounded-full text-white font-bold text-sm uppercase tracking-wider animate-bounce-gentle">
            <span className="text-xl">🐟</span>
            <span>Fresh Catch Daily</span>
            <span className="text-xl">🌊</span>
          </div>

          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight px-2">
            <span className="block glow-text">Pattinambakkam</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 glow-text-gold animate-gradient">
              Fish World
            </span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed px-2">
            <span className="font-semibold text-cyan-200">Fresh seafood</span> from local fishermen,
            delivered to your doorstep in hours!{' '}
            <span className="font-semibold text-amber-300"> across Chennai</span>
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 lg:gap-8 py-4 sm:py-6">
            <div className="glass rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center min-w-[100px] sm:min-w-[120px]">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">500+</div>
              <div className="text-cyan-200 text-xs sm:text-sm">Happy Customers</div>
            </div>
            <div className="glass rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center min-w-[100px] sm:min-w-[120px]">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">15+</div>
              <div className="text-cyan-200 text-xs sm:text-sm">Fish Varieties</div>
            </div>
            <div className="glass rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center min-w-[100px] sm:min-w-[120px]">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">2hrs</div>
              <div className="text-cyan-200 text-xs sm:text-sm">Delivery Time</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center pt-2 sm:pt-4">
            {isAuthenticated ? (
              <>
                <Link to="/products" className="w-full sm:w-auto">
                  <button className="group relative w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 font-bold text-base sm:text-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50 animate-pulse-glow">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      🛒 Browse Products
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </Link>
                <Link to="/my-orders" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 glass text-white font-bold text-base sm:text-xl rounded-xl sm:rounded-2xl transition-all duration-300 hover:bg-white/20 hover:scale-105">
                    📦 My Orders
                  </button>
                </Link>
              </>
            ) : (
              <Link to="/products" className="w-full sm:w-auto">
                <button className="group relative w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 font-bold text-base sm:text-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg
                      className="w-5 sm:w-6 h-5 sm:h-6 animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Start Shopping Now!
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
