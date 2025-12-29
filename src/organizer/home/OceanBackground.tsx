import React from 'react';
import { AnimatedFish } from './AnimatedFish';

interface OceanBackgroundProps {
  bubbleCount?: number;
  includeSparkles?: boolean;
}

const fishAnimations = [
  // Regular fish swimming left to right
  { emoji: '🐟', topPosition: '15%', size: 'large' as const, opacity: 60, duration: 22, delay: 0 },
  { emoji: '🐠', topPosition: '25%', size: 'xlarge' as const, opacity: 50, duration: 28, delay: 3 },
  { emoji: '🐡', topPosition: '40%', size: 'xlarge' as const, opacity: 55, duration: 24, delay: 7 },
  { emoji: '🐟', topPosition: '55%', size: 'large' as const, opacity: 60, duration: 26, delay: 2 },
  { emoji: '🐠', topPosition: '70%', size: 'xlarge' as const, opacity: 50, duration: 30, delay: 9 },
  { emoji: '🐟', topPosition: '80%', size: 'large' as const, opacity: 55, duration: 20, delay: 5 },

  // Reverse direction fish
  { emoji: '🐠', topPosition: '18%', size: 'medium' as const, opacity: 50, duration: 25, delay: 4, reverse: true },
  { emoji: '🐟', topPosition: '35%', size: 'large' as const, opacity: 55, duration: 27, delay: 8, reverse: true },
  { emoji: '🐡', topPosition: '60%', size: 'xlarge' as const, opacity: 60, duration: 23, delay: 1, reverse: true },
  { emoji: '🐠', topPosition: '75%', size: 'medium' as const, opacity: 50, duration: 29, delay: 6, reverse: true },

  // Prawns and other seafood
  { emoji: '🦐', topPosition: '22%', size: 'medium' as const, opacity: 70, duration: 18, delay: 2 },
  { emoji: '🦐', topPosition: '45%', size: 'large' as const, opacity: 65, duration: 16, delay: 5 },
  { emoji: '🦐', topPosition: '65%', size: 'medium' as const, opacity: 70, duration: 19, delay: 8 },
  { emoji: '🦐', topPosition: '30%', size: 'medium' as const, opacity: 65, duration: 17, delay: 3, reverse: true },
  { emoji: '🦐', topPosition: '50%', size: 'large' as const, opacity: 70, duration: 20, delay: 7, reverse: true },

  // Fish schools
  { emoji: '🐟🐟🐟', topPosition: '28%', size: 'small' as const, opacity: 40, duration: 15, delay: 1 },
  { emoji: '🐠🐠🐠', topPosition: '85%', size: 'small' as const, opacity: 40, duration: 14, delay: 4 },
  { emoji: '🐟🐟', topPosition: '48%', size: 'small' as const, opacity: 40, duration: 16, delay: 6, reverse: true },
];

export const OceanBackground: React.FC<OceanBackgroundProps> = ({
  bubbleCount = 15,
  includeSparkles = false
}) => {
  return (
    <>
      {/* Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(bubbleCount)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-bubble"
            style={{
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Swimming Fish */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {fishAnimations.map((fish, index) => (
          <AnimatedFish key={index} {...fish} />
        ))}
      </div>

      {/* Sparkles */}
      {includeSparkles && (
        <>
          <div className="hidden sm:block absolute top-20 right-20 text-4xl animate-sparkle">
            ✨
          </div>
          <div className="hidden sm:block absolute top-40 left-20 text-3xl animate-sparkle delay-500">
            ✨
          </div>
          <div className="hidden sm:block absolute bottom-40 right-32 text-2xl animate-sparkle delay-300">
            ✨
          </div>
        </>
      )}
    </>
  );
};
