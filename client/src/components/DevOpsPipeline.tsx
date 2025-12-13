import { Suspense } from 'react';
import { DevOpsPipelineScene } from './3d/DevOpsPipelineScene';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { FadeIn } from './animations/FadeIn';
import { Loader2 } from 'lucide-react';

export function DevOpsPipeline() {
  return (
    <section className="py-20 bg-slate-900/30">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Interactive DevOps Pipeline
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Visualize the complete CI/CD workflow - from code commit to production deployment
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* 3D Pipeline Visualization */}
          <FadeIn delay={0.2} className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
              <CardContent className="p-0">
                <div className="h-[500px] relative">
                  <Suspense
                    fallback={
                      <div className="h-full flex items-center justify-center bg-slate-900/50">
                        <div className="text-center">
                          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                          <p className="text-gray-400">Loading 3D Pipeline...</p>
                        </div>
                      </div>
                    }
                  >
                    <DevOpsPipelineScene />
                  </Suspense>
                </div>
                <div className="p-4 bg-slate-900/50 border-t border-slate-700">
                  <p className="text-sm text-gray-400 text-center">
                    🖱️ Drag to rotate • Scroll to zoom • Auto-rotating enabled
                  </p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Pipeline Info Panel */}
          <FadeIn delay={0.4} className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Pipeline Stages</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Code Commit', icon: '📝', desc: 'Push to repository' },
                    { name: 'Build', icon: '🔨', desc: 'Compile & package' },
                    { name: 'Test', icon: '🧪', desc: 'Unit & integration tests' },
                    { name: 'Security Scan', icon: '🔒', desc: 'Vulnerability check' },
                    { name: 'Deploy Staging', icon: '🚀', desc: 'Staging environment' },
                    { name: 'Integration Tests', icon: '🔗', desc: 'End-to-end tests' },
                    { name: 'Deploy Production', icon: '✅', desc: 'Live deployment' },
                  ].map((stage, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
                    >
                      <span className="text-2xl">{stage.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{stage.name}</p>
                        <p className="text-xs text-gray-400">{stage.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Status Legend</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-sm text-gray-300">Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-sm text-gray-300">Running</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-300">Success</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-gray-300">Failed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

