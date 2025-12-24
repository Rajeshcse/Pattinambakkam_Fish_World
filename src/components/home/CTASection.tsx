import React from 'react';
import { Link } from 'react-router-dom';
import { OceanBackground } from './OceanBackground';
import type { User } from '@/types';

interface CTASectionProps {
  isAuthenticated: boolean;
  user?: User | null;
}

export const CTASection: React.FC<CTASectionProps> = ({ isAuthenticated, user }) => {
  return (
    <div className="relative py-12 sm:py-16 lg:py-24 ocean-gradient overflow-hidden">
      <OceanBackground bubbleCount={8} includeSparkles={false} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {isAuthenticated && user ? (
          <>
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">👋</div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 px-2">
              Welcome back, <span className="text-amber-300">{user.name}!</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Ready for fresh fish today? Check out our latest catch!
            </p>
            <Link to="/products">
              <button className="px-6 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 font-bold text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50">
                🐟 Start Shopping Now
              </button>
            </Link>
          </>
        ) : (
          <>
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">🐟</div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 px-2">
              Ready to Taste the <span className="text-amber-300">Freshest Fish?</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Join 500+ happy customers who enjoy farm-fresh seafood delivered to their doorstep!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link to="/register">
                <button className="w-full sm:w-auto px-6 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 font-bold text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50">
                  🎉 Create Free Account
                </button>
              </Link>
              <Link to="/login">
                <button className="w-full sm:w-auto px-6 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 glass text-white font-bold text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl transition-all duration-300 hover:bg-white/20 hover:scale-105">
                  Sign In →
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
