import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MetricsDashboard } from '../components/MetricsDashboard';
import { CodeShowcase } from '../components/CodeShowcase';
import { DevOpsPipeline } from '../components/DevOpsPipeline';
import { LiveTerminal } from '../components/LiveTerminal';
import { BuildWithMe } from '../components/BuildWithMe';
import { ProjectStory } from '../components/ProjectStory';
import { TechConstellation } from '../components/TechConstellation';
import { RealTimeTransparency } from '../components/RealTimeTransparency';
import { ClientPortalPreview } from '../components/ClientPortalPreview';
import { DeveloperEasterEgg } from '../components/DeveloperEasterEgg';

const HomePage = () => {

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-purple-900/20" />
        
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 inline-block">
              <Badge variant="outline" className="text-blue-400 border-blue-400 px-4 py-2 text-sm">
                DevOps Engineer & Full-Stack Developer
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Building the Future
              <br />
              One Line at a Time
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Hi, I'm <span className="text-blue-400 font-semibold">Herve Kajingu</span>. 
              I transform ideas into scalable, high-performance solutions with cutting-edge DevOps practices and modern web technologies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/client-portal">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Let's Build Together
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10">
                  View Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Metrics Dashboard */}
      <MetricsDashboard />

      {/* Code Showcase Section */}
      <CodeShowcase />

      {/* DevOps Pipeline Section */}
      <DevOpsPipeline />

      {/* Live Terminal Section */}
      <LiveTerminal />

      {/* Build with Me Section */}
      <BuildWithMe />

      {/* Project Story Section */}
      <ProjectStory />

      {/* Tech Constellation Section */}
      <TechConstellation />

      {/* Real-Time Transparency Section */}
      <RealTimeTransparency />

      {/* Client Portal Preview Section */}
      <ClientPortalPreview />

      {/* Developer Easter Egg */}
      <DeveloperEasterEgg />
    </PageLayout>
  );
};

export default HomePage;
