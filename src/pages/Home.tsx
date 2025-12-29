import React from 'react';
import { Layout } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import {
  HeroSection,
  FeaturedProductsSection,
  WhyChooseUsSection,
  HowItWorksSection,
  TestimonialsSection,
  CTASection,
} from '@/organizer/home';

export const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Layout>
      <HeroSection isAuthenticated={isAuthenticated} />
      <FeaturedProductsSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection isAuthenticated={isAuthenticated} user={user} />
    </Layout>
  );
};
