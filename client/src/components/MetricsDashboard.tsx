import { Code, GitCommit, Calendar, Award } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { AnimatedCounter } from './animations/AnimatedCounter';
import { FadeIn } from './animations/FadeIn';

interface Metric {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  color: string;
}

const metrics: Metric[] = [
  {
    icon: <Code className="h-8 w-8" />,
    value: 50,
    suffix: '+',
    label: 'Projects Completed',
    color: 'text-blue-400',
  },
  {
    icon: <GitCommit className="h-8 w-8" />,
    value: 5000,
    suffix: '+',
    label: 'GitHub Commits',
    color: 'text-purple-400',
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    value: 5,
    suffix: '+',
    label: 'Years Experience',
    color: 'text-pink-400',
  },
  {
    icon: <Award className="h-8 w-8" />,
    value: 100,
    suffix: '%',
    label: 'Client Satisfaction',
    color: 'text-green-400',
  },
];

export function MetricsDashboard() {
  return (
    <section className="py-20 bg-slate-900/30">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Proven Track Record
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Numbers that speak for themselves - delivering excellence in every project
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <FadeIn key={metric.label} delay={index * 0.1} direction="up">
              <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center mb-4 ${metric.color}`}>
                    {metric.icon}
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    <AnimatedCounter
                      end={metric.value}
                      suffix={metric.suffix}
                      prefix={metric.prefix}
                      duration={2.5}
                    />
                  </div>
                  <p className="text-gray-400 text-sm">{metric.label}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

