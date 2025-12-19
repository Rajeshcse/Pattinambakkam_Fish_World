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
}

export const featuredProducts: FeaturedProduct[] = [
  {
    id: 'seer-fish',
    name: 'Seer Fish',
    tamilName: 'வஞ்சரம்',
    description: 'Premium king fish',
    price: 650,
    emoji: '🐟',
    badge: 'FRESH',
    badgeColor: 'fresh-badge',
    gradient: 'from-cyan-600/30 to-blue-800/30',
    rating: 5,
  },
  {
    id: 'white-pomfret',
    name: 'White Pomfret',
    tamilName: 'வெள்ளை வாவல்',
    description: 'Soft, delicate',
    price: 800,
    emoji: '🐠',
    badge: 'POPULAR',
    badgeColor: 'fresh-badge',
    gradient: 'from-teal-600/30 to-emerald-800/30',
    rating: 5,
  },
  {
    id: 'tiger-prawns',
    name: 'Tiger Prawns',
    tamilName: 'இறால்',
    description: 'Jumbo size',
    price: 550,
    emoji: '🦐',
    badge: '🔥 HOT',
    badgeColor: 'bg-red-500 shadow-lg shadow-red-500/50',
    gradient: 'from-orange-600/30 to-red-800/30',
    rating: 5,
  },
  {
    id: 'sea-crab',
    name: 'Sea Crab',
    tamilName: 'நண்டு',
    description: 'Fresh, meaty crabs',
    price: 450,
    emoji: '🦀',
    badge: 'PREMIUM',
    badgeColor: 'fresh-badge',
    gradient: 'from-amber-600/30 to-orange-800/30',
    rating: 4,
  },
];
