import React from 'react';
import { howItWorksSteps } from '@/data/howItWorks';

export const HowItWorksSection: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="inline-block px-3 sm:px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            SUPER EASY ORDERING
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4 px-2">
            3 Simple Steps to <span className="text-primary-600">Fresh Fish</span>
          </h2>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-16 lg:top-24 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary-300 via-primary-500 to-primary-300 rounded-full"></div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {howItWorksSteps.map((step) => (
              <div key={step.id} className="relative text-center group">
                <div className="relative inline-block mb-4 sm:mb-6 lg:mb-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-primary-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-primary-200 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                      {step.step}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-lg sm:text-xl lg:text-2xl">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-2">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
