import fishImage from '@/assets/images/products/fish.png';
import crabImage from '@/assets/images/products/crab2.png';

export interface FeaturedProduct {
  id: string;
  name: string;
  tamilName: string;
  description: string;
  price: number;
  emoji: string;
  badge: string;
  badgeColor: string;
  gradient: string;
  rating: number;
  category: 'Fish' | 'Prawn' | 'Crab' | 'Squid';
  unit?: string;
}

export const featuredProducts: FeaturedProduct[] = [
  {
    id: 'white-pomfret',
    name: 'Fresh Fish',
    tamilName: 'வெள்ளை வாவல்',
    description: 'Soft, delicate',
    price: 200,
    emoji: fishImage,
    badge: 'POPULAR',
    badgeColor: 'fresh-badge',
    gradient: 'from-teal-600/30 to-emerald-800/30',
    rating: 5,
    category: 'Fish',
    unit: '250g',
  },
  {
    id: 'squid',
    name: 'Sea Squid',
    tamilName: 'கணவாய்',
    description: 'Fresh squid',
    price: 165,
    emoji: '🦑',
    badge: 'FRESH',
    badgeColor: 'fresh-badge',
    gradient: 'from-purple-600/30 to-indigo-800/30',
    rating: 5,
    category: 'Squid',
    unit: '250g',
  },
  {
    id: 'tiger-prawns',
    name: 'Premium Prawns',
    tamilName: 'இறால்',
    description: 'Jumbo size',
    price: 140,
    emoji: '🦐',
    badge: '🔥 HOT',
    badgeColor: 'bg-red-500 shadow-lg shadow-red-500/50',
    gradient: 'from-orange-600/30 to-red-800/30',
    rating: 5,
    category: 'Prawn',
    unit: '250g',
  },
  {
    id: 'sea-crab',
    name: 'Coastal Crab',
    tamilName: 'நண்டு',
    description: 'Fresh, meaty crabs',
    price: 115,
    emoji: crabImage,
    badge: 'PREMIUM',
    badgeColor: 'fresh-badge',
    gradient: 'from-amber-600/30 to-orange-800/30',
    rating: 4,
    category: 'Crab',
    unit: '250g',
  },
];
