export interface HowItWorksStep {
  id: string;
  step: number;
  icon: string;
  title: string;
  description: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: 'browse',
    step: 1,
    icon: '📱',
    title: 'Browse & Select',
    description: "Check out today's fresh catch and pick your favorites!",
  },
  {
    id: 'order',
    step: 2,
    icon: '💬',
    title: 'WhatsApp Order',
    description: 'Click "Buy Now" and pay with Google Pay!',
  },
  {
    id: 'delivery',
    step: 3,
    icon: '🏍️',
    title: 'Fast Delivery',
    description: 'Rapido delivers fresh fish to your doorstep!',
  },
];
