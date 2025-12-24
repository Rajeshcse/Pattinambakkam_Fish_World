export interface Testimonial {
  id: string;
  name: string;
  location: string;
  initials: string;
  avatarGradient: string;
  text: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Arun Kumar',
    location: 'Pattinambakkam',
    initials: 'AK',
    avatarGradient: 'from-amber-400 to-orange-500',
    text: '"அருமையான மீன்! The seer fish was so fresh. Best fish service in Chennai!"',
    rating: 5,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    location: 'Thiruvanmiyur',
    initials: 'PS',
    avatarGradient: 'from-pink-400 to-rose-500',
    text: '"WhatsApp ordering is genius! Prawns were huge and delicious. Will order again! 🦐"',
    rating: 5,
  },
  {
    id: '3',
    name: 'Rajesh Murthy',
    location: 'Besant Nagar',
    initials: 'RM',
    avatarGradient: 'from-emerald-400 to-teal-500',
    text: '"Supporting local fishermen feels great! Quality is much better than supermarket fish. 💯"',
    rating: 5,
  },
];
