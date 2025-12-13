import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { FadeIn } from './animations/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Target, Zap, TrendingUp, Users, Award } from 'lucide-react';

interface ProjectPhase {
  id: number;
  phase: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  metrics?: { label: string; value: string }[];
  testimonial?: string;
}

const projectStory: ProjectPhase[] = [
  {
    id: 1,
    phase: 'Discovery',
    title: 'Understanding the Challenge',
    description: 'Client needed a scalable e-commerce platform to handle 10,000+ daily users with real-time inventory management.',
    icon: <Target className="h-6 w-6" />,
    metrics: [
      { label: 'Timeline', value: '2 weeks' },
      { label: 'Stakeholders', value: '5 teams' },
    ],
  },
  {
    id: 2,
    phase: 'Planning',
    title: 'Architecture & Strategy',
    description: 'Designed microservices architecture with PostgreSQL, Redis caching, and event-driven communication.',
    icon: <Users className="h-6 w-6" />,
    metrics: [
      { label: 'Services', value: '8 microservices' },
      { label: 'Tech Stack', value: 'Node.js, React, PostgreSQL' },
    ],
  },
  {
    id: 3,
    phase: 'Development',
    title: 'Building the Solution',
    description: 'Implemented CI/CD pipeline, automated testing, and deployed to Kubernetes cluster with 99.9% uptime SLA.',
    icon: <Zap className="h-6 w-6" />,
    metrics: [
      { label: 'Code Coverage', value: '95%' },
      { label: 'API Endpoints', value: '120+' },
      { label: 'Duration', value: '12 weeks' },
    ],
  },
  {
    id: 4,
    phase: 'Launch',
    title: 'Going Live',
    description: 'Smooth production deployment with zero downtime migration and comprehensive monitoring setup.',
    icon: <TrendingUp className="h-6 w-6" />,
    metrics: [
      { label: 'Downtime', value: '0 minutes' },
      { label: 'Users Migrated', value: '50,000+' },
    ],
    testimonial: '"The deployment was flawless. Our customers didn\'t even notice the transition!"',
  },
  {
    id: 5,
    phase: 'Results',
    title: 'Impact & Success',
    description: 'Platform now handles 15,000+ daily users with 40% faster page loads and 99.95% uptime.',
    icon: <Award className="h-6 w-6" />,
    metrics: [
      { label: 'Performance Gain', value: '+40%' },
      { label: 'Uptime', value: '99.95%' },
      { label: 'User Growth', value: '+150%' },
      { label: 'Revenue Impact', value: '+$2M/year' },
    ],
    testimonial: '"This platform transformed our business. Best investment we\'ve made!"',
  },
];

export function ProjectStory() {
  const [activePhase, setActivePhase] = useState(0);
  const phase = projectStory[activePhase];

  return (
    <section className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Project Story: E-Commerce Platform
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Follow the journey from concept to success
          </p>
        </FadeIn>

        <div className="max-w-6xl mx-auto">
          {/* Timeline */}
          <div className="relative mb-12">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700 -translate-y-1/2" />
            <div className="relative flex justify-between">
              {projectStory.map((p, index) => (
                <button
                  key={p.id}
                  onClick={() => setActivePhase(index)}
                  className={`relative z-10 flex flex-col items-center gap-2 transition-all ${
                    index === activePhase ? 'scale-110' : 'scale-100'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      index <= activePhase
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-gray-400'
                    }`}
                  >
                    {p.icon}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      index === activePhase ? 'text-blue-400' : 'text-gray-500'
                    }`}
                  >
                    {p.phase}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Phase Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {phase.phase}
                    </Badge>
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">{phase.title}</h3>
                  <p className="text-gray-300 text-lg mb-6">{phase.description}</p>

                  {phase.metrics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {phase.metrics.map((metric, index) => (
                        <div
                          key={index}
                          className="bg-slate-900/50 rounded-lg p-4 text-center"
                        >
                          <p className="text-2xl font-bold text-blue-400 mb-1">{metric.value}</p>
                          <p className="text-xs text-gray-400">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {phase.testimonial && (
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
                      <p className="text-gray-300 italic text-lg">"{phase.testimonial}"</p>
                      <p className="text-sm text-gray-400 mt-2">— Client CEO</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => setActivePhase(Math.max(0, activePhase - 1))}
              disabled={activePhase === 0}
              variant="outline"
            >
              Previous Phase
            </Button>
            <Button
              onClick={() => setActivePhase(Math.min(projectStory.length - 1, activePhase + 1))}
              disabled={activePhase === projectStory.length - 1}
            >
              Next Phase
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

