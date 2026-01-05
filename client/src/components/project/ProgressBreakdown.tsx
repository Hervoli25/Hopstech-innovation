import { useMemo } from 'react';
import { TrendingUp, Target, CheckCircle2, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { trpc } from '../../lib/trpc';
import { Skeleton } from '../ui/skeleton';

interface ProgressBreakdownProps {
  projectId: number;
}

const ProgressBreakdown = ({ projectId }: ProgressBreakdownProps) => {
  const { data: breakdown, isLoading } = trpc.clientPortal.getProgressBreakdown.useQuery({ projectId });

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getMethodBadge = (method?: string) => {
    const colors: Record<string, string> = {
      milestone: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      phase: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      deliverable: 'bg-green-500/20 text-green-400 border-green-500/30',
      hybrid: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      manual: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[method || 'manual'] || colors.manual;
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <Skeleton className="h-6 w-48 bg-slate-800" />
          <Skeleton className="h-4 w-64 bg-slate-800 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 bg-slate-800" />
          <Skeleton className="h-24 bg-slate-800" />
          <Skeleton className="h-24 bg-slate-800" />
        </CardContent>
      </Card>
    );
  }

  if (!breakdown) {
    return null;
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Progress Breakdown
            </CardTitle>
            <CardDescription className="text-gray-400">
              Detailed progress tracking across all project components
            </CardDescription>
          </div>
          <Badge className={getMethodBadge(breakdown.calculationMethod)}>
            {breakdown.calculationMethod || 'manual'} tracking
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              <h3 className="text-white font-medium">Overall Progress</h3>
            </div>
            <span className="text-2xl font-bold text-white">{breakdown.overall}%</span>
          </div>
          <Progress value={breakdown.overall} className="h-3" indicatorClassName={getProgressColor(breakdown.overall)} />
          {breakdown.lastUpdate && (
            <p className="text-xs text-gray-500 mt-2">
              Last updated: {new Date(breakdown.lastUpdate).toLocaleString()}
            </p>
          )}
        </div>

        {/* Milestones Progress */}
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <h3 className="text-white font-medium">Milestones</h3>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">{breakdown.milestones.progress}%</div>
              <div className="text-xs text-gray-500">
                {breakdown.milestones.completed} / {breakdown.milestones.total} completed
              </div>
            </div>
          </div>
          <Progress
            value={breakdown.milestones.progress}
            className="h-2"
            indicatorClassName={getProgressColor(breakdown.milestones.progress)}
          />
        </div>

        {/* Deliverables Progress */}
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              <h3 className="text-white font-medium">Deliverables</h3>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">{breakdown.deliverables.progress}%</div>
              <div className="text-xs text-gray-500">
                {breakdown.deliverables.completed} / {breakdown.deliverables.total} completed
              </div>
            </div>
          </div>
          <Progress
            value={breakdown.deliverables.progress}
            className="h-2"
            indicatorClassName={getProgressColor(breakdown.deliverables.progress)}
          />
        </div>

        {/* Phases Progress */}
        {breakdown.phases.items.length > 0 && (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-orange-400" />
                <h3 className="text-white font-medium">Project Phases</h3>
              </div>
              <div className="text-lg font-bold text-white">{breakdown.phases.progress}%</div>
            </div>
            <div className="space-y-3 mt-4">
              {breakdown.phases.items.map((phase) => (
                <div key={phase.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-white">{phase.name}</span>
                      <Badge
                        className={
                          phase.status === 'completed'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : phase.status === 'in_progress'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }
                      >
                        {phase.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">Weight: {phase.weight}%</span>
                      <span className="text-white font-medium">{phase.progress}%</span>
                    </div>
                  </div>
                  <Progress
                    value={phase.progress}
                    className="h-1.5"
                    indicatorClassName={getProgressColor(phase.progress)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressBreakdown;
