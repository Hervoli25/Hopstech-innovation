import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { FadeIn } from './animations/FadeIn';
import { Activity, GitCommit, Clock, TrendingUp, CheckCircle2, Code } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActivityItem {
  id: number;
  type: 'commit' | 'deploy' | 'test' | 'build';
  message: string;
  timestamp: string;
  status: 'success' | 'in-progress' | 'pending';
}

const mockActivities: ActivityItem[] = [
  { id: 1, type: 'commit', message: 'feat: Add Phase 2.5 tech constellation', timestamp: '2 min ago', status: 'success' },
  { id: 2, type: 'deploy', message: 'Deployed to production', timestamp: '15 min ago', status: 'success' },
  { id: 3, type: 'test', message: 'All tests passing (127/127)', timestamp: '18 min ago', status: 'success' },
  { id: 4, type: 'build', message: 'Build completed successfully', timestamp: '20 min ago', status: 'success' },
  { id: 5, type: 'commit', message: 'fix: Update responsive layout', timestamp: '1 hour ago', status: 'success' },
];

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'commit': return <GitCommit className="h-4 w-4" />;
    case 'deploy': return <TrendingUp className="h-4 w-4" />;
    case 'test': return <CheckCircle2 className="h-4 w-4" />;
    case 'build': return <Code className="h-4 w-4" />;
  }
};

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'commit': return 'text-blue-400 bg-blue-500/10';
    case 'deploy': return 'text-green-400 bg-green-500/10';
    case 'test': return 'text-purple-400 bg-purple-500/10';
    case 'build': return 'text-amber-400 bg-amber-500/10';
  }
};

export function RealTimeTransparency() {
  const [activities, setActivities] = useState(mockActivities);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: 'Uptime', value: '99.9%', icon: <Activity className="h-5 w-5" />, color: 'text-green-400' },
    { label: 'Response Time', value: '< 100ms', icon: <Clock className="h-5 w-5" />, color: 'text-blue-400' },
    { label: 'Commits Today', value: '12', icon: <GitCommit className="h-5 w-5" />, color: 'text-purple-400' },
    { label: 'Active Projects', value: '3', icon: <Code className="h-5 w-5" />, color: 'text-amber-400' },
  ];

  return (
    <section className="py-20 bg-slate-900/30">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="h-8 w-8 text-green-400 animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Real-Time Transparency
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Live updates from my development workflow
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {currentTime.toLocaleTimeString()}
          </p>
        </FadeIn>

        <div className="max-w-6xl mx-auto">
          {/* Stats Grid */}
          <FadeIn delay={0.2} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className={`${stat.color} mb-2 flex justify-center`}>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </FadeIn>

          {/* Activity Feed */}
          <FadeIn delay={0.4}>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.message}</p>
                        <p className="text-sm text-gray-400 mt-1">{activity.timestamp}</p>
                      </div>
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                        {activity.status}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

