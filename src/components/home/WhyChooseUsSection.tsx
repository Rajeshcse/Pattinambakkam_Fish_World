import React from 'react';
import { Truck, Leaf, CheckCircle } from '@/components/common/icons';

const features = [
  {
    icon: Truck,
    title: 'Lightning Fast Delivery',
    description: 'From sea to your kitchen in just 2 hours! Our delivery partners ensure your fish arrives fresh and on time.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Leaf,
    title: '100% Fresh & Organic',
    description: 'No frozen fish here! Every catch is fresh from the morning and naturally sourced from local fishermen.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: CheckCircle,
    title: 'Quality Guaranteed',
    description: 'Not satisfied? Full refund, no questions asked. We stand behind the quality of every fish we deliver.',
    gradient: 'from-orange-500 to-amber-500',
  },
];

export const WhyChooseUsSection: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="inline-block px-3 sm:px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            WHY CHOOSE US
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
            The <span className="text-primary-600">Freshest</span> Experience
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            We're not just selling fish — we're delivering happiness to your kitchen!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>

                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon size={32} color="white" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
