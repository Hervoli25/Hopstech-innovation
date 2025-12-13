import { Suspense } from 'react';
import { TechConstellationScene } from './3d/TechConstellationScene';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { FadeIn } from './animations/FadeIn';
import { Loader2, Sparkles } from 'lucide-react';

export function TechConstellation() {
  const categories = [
    { name: 'Frontend', color: 'bg-blue-500', count: 4 },
    { name: 'Backend', color: 'bg-green-500', count: 4 },
    { name: 'Database', color: 'bg-amber-500', count: 3 },
    { name: 'DevOps', color: 'bg-red-500', count: 4 },
    { name: 'Tools', color: 'bg-purple-500', count: 3 },
  ];

  return (
    <section className="py-20 bg-slate-900/30">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tech Stack Constellation
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore my technology expertise in an interactive 3D space
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* 3D Constellation */}
          <FadeIn delay={0.2} className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
              <CardContent className="p-0">
                <div className="h-[600px] relative">
                  <Suspense
                    fallback={
                      <div className="h-full flex items-center justify-center bg-slate-900/50">
                        <div className="text-center">
                          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                          <p className="text-gray-400">Loading Tech Constellation...</p>
                        </div>
                      </div>
                    }
                  >
                    <TechConstellationScene />
                  </Suspense>
                </div>
                <div className="p-4 bg-slate-900/50 border-t border-slate-700">
                  <p className="text-sm text-gray-400 text-center">
                    🖱️ Drag to rotate • Scroll to zoom • Hover over nodes for details
                  </p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Legend & Info */}
          <FadeIn delay={0.4} className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Technology Categories</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                        <span className="text-white font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="bg-slate-700 text-gray-300">
                        {category.count} techs
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">How to Read</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• <strong>Size:</strong> Indicates proficiency level</p>
                  <p>• <strong>Color:</strong> Shows technology category</p>
                  <p>• <strong>Lines:</strong> Represent common integrations</p>
                  <p>• <strong>Hover:</strong> View detailed proficiency %</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-400">18</p>
                    <p className="text-xs text-gray-400">Technologies</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">85%</p>
                    <p className="text-xs text-gray-400">Avg Proficiency</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-400">5</p>
                    <p className="text-xs text-gray-400">Categories</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-400">5+</p>
                    <p className="text-xs text-gray-400">Years Exp</p>
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

