import React from 'react';
import { Layout } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection';
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';

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
