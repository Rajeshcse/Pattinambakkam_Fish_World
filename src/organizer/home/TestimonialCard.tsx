import React from 'react';
import { Star } from '@/components/common/icons';
import type { Testimonial } from '@/data/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-600 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2">
      <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} size={16} color="#fbbf24" filled />
        ))}
      </div>
      <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed">
        {testimonial.text}
      </p>
      <div className="flex items-center gap-3 sm:gap-4">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${testimonial.avatarGradient} rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg lg:text-xl`}
        >
          {testimonial.initials}
        </div>
        <div>
          <p className="font-bold text-white text-sm sm:text-base lg:text-lg">
            {testimonial.name}
          </p>
          <p className="text-gray-400 text-xs sm:text-sm">{testimonial.location}</p>
        </div>
      </div>
    </div>
  );
};
