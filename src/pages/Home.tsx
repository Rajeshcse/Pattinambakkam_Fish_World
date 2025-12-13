import React from 'react';
import { Layout } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import {
  Fish,
  Truck,
  Leaf,
  CheckCircle,
  Star,
} from '@/components/common/icons';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Layout>
      {/* ============================================
          HERO SECTION - Full Screen Ocean Experience
          ============================================ */}
      <div className='relative min-h-[90vh] overflow-hidden ocean-gradient'>
        {/* Animated Bubbles Background */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className='absolute rounded-full bg-white/10 animate-bubble'
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

        {/* Swimming Fish and Prawns - Enhanced Ocean Life */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          {/* Large Fish Swimming Right */}
          <div
            className='absolute top-[15%] animate-swim opacity-60'
            style={{ animationDuration: '22s', animationDelay: '0s' }}
          >
            <div className='text-6xl drop-shadow-lg'>🐟</div>
          </div>
          <div
            className='absolute top-[25%] animate-swim opacity-50'
            style={{ animationDuration: '28s', animationDelay: '3s' }}
          >
            <div className='text-7xl drop-shadow-lg'>🐠</div>
          </div>
          <div
            className='absolute top-[40%] animate-swim opacity-55'
            style={{ animationDuration: '24s', animationDelay: '7s' }}
          >
            <div className='text-8xl drop-shadow-lg'>🐡</div>
          </div>
          <div
            className='absolute top-[55%] animate-swim opacity-60'
            style={{ animationDuration: '26s', animationDelay: '2s' }}
          >
            <div className='text-6xl drop-shadow-lg'>🐟</div>
          </div>
          <div
            className='absolute top-[70%] animate-swim opacity-50'
            style={{ animationDuration: '30s', animationDelay: '9s' }}
          >
            <div className='text-7xl drop-shadow-lg'>🐠</div>
          </div>
          <div
            className='absolute top-[80%] animate-swim opacity-55'
            style={{ animationDuration: '20s', animationDelay: '5s' }}
          >
            <div className='text-6xl drop-shadow-lg'>🐟</div>
          </div>

          {/* Fish Swimming Left (reverse direction) */}
          <div
            className='absolute top-[18%] animate-swim-reverse opacity-50'
            style={{ animationDuration: '25s', animationDelay: '4s' }}
          >
            <div className='text-5xl drop-shadow-lg transform scale-x-[-1]'>
              🐠
            </div>
          </div>
          <div
            className='absolute top-[35%] animate-swim-reverse opacity-55'
            style={{ animationDuration: '27s', animationDelay: '8s' }}
          >
            <div className='text-6xl drop-shadow-lg transform scale-x-[-1]'>
              🐟
            </div>
          </div>
          <div
            className='absolute top-[60%] animate-swim-reverse opacity-60'
            style={{ animationDuration: '23s', animationDelay: '1s' }}
          >
            <div className='text-7xl drop-shadow-lg transform scale-x-[-1]'>
              🐡
            </div>
          </div>
          <div
            className='absolute top-[75%] animate-swim-reverse opacity-50'
            style={{ animationDuration: '29s', animationDelay: '6s' }}
          >
            <div className='text-5xl drop-shadow-lg transform scale-x-[-1]'>
              🐠
            </div>
          </div>

          {/* Prawns Swimming */}
          <div
            className='absolute top-[22%] animate-swim opacity-70'
            style={{ animationDuration: '18s', animationDelay: '2s' }}
          >
            <div className='text-5xl drop-shadow-lg'>🦐</div>
          </div>
          <div
            className='absolute top-[45%] animate-swim opacity-65'
            style={{ animationDuration: '16s', animationDelay: '5s' }}
          >
            <div className='text-6xl drop-shadow-lg'>🦐</div>
          </div>
          <div
            className='absolute top-[65%] animate-swim opacity-70'
            style={{ animationDuration: '19s', animationDelay: '8s' }}
          >
            <div className='text-5xl drop-shadow-lg'>🦐</div>
          </div>

          {/* Prawns Swimming Left */}
          <div
            className='absolute top-[30%] animate-swim-reverse opacity-65'
            style={{ animationDuration: '17s', animationDelay: '3s' }}
          >
            <div className='text-5xl drop-shadow-lg transform scale-x-[-1]'>
              🦐
            </div>
          </div>
          <div
            className='absolute top-[50%] animate-swim-reverse opacity-70'
            style={{ animationDuration: '20s', animationDelay: '7s' }}
          >
            <div className='text-6xl drop-shadow-lg transform scale-x-[-1]'>
              🦐
            </div>
          </div>

          {/* Small Fish Schools (faster movement) */}
          <div
            className='absolute top-[28%] animate-swim opacity-40'
            style={{ animationDuration: '15s', animationDelay: '1s' }}
          >
            <div className='text-4xl drop-shadow-lg'>🐟🐟🐟</div>
          </div>
          <div
            className='absolute top-[85%] animate-swim opacity-40'
            style={{ animationDuration: '14s', animationDelay: '4s' }}
          >
            <div className='text-4xl drop-shadow-lg'>🐠🐠🐠</div>
          </div>
          <div
            className='absolute top-[48%] animate-swim-reverse opacity-40'
            style={{ animationDuration: '16s', animationDelay: '6s' }}
          >
            <div className='text-3xl drop-shadow-lg transform scale-x-[-1]'>
              🐟🐟
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 flex flex-col items-center justify-center min-h-[90vh]'>
          {/* Sparkle Effect - Hidden on mobile */}
          <div className='hidden sm:block absolute top-20 right-20 text-4xl animate-sparkle'>
            ✨
          </div>
          <div className='hidden sm:block absolute top-40 left-20 text-3xl animate-sparkle delay-500'>
            ✨
          </div>
          <div className='hidden sm:block absolute bottom-40 right-32 text-2xl animate-sparkle delay-300'>
            ✨
          </div>

          {/* Main Hero Text */}
          <div className='text-center space-y-5 sm:space-y-8 max-w-4xl w-full'>
            {/* Fresh Badge */}
            <div className='inline-flex items-center gap-2 px-6 py-3 fresh-badge rounded-full text-white font-bold text-sm uppercase tracking-wider animate-bounce-gentle'>
              <span className='text-xl'>🐟</span>
              <span>Fresh Catch Daily</span>
              <span className='text-xl'>🌊</span>
            </div>

            {/* Main Headline */}
            <h1 className='text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight px-2'>
              <span className='block glow-text'>Pattinambakkam</span>
              <span className='block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 glow-text-gold animate-gradient'>
                Fish World
              </span>
            </h1>

            {/* Subheadline */}
            <p className='text-base sm:text-xl md:text-2xl lg:text-3xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed px-2'>
              <span className='font-semibold text-cyan-200'>Fresh seafood</span>{' '}
              from local fishermen, delivered to your doorstep in hours!{' '}
              <span className='font-semibold text-amber-300'>
                {' '}
                across Chennai
              </span>
            </p>

            {/* Trust Stats */}
            <div className='flex flex-wrap justify-center gap-3 sm:gap-6 lg:gap-8 py-4 sm:py-6'>
              <div className='glass rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center min-w-[100px] sm:min-w-[120px]'>
                <div className='text-2xl sm:text-3xl lg:text-4xl font-black text-white'>
                  500+
                </div>
                <div className='text-cyan-200 text-xs sm:text-sm'>
                  Happy Customers
                </div>
              </div>
              <div className='glass rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center min-w-[100px] sm:min-w-[120px]'>
                <div className='text-2xl sm:text-3xl lg:text-4xl font-black text-white'>
                  15+
                </div>
                <div className='text-cyan-200 text-xs sm:text-sm'>
                  Fish Varieties
                </div>
              </div>
              <div className='glass rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center min-w-[100px] sm:min-w-[120px]'>
                <div className='text-2xl sm:text-3xl lg:text-4xl font-black text-white'>
                  2hrs
                </div>
                <div className='text-cyan-200 text-xs sm:text-sm'>
                  Avg Delivery
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 px-4 sm:px-0 w-full sm:w-auto'>
              {!isAuthenticated ? (
                <>
                  <Link to='/products' className='w-full sm:w-auto'>
                    <button className='group relative w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 font-bold text-base sm:text-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50 animate-pulse-glow'>
                      <span className='relative z-10 flex items-center justify-center gap-2 sm:gap-3'>
                        🛒 Order Fresh Fish Now
                      </span>
                      <div className='absolute inset-0 bg-gradient-to-r from-amber-300 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    </button>
                  </Link>
                  <Link to='/login' className='w-full sm:w-auto'>
                    <button className='w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 glass text-white font-bold text-base sm:text-xl rounded-xl sm:rounded-2xl transition-all duration-300 hover:bg-white/20 hover:scale-105'>
                      Sign In →
                    </button>
                  </Link>
                </>
              ) : (
                <Link to='/products' className='w-full sm:w-auto'>
                  <button className='group relative w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 font-bold text-base sm:text-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50'>
                    <span className='relative z-10 flex items-center justify-center gap-2 sm:gap-3'>
                      🛒 Browse Today's Catch
                    </span>
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Scroll Indicator - Hidden on very small screens */}
          <div className='hidden xs:flex absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 text-white/70 animate-bounce'>
            <div className='flex flex-col items-center gap-1 sm:gap-2'>
              <span className='text-xs sm:text-sm'>Scroll to explore</span>
              <svg
                className='w-5 h-5 sm:w-6 sm:h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 14l-7 7m0 0l-7-7m7 7V3'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          FEATURED FISH - Mouth-Watering Display
          ============================================ */}
      <div className='relative py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'>
        {/* Section Header */}
        <div className='text-center mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-6'>
          <span className='inline-block px-3 sm:px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4'>
            🔥 TODAY'S FRESH CATCH
          </span>
          <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4'>
            Premium{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500'>
              Seafood
            </span>
          </h2>
          <p className='text-sm sm:text-base lg:text-xl text-gray-400 max-w-2xl mx-auto px-2'>
            Hand-picked by local fishermen this morning. Fresh, delicious, and
            ready for your kitchen!
          </p>
        </div>

        {/* Fish Grid */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8'>
            {/* Fish Card 1 - Seer Fish */}
            <div className='fish-card group bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl sm:rounded-3xl overflow-hidden'>
              <div className='relative h-28 sm:h-36 lg:h-48 bg-gradient-to-br from-cyan-600/30 to-blue-800/30 flex items-center justify-center'>
                <div className='text-5xl sm:text-6xl lg:text-8xl group-hover:scale-110 transition-transform duration-500'>
                  🐟
                </div>
                <div className='absolute top-2 sm:top-4 left-2 sm:left-4 fresh-badge px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white'>
                  FRESH
                </div>
                <div className='absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-0.5 sm:gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} color='#fbbf24' filled />
                  ))}
                </div>
              </div>
              <div className='p-3 sm:p-4 lg:p-6'>
                <h3 className='text-base sm:text-lg lg:text-2xl font-bold text-white mb-1 sm:mb-2'>
                  Seer Fish
                </h3>
                <p className='text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2'>
                  வஞ்சரம் - Premium king fish
                </p>
                <div className='flex items-center justify-between'>
                  <div className='price-tag px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl'>
                    <span className='text-white font-black text-sm sm:text-base lg:text-xl'>
                      ₹650
                    </span>
                    <span className='text-white/70 text-xs sm:text-sm'>
                      /kg
                    </span>
                  </div>
                  <button className='px-2 sm:px-3 lg:px-4 py-1 sm:py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg sm:rounded-xl transition-colors font-semibold text-xs sm:text-sm'>
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Fish Card 2 - Pomfret */}
            <div className='fish-card group bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl sm:rounded-3xl overflow-hidden'>
              <div className='relative h-28 sm:h-36 lg:h-48 bg-gradient-to-br from-teal-600/30 to-emerald-800/30 flex items-center justify-center'>
                <div className='text-5xl sm:text-6xl lg:text-8xl group-hover:scale-110 transition-transform duration-500'>
                  🐠
                </div>
                <div className='absolute top-2 sm:top-4 left-2 sm:left-4 fresh-badge px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white'>
                  POPULAR
                </div>
                <div className='absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-0.5 sm:gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} color='#fbbf24' filled />
                  ))}
                </div>
              </div>
              <div className='p-3 sm:p-4 lg:p-6'>
                <h3 className='text-base sm:text-lg lg:text-2xl font-bold text-white mb-1 sm:mb-2'>
                  White Pomfret
                </h3>
                <p className='text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2'>
                  வெள்ளை வாவல் - Soft, delicate
                </p>
                <div className='flex items-center justify-between'>
                  <div className='price-tag px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl'>
                    <span className='text-white font-black text-sm sm:text-base lg:text-xl'>
                      ₹800
                    </span>
                    <span className='text-white/70 text-xs sm:text-sm'>
                      /kg
                    </span>
                  </div>
                  <button className='px-2 sm:px-3 lg:px-4 py-1 sm:py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg sm:rounded-xl transition-colors font-semibold text-xs sm:text-sm'>
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Fish Card 3 - Prawns */}
            <div className='fish-card group bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl sm:rounded-3xl overflow-hidden'>
              <div className='relative h-28 sm:h-36 lg:h-48 bg-gradient-to-br from-orange-600/30 to-red-800/30 flex items-center justify-center'>
                <div className='text-5xl sm:text-6xl lg:text-8xl group-hover:scale-110 transition-transform duration-500'>
                  🦐
                </div>
                <div className='absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white shadow-lg shadow-red-500/50'>
                  🔥 HOT
                </div>
                <div className='absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-0.5 sm:gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} color='#fbbf24' filled />
                  ))}
                </div>
              </div>
              <div className='p-3 sm:p-4 lg:p-6'>
                <h3 className='text-base sm:text-lg lg:text-2xl font-bold text-white mb-1 sm:mb-2'>
                  Tiger Prawns
                </h3>
                <p className='text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2'>
                  இறால் - Jumbo size
                </p>
                <div className='flex items-center justify-between'>
                  <div className='price-tag px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl'>
                    <span className='text-white font-black text-sm sm:text-base lg:text-xl'>
                      ₹550
                    </span>
                    <span className='text-white/70 text-xs sm:text-sm'>
                      /kg
                    </span>
                  </div>
                  <button className='px-2 sm:px-3 lg:px-4 py-1 sm:py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg sm:rounded-xl transition-colors font-semibold text-xs sm:text-sm'>
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Fish Card 4 - Crab */}
            <div className='fish-card group bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl sm:rounded-3xl overflow-hidden'>
              <div className='relative h-28 sm:h-36 lg:h-48 bg-gradient-to-br from-amber-600/30 to-orange-800/30 flex items-center justify-center'>
                <div className='text-5xl sm:text-6xl lg:text-8xl group-hover:scale-110 transition-transform duration-500'>
                  🦀
                </div>
                <div className='absolute top-2 sm:top-4 left-2 sm:left-4 fresh-badge px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white'>
                  PREMIUM
                </div>
                <div className='absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-0.5 sm:gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} color='#fbbf24' filled={i < 4} />
                  ))}
                </div>
              </div>
              <div className='p-3 sm:p-4 lg:p-6'>
                <h3 className='text-base sm:text-lg lg:text-2xl font-bold text-white mb-1 sm:mb-2'>
                  Sea Crab
                </h3>
                <p className='text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2'>
                  நண்டு - Fresh, meaty crabs
                </p>
                <div className='flex items-center justify-between'>
                  <div className='price-tag px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl'>
                    <span className='text-white font-black text-sm sm:text-base lg:text-xl'>
                      ₹450
                    </span>
                    <span className='text-white/70 text-xs sm:text-sm'>
                      /kg
                    </span>
                  </div>
                  <button className='px-2 sm:px-3 lg:px-4 py-1 sm:py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg sm:rounded-xl transition-colors font-semibold text-xs sm:text-sm'>
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* View All Button */}
          <div className='text-center mt-8 sm:mt-10 lg:mt-12 px-4'>
            <Link to='/products'>
              <button className='w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30'>
                View All Fresh Fish →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================
          WHY CHOOSE US - Benefits Section
          ============================================ */}
      <div className='py-12 sm:py-16 lg:py-24 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div className='text-center mb-8 sm:mb-12 lg:mb-16'>
            <span className='inline-block px-3 sm:px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4'>
              WHY CHOOSE US
            </span>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4'>
              The <span className='text-primary-600'>Freshest</span> Experience
            </h2>
            <p className='text-sm sm:text-base lg:text-xl text-gray-600 max-w-2xl mx-auto px-2'>
              We're not just selling fish — we're delivering happiness to your
              kitchen!
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>
            {/* Benefit 1 */}
            <div className='group p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-100'>
              <div className='w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-200'>
                <Leaf
                  size={28}
                  color='#ffffff'
                  className='sm:w-8 sm:h-8 lg:w-10 lg:h-10'
                />
              </div>
              <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3'>
                100% Fresh & Clean
              </h3>
              <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
                Caught this morning, cleaned professionally, and delivered
                fresh. No frozen stuff!
              </p>
              <div className='mt-4 sm:mt-6 flex items-center gap-2 text-emerald-600 font-semibold text-sm sm:text-base'>
                <CheckCircle size={18} color='#10b981' />
                <span>Quality Guaranteed</span>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className='group p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-100'>
              <div className='w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-200'>
                <Truck
                  size={28}
                  color='#ffffff'
                  className='sm:w-8 sm:h-8 lg:w-10 lg:h-10'
                />
              </div>
              <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3'>
                Lightning Fast Delivery
              </h3>
              <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
                Partnered with Rapido for super-fast delivery. Order now, cook
                within hours!
              </p>
              <div className='mt-4 sm:mt-6 flex items-center gap-2 text-blue-600 font-semibold text-sm sm:text-base'>
                <CheckCircle size={18} color='#3b82f6' />
                <span>2-Hour Delivery</span>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className='group p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-100 hover:border-amber-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-100 sm:col-span-2 lg:col-span-1'>
              <div className='w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-200'>
                <span className='text-2xl sm:text-3xl'>💰</span>
              </div>
              <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3'>
                Best Market Prices
              </h3>
              <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
                Direct from fishermen = no middlemen markup. Premium quality at
                great prices!
              </p>
              <div className='mt-4 sm:mt-6 flex items-center gap-2 text-amber-600 font-semibold text-sm sm:text-base'>
                <CheckCircle size={18} color='#f59e0b' />
                <span>Save Up to 30%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          HOW IT WORKS - Simple Steps
          ============================================ */}
      <div className='py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div className='text-center mb-8 sm:mb-12 lg:mb-16'>
            <span className='inline-block px-3 sm:px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4'>
              SUPER EASY ORDERING
            </span>
            <h2 className='text-2xl sm:text-3xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4 px-2'>
              3 Simple Steps to{' '}
              <span className='text-primary-600'>Fresh Fish</span>
            </h2>
          </div>

          <div className='relative'>
            {/* Connection Line */}
            <div className='hidden lg:block absolute top-16 lg:top-24 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary-300 via-primary-500 to-primary-300 rounded-full'></div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12'>
              {/* Step 1 */}
              <div className='relative text-center group'>
                <div className='relative inline-block mb-4 sm:mb-6 lg:mb-8'>
                  <div className='w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-primary-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-primary-200 group-hover:scale-110 transition-transform duration-300'>
                    <span className='text-3xl sm:text-4xl lg:text-5xl font-black text-white'>
                      1
                    </span>
                  </div>
                  <div className='absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-lg sm:text-xl lg:text-2xl'>
                    📱
                  </div>
                </div>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3'>
                  Browse & Select
                </h3>
                <p className='text-gray-600 text-sm sm:text-base lg:text-lg px-2'>
                  Check out today's fresh catch and pick your favorites!
                </p>
              </div>

              {/* Step 2 */}
              <div className='relative text-center group'>
                <div className='relative inline-block mb-4 sm:mb-6 lg:mb-8'>
                  <div className='w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-primary-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-primary-200 group-hover:scale-110 transition-transform duration-300'>
                    <span className='text-3xl sm:text-4xl lg:text-5xl font-black text-white'>
                      2
                    </span>
                  </div>
                  <div className='absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-lg sm:text-xl lg:text-2xl'>
                    💬
                  </div>
                </div>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3'>
                  WhatsApp Order
                </h3>
                <p className='text-gray-600 text-sm sm:text-base lg:text-lg px-2'>
                  Click "Buy Now" and pay with Google Pay!
                </p>
              </div>

              {/* Step 3 */}
              <div className='relative text-center group'>
                <div className='relative inline-block mb-4 sm:mb-6 lg:mb-8'>
                  <div className='w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-primary-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-primary-200 group-hover:scale-110 transition-transform duration-300'>
                    <span className='text-3xl sm:text-4xl lg:text-5xl font-black text-white'>
                      3
                    </span>
                  </div>
                  <div className='absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-lg sm:text-xl lg:text-2xl'>
                    🏍️
                  </div>
                </div>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3'>
                  Fast Delivery
                </h3>
                <p className='text-gray-600 text-sm sm:text-base lg:text-lg px-2'>
                  Rapido delivers fresh fish to your doorstep!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          TESTIMONIALS - Social Proof
          ============================================ */}
      <div className='py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-900 to-slate-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div className='text-center mb-8 sm:mb-12 lg:mb-16'>
            <span className='inline-block px-3 sm:px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4'>
              ⭐ CUSTOMER LOVE
            </span>
            <h2 className='text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-3 sm:mb-4 px-2'>
              What Our{' '}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400'>
                Customers
              </span>{' '}
              Say
            </h2>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>
            {/* Testimonial 1 */}
            <div className='bg-gradient-to-br from-slate-800 to-slate-700 p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-600 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2'>
              <div className='flex gap-0.5 sm:gap-1 mb-3 sm:mb-4'>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} color='#fbbf24' filled />
                ))}
              </div>
              <p className='text-gray-300 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed'>
                "அருமையான மீன்! The seer fish was so fresh. Best fish service in
                Chennai!"
              </p>
              <div className='flex items-center gap-3 sm:gap-4'>
                <div className='w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg lg:text-xl'>
                  AK
                </div>
                <div>
                  <p className='font-bold text-white text-sm sm:text-base lg:text-lg'>
                    Arun Kumar
                  </p>
                  <p className='text-gray-400 text-xs sm:text-sm'>
                    Pattinambakkam
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className='bg-gradient-to-br from-slate-800 to-slate-700 p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-600 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2'>
              <div className='flex gap-0.5 sm:gap-1 mb-3 sm:mb-4'>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} color='#fbbf24' filled />
                ))}
              </div>
              <p className='text-gray-300 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed'>
                "WhatsApp ordering is genius! Prawns were huge and delicious.
                Will order again! 🦐"
              </p>
              <div className='flex items-center gap-3 sm:gap-4'>
                <div className='w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg lg:text-xl'>
                  PS
                </div>
                <div>
                  <p className='font-bold text-white text-sm sm:text-base lg:text-lg'>
                    Priya Sharma
                  </p>
                  <p className='text-gray-400 text-xs sm:text-sm'>
                    Thiruvanmiyur
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className='bg-gradient-to-br from-slate-800 to-slate-700 p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-600 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2 sm:col-span-2 lg:col-span-1'>
              <div className='flex gap-0.5 sm:gap-1 mb-3 sm:mb-4'>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} color='#fbbf24' filled />
                ))}
              </div>
              <p className='text-gray-300 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed'>
                "Supporting local fishermen feels great! Quality is much better
                than supermarket fish. 💯"
              </p>
              <div className='flex items-center gap-3 sm:gap-4'>
                <div className='w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg lg:text-xl'>
                  RM
                </div>
                <div>
                  <p className='font-bold text-white text-sm sm:text-base lg:text-lg'>
                    Rajesh Murthy
                  </p>
                  <p className='text-gray-400 text-xs sm:text-sm'>
                    Besant Nagar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          FINAL CTA - Conversion Section
          ============================================ */}
      <div className='relative py-12 sm:py-16 lg:py-24 ocean-gradient overflow-hidden'>
        {/* Background Decoration */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none opacity-10'>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className='absolute rounded-full bg-white animate-bubble'
              style={{
                width: `${Math.random() * 30 + 15}px`,
                height: `${Math.random() * 30 + 15}px`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 6 + 4}s`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className='relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center'>
          {isAuthenticated && user ? (
            <>
              <div className='text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6'>
                👋
              </div>
              <h2 className='text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 px-2'>
                Welcome back,{' '}
                <span className='text-amber-300'>{user.name}!</span>
              </h2>
              <p className='text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-2'>
                Ready for fresh fish today? Check out our latest catch!
              </p>
              <Link to='/products'>
                <button className='px-6 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 font-bold text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50'>
                  🐟 Start Shopping Now
                </button>
              </Link>
            </>
          ) : (
            <>
              <div className='text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6'>
                🐟
              </div>
              <h2 className='text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 px-2'>
                Ready to Taste the{' '}
                <span className='text-amber-300'>Freshest Fish?</span>
              </h2>
              <p className='text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-2'>
                Join 500+ happy customers who enjoy farm-fresh seafood delivered
                to their doorstep!
              </p>
              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4'>
                <Link to='/register'>
                  <button className='w-full sm:w-auto px-6 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 font-bold text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50'>
                    🎉 Create Free Account
                  </button>
                </Link>
                <Link to='/login'>
                  <button className='w-full sm:w-auto px-6 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 glass text-white font-bold text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl transition-all duration-300 hover:bg-white/20 hover:scale-105'>
                    Sign In →
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};
