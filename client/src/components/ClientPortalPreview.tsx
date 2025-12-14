import { Link } from 'wouter';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FadeIn } from './animations/FadeIn';
import { Lock, Mail, BarChart3, MessageSquare, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function ClientPortalPreview() {
  const features = [
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'Secure Access',
      description: 'Magic link authentication - no passwords needed',
      color: 'text-blue-400 bg-blue-500/10',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Project Dashboard',
      description: 'Track progress, milestones, and deliverables',
      color: 'text-green-400 bg-green-500/10',
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: 'Direct Communication',
      description: 'Real-time updates and messaging',
      color: 'text-purple-400 bg-purple-500/10',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Document Sharing',
      description: 'Access proposals, contracts, and reports',
      color: 'text-amber-400 bg-amber-500/10',
    },
  ];

  return (
    <section className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-12">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/30">
            For Clients
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your Personal Client Portal
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Collaborate seamlessly with a dedicated dashboard for your projects
          </p>
        </FadeIn>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Preview Image/Mockup */}
            <FadeIn delay={0.2}>
              <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30 overflow-hidden">
                <CardContent className="p-8">
                  <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                    {/* Mock Dashboard */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <span className="text-blue-400 font-semibold">JD</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">John Doe</p>
                          <p className="text-xs text-gray-400">john@example.com</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                        Active
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-slate-800 rounded p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white text-sm font-medium">E-Commerce Platform</p>
                          <span className="text-xs text-blue-400">75%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="bg-blue-500 h-2 rounded-full"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-800 rounded p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white text-sm font-medium">Mobile App Development</p>
                          <span className="text-xs text-green-400">40%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '40%' }}
                            transition={{ duration: 1, delay: 0.7 }}
                            className="bg-green-500 h-2 rounded-full"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <div className="flex-1 bg-slate-800 rounded p-3 text-center">
                          <p className="text-2xl font-bold text-blue-400">2</p>
                          <p className="text-xs text-gray-400">Active Projects</p>
                        </div>
                        <div className="flex-1 bg-slate-800 rounded p-3 text-center">
                          <p className="text-2xl font-bold text-green-400">5</p>
                          <p className="text-xs text-gray-400">Completed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Features List */}
            <FadeIn delay={0.4} className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className={`p-3 rounded-lg ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}

              <Link href="/client-portal">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                  Access Client Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

