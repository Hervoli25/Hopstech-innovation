import { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { celebrateMilestone } from '../../lib/confetti';

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
}

interface ProjectTimelineProps {
  milestones: Milestone[];
  projectStartDate?: Date | string;
  projectEndDate?: Date | string;
  onMilestoneClick?: (milestone: Milestone) => void;
  onMilestoneComplete?: (milestoneId: string) => void;
}

const ProjectTimeline = ({
  milestones,
  projectStartDate,
  projectEndDate,
  onMilestoneClick,
  onMilestoneComplete
}: ProjectTimelineProps) => {
  const [viewMode, setViewMode] = useState<'month' | 'quarter' | 'year'>('month');

  const handleMilestoneClick = (milestone: Milestone) => {
    // If milestone is being completed (was not completed before), trigger confetti
    if (!milestone.completed && onMilestoneComplete) {
      celebrateMilestone();
      onMilestoneComplete(milestone.id);
    } else if (onMilestoneClick) {
      onMilestoneClick(milestone);
    }
  };

  // Calculate timeline bounds
  const timelineBounds = useMemo(() => {
    if (milestones.length === 0) {
      const now = new Date();
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 3, 0),
      };
    }

    const dates = milestones.map(m => new Date(m.dueDate));
    const minDate = projectStartDate 
      ? new Date(projectStartDate) 
      : new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = projectEndDate 
      ? new Date(projectEndDate) 
      : new Date(Math.max(...dates.map(d => d.getTime())));

    // Add padding
    const start = new Date(minDate);
    start.setDate(start.getDate() - 7);
    const end = new Date(maxDate);
    end.setDate(end.getDate() + 7);

    return { start, end };
  }, [milestones, projectStartDate, projectEndDate]);

  // Generate timeline grid
  const timelineGrid = useMemo(() => {
    const { start, end } = timelineBounds;
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const months: { name: string; days: number; offset: number }[] = [];
    
    let currentDate = new Date(start);
    let dayOffset = 0;

    while (currentDate <= end) {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const daysInMonth = monthEnd.getDate();
      
      months.push({
        name: currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        days: daysInMonth,
        offset: dayOffset,
      });

      dayOffset += daysInMonth;
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return { months, totalDays };
  }, [timelineBounds]);

  // Calculate milestone position
  const getMilestonePosition = (dueDate: string) => {
    const date = new Date(dueDate);
    const { start } = timelineBounds;
    const daysDiff = Math.ceil((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const percentage = (daysDiff / timelineGrid.totalDays) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  // Get milestone status color
  const getMilestoneColor = (milestone: Milestone) => {
    if (milestone.completed) {
      return 'bg-green-500 border-green-400';
    }
    const dueDate = new Date(milestone.dueDate);
    const now = new Date();
    if (dueDate < now) {
      return 'bg-red-500 border-red-400';
    }
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue <= 7) {
      return 'bg-orange-500 border-orange-400';
    }
    return 'bg-blue-500 border-blue-400';
  };

  // Sort milestones by due date
  const sortedMilestones = useMemo(() => {
    return [...milestones].sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }, [milestones]);

  if (milestones.length === 0) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Calendar className="h-16 w-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Timeline Data</h3>
          <p className="text-gray-400">Add milestones to see the project timeline</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Project Timeline
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {milestones.filter(m => m.completed).length} / {milestones.length} Complete
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline Header - Months */}
        <div className="relative overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Month Headers */}
            <div className="flex border-b border-slate-700 pb-2 mb-4">
              {timelineGrid.months.map((month, idx) => (
                <div
                  key={idx}
                  className="text-xs text-gray-400 font-medium text-center"
                  style={{ width: `${(month.days / timelineGrid.totalDays) * 100}%` }}
                >
                  {month.name}
                </div>
              ))}
            </div>

            {/* Timeline Grid */}
            <div className="relative h-[400px] bg-slate-800/30 rounded-lg p-4">
              {/* Vertical grid lines for weeks */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: Math.ceil(timelineGrid.totalDays / 7) }).map((_, idx) => (
                  <div
                    key={idx}
                    className="border-r border-slate-700/50"
                    style={{ width: `${(7 / timelineGrid.totalDays) * 100}%` }}
                  />
                ))}
              </div>

              {/* Today marker */}
              {(() => {
                const today = new Date();
                const { start } = timelineBounds;
                const daysDiff = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                const todayPosition = (daysDiff / timelineGrid.totalDays) * 100;

                if (todayPosition >= 0 && todayPosition <= 100) {
                  return (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10"
                      style={{ left: `${todayPosition}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-blue-400 font-medium whitespace-nowrap">
                        Today
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Milestones */}
              <div className="relative h-full flex flex-col justify-around py-4">
                {sortedMilestones.map((milestone, idx) => {
                  const position = getMilestonePosition(milestone.dueDate);
                  const color = getMilestoneColor(milestone);

                  return (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative h-12"
                    >
                      {/* Milestone bar */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-slate-700/50 rounded-full" />

                      {/* Milestone marker */}
                      <motion.div
                        className={cn(
                          "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer group",
                          "transition-transform hover:scale-110"
                        )}
                        style={{ left: `${position}%` }}
                        onClick={() => handleMilestoneClick(milestone)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Marker circle */}
                        <div className={cn(
                          "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                          color,
                          "shadow-lg"
                        )}>
                          {milestone.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          ) : (
                            <Circle className="h-4 w-4 text-white" />
                          )}
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                          <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl min-w-[200px]">
                            <div className="text-white font-medium mb-1">{milestone.title}</div>
                            <div className="text-xs text-gray-400 mb-2">{milestone.description}</div>
                            <div className="flex items-center gap-2 text-xs">
                              <Calendar className="h-3 w-3 text-gray-500" />
                              <span className="text-gray-400">
                                {new Date(milestone.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                            {milestone.completed && milestone.completedAt && (
                              <div className="flex items-center gap-2 text-xs mt-1">
                                <CheckCircle2 className="h-3 w-3 text-green-400" />
                                <span className="text-green-400">
                                  Completed {new Date(milestone.completedAt).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                            <div className="border-4 border-transparent border-t-slate-700" />
                          </div>
                        </div>
                      </motion.div>

                      {/* Milestone label */}
                      <div
                        className="absolute top-full mt-1 text-xs text-gray-400 whitespace-nowrap"
                        style={{
                          left: `${position}%`,
                          transform: 'translateX(-50%)',
                        }}
                      >
                        {milestone.title.length > 20
                          ? `${milestone.title.substring(0, 20)}...`
                          : milestone.title
                        }
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 border border-green-400" />
            <span className="text-gray-400">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-400" />
            <span className="text-gray-400">On Track</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500 border border-orange-400" />
            <span className="text-gray-400">Due Soon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-red-400" />
            <span className="text-gray-400">Overdue</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;

