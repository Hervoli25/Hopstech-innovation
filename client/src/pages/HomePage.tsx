import { useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import HeroSection from '../components/enterprise/HeroSection';
import AboutSection from '../components/enterprise/AboutSection';
import ServicesSection from '../components/enterprise/ServicesSection';
import CaseStudiesSection from '../components/enterprise/CaseStudiesSection';
import { scrollToSection } from '../lib/scrollToSection';

const HomePage = () => {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const timer = window.setTimeout(() => scrollToSection(hash), 100);
      return () => window.clearTimeout(timer);
    }
  }, []);

  return (
    <PageLayout>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <CaseStudiesSection />
    </PageLayout>
  );
};

export default HomePage;
