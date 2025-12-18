import React from 'react';

interface AnimatedFishProps {
  emoji: string;
  topPosition: string;
  size: 'small' | 'medium' | 'large' | 'xlarge';
  opacity: number;
  duration: number;
  delay: number;
  reverse?: boolean;
}

const sizeClasses = {
  small: 'text-4xl',
  medium: 'text-5xl',
  large: 'text-6xl',
  xlarge: 'text-7xl',
};

export const AnimatedFish: React.FC<AnimatedFishProps> = ({
  emoji,
  topPosition,
  size,
  opacity,
  duration,
  delay,
  reverse = false,
}) => {
  return (
    <div
      className={`absolute ${reverse ? 'animate-swim-reverse' : 'animate-swim'}`}
      style={{
        top: topPosition,
        opacity: opacity / 100,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    >
      <div className={`${sizeClasses[size]} drop-shadow-lg ${reverse ? 'transform scale-x-[-1]' : ''}`}>
        {emoji}
      </div>
    </div>
  );
};
