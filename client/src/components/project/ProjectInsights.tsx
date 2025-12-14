import { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, DollarSign, Activity, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils';
import { 
  calculateProjectHealth, 
  detectProjectRisks, 
  predictCompletionDate,
  calculateBudgetBurnRate 
} from '../../lib/projectInsights';
import { motion } from 'framer-motion';

interface ProjectData {
  id: number;
  title: string;
  status: string;
  progress: number;
  budget?: number;
  actualHours?: number;
  estimatedHours?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  milestones?: any[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ProjectInsightsProps {
  project: ProjectData;
}

const ProjectInsights = ({ project }: ProjectInsightsProps) => {
  // Calculate all insights
  const healthScore = useMemo(() => calculateProjectHealth(project), [project]);
  const risks = useMemo(() => detectProjectRisks(project), [project]);
  const prediction = useMemo(() => predictCompletionDate(project), [project]);
  const budgetBurn = useMemo(() => calculateBudgetBurnRate(project), [project]);

  // Get health color
  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (score >= 75) return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    if (score >= 40) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  // Get risk severity color
  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Health Score Card */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Project Health Score
          </CardTitle>
          <CardDescription className="text-gray-400">
            AI-powered analysis of project status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Overall Score */}
            <div className="md:col-span-2 flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className={cn(
                "text-6xl font-bold mb-2",
                getHealthColor(healthScore.overall).split(' ')[0]
              )}>
                {healthScore.overall}
              </div>
              <div className="text-2xl font-semibold text-gray-400 mb-1">
                Grade: {healthScore.grade}
              </div>
              <Badge className={getHealthColor(healthScore.overall)}>
                {healthScore.status.toUpperCase()}
              </Badge>
            </div>

            {/* Individual Scores */}
            <div className="md:col-span-3 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-400">Timeline</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{healthScore.timeline}</div>
                <Progress value={healthScore.timeline} className="h-2" />
              </div>

              <div className="p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-400">Budget</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{healthScore.budget}</div>
                <Progress value={healthScore.budget} className="h-2" />
              </div>

              <div className="p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-gray-400">Progress</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{healthScore.progress}</div>
                <Progress value={healthScore.progress} className="h-2" />
              </div>

              <div className="p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-orange-400" />
                  <span className="text-sm text-gray-400">Activity</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{healthScore.activity}</div>
                <Progress value={healthScore.activity} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictions & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completion Prediction */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              Completion Prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <div className="text-sm text-gray-400 mb-1">Estimated Completion</div>
                <div className="text-xl font-bold text-white">
                  {prediction.estimatedCompletionDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
              {prediction.onTrack ? (
                <TrendingUp className="h-8 w-8 text-green-400" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-400" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Days Remaining</div>
                <div className="text-lg font-bold text-white">{prediction.daysRemaining}</div>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Velocity</div>
                <div className="text-lg font-bold text-white">
                  {prediction.velocityScore.toFixed(2)}%/day
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={prediction.onTrack
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-red-500/20 text-red-400 border-red-500/30'
              }>
                {prediction.onTrack ? 'On Track' : 'Behind Schedule'}
              </Badge>
              <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                {prediction.confidenceLevel} confidence
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Budget Burn Rate */}
        {project.budget && project.estimatedHours && (
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                Budget Burn Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Current Burn Rate</div>
                  <div className="text-xl font-bold text-white">
                    {budgetBurn.currentBurnRate.toFixed(1)}%
                  </div>
                </div>
                {budgetBurn.isOverBudget ? (
                  <AlertTriangle className="h-8 w-8 text-orange-400" />
                ) : (
                  <TrendingUp className="h-8 w-8 text-green-400" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-800/30 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Projected Total</div>
                  <div className="text-lg font-bold text-white">
                    {budgetBurn.projectedTotal.toFixed(0)}h
                  </div>
                </div>
                <div className="p-3 bg-slate-800/30 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Budget Left</div>
                  <div className="text-lg font-bold text-white">
                    {budgetBurn.daysUntilBudgetExhausted} days
                  </div>
                </div>
              </div>

              <Badge className={budgetBurn.isOverBudget
                ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                : 'bg-green-500/20 text-green-400 border-green-500/30'
              }>
                {budgetBurn.isOverBudget ? 'Over Budget Risk' : 'Within Budget'}
              </Badge>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Risk Alerts */}
      {risks.length > 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              Risk Alerts
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 ml-2">
                {risks.length}
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Potential issues requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {risks.map((risk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={cn(
                      "h-5 w-5 mt-0.5",
                      risk.severity === 'critical' && "text-red-400",
                      risk.severity === 'high' && "text-orange-400",
                      risk.severity === 'medium' && "text-yellow-400",
                      risk.severity === 'low' && "text-blue-400"
                    )} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{risk.title}</h4>
                        <Badge className={getRiskColor(risk.severity)}>
                          {risk.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{risk.description}</p>
                      <div className="flex items-start gap-2 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                        <Zap className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-300">{risk.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectInsights;

