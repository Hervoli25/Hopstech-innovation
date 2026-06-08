import { useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import HeroSection from '../components/enterprise/HeroSection';
import AboutSection from '../components/enterprise/AboutSection';
import CircuitDivider from '../components/enterprise/CircuitDivider';
import ServicesSection from '../components/enterprise/ServicesSection';
import CaseStudiesSection from '../components/enterprise/CaseStudiesSection';
import MetricsStrip from '../components/enterprise/MetricsStrip';
import HowWeShipSection from '../components/enterprise/HowWeShipSection';
import ClientVisibilitySection from '../components/enterprise/ClientVisibilitySection';
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
      <CircuitDivider />
      <ServicesSection />
      <CaseStudiesSection />
      <MetricsStrip />
      <HowWeShipSection />
      <ClientVisibilitySection />
    </PageLayout>
  );
};

export default HomePage;
