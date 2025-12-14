/**
 * Project Insights & Analytics Utilities
 * Calculates health scores, predictions, and risk assessments
 */

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
}

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
  milestones?: Milestone[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ProjectHealthScore {
  overall: number; // 0-100
  timeline: number; // 0-100
  budget: number; // 0-100
  progress: number; // 0-100
  activity: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
}

interface ProjectRisk {
  type: 'timeline' | 'budget' | 'activity' | 'milestone';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string;
}

interface ProjectPrediction {
  estimatedCompletionDate: Date;
  daysRemaining: number;
  onTrack: boolean;
  velocityScore: number; // Progress per day
  confidenceLevel: 'high' | 'medium' | 'low';
}

/**
 * Calculate project health score (0-100)
 */
export const calculateProjectHealth = (project: ProjectData): ProjectHealthScore => {
  // Timeline Health (0-100)
  const timelineHealth = calculateTimelineHealth(project);
  
  // Budget Health (0-100)
  const budgetHealth = calculateBudgetHealth(project);
  
  // Progress Health (0-100)
  const progressHealth = project.progress;
  
  // Activity Health (0-100)
  const activityHealth = calculateActivityHealth(project);
  
  // Overall weighted average
  const overall = Math.round(
    (timelineHealth * 0.3) +
    (budgetHealth * 0.25) +
    (progressHealth * 0.25) +
    (activityHealth * 0.2)
  );

  return {
    overall,
    timeline: timelineHealth,
    budget: budgetHealth,
    progress: progressHealth,
    activity: activityHealth,
    grade: getHealthGrade(overall),
    status: getHealthStatus(overall),
  };
};

/**
 * Calculate timeline health based on milestones and deadlines
 */
const calculateTimelineHealth = (project: ProjectData): number => {
  if (!project.milestones || project.milestones.length === 0) {
    return 70; // Neutral score if no milestones
  }

  const now = new Date();
  let score = 100;
  
  // Check milestone completion rate
  const completedMilestones = project.milestones.filter(m => m.completed).length;
  const completionRate = (completedMilestones / project.milestones.length) * 100;
  
  // Check for overdue milestones
  const overdueMilestones = project.milestones.filter(m => {
    if (m.completed) return false;
    return new Date(m.dueDate) < now;
  });
  
  // Deduct points for overdue milestones
  score -= overdueMilestones.length * 15;
  
  // Check milestones due soon (within 7 days)
  const upcomingMilestones = project.milestones.filter(m => {
    if (m.completed) return false;
    const dueDate = new Date(m.dueDate);
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue > 0 && daysUntilDue <= 7;
  });
  
  // Slight deduction for upcoming milestones (pressure indicator)
  score -= upcomingMilestones.length * 5;
  
  // Bonus for high completion rate
  if (completionRate > 80) score += 10;
  
  return Math.max(0, Math.min(100, score));
};

/**
 * Calculate budget health
 */
const calculateBudgetHealth = (project: ProjectData): number => {
  if (!project.budget || !project.actualHours || !project.estimatedHours) {
    return 80; // Neutral score if no budget data
  }

  const budgetUsageRate = (project.actualHours / project.estimatedHours) * 100;
  const progressRate = project.progress;
  
  // Ideal: budget usage should match progress
  const variance = Math.abs(budgetUsageRate - progressRate);
  
  let score = 100;
  
  // Deduct points based on variance
  if (budgetUsageRate > progressRate) {
    // Over budget for current progress
    score -= variance * 0.8;
  } else {
    // Under budget (good, but might indicate slow progress)
    score -= variance * 0.3;
  }
  
  // Critical if over 100% budget
  if (budgetUsageRate > 100) {
    score = Math.min(score, 40);
  }
  
  return Math.max(0, Math.min(100, score));
};

/**
 * Calculate activity health based on last update
 */
const calculateActivityHealth = (project: ProjectData): number => {
  const now = new Date();
  const lastUpdate = new Date(project.updatedAt);
  const daysSinceUpdate = Math.ceil((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
  
  let score = 100;
  
  if (daysSinceUpdate > 30) score = 20;
  else if (daysSinceUpdate > 14) score = 50;
  else if (daysSinceUpdate > 7) score = 70;
  else if (daysSinceUpdate > 3) score = 85;
  
  return score;
};

/**
 * Get health grade (A-F)
 */
const getHealthGrade = (score: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

/**
 * Get health status
 */
const getHealthStatus = (score: number): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' => {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'fair';
  if (score >= 40) return 'poor';
  return 'critical';
};

/**
 * Detect project risks
 */
export const detectProjectRisks = (project: ProjectData): ProjectRisk[] => {
  const risks: ProjectRisk[] = [];
  const now = new Date();

  // Timeline risks
  if (project.milestones && project.milestones.length > 0) {
    const overdueMilestones = project.milestones.filter(m => {
      if (m.completed) return false;
      return new Date(m.dueDate) < now;
    });

    if (overdueMilestones.length > 0) {
      risks.push({
        type: 'milestone',
        severity: overdueMilestones.length > 2 ? 'critical' : 'high',
        title: `${overdueMilestones.length} Overdue Milestone${overdueMilestones.length > 1 ? 's' : ''}`,
        description: `${overdueMilestones.map(m => m.title).join(', ')} ${overdueMilestones.length > 1 ? 'are' : 'is'} past due date`,
        recommendation: 'Review and update milestone deadlines or accelerate progress',
      });
    }
  }

  // Budget risks
  if (project.budget && project.actualHours && project.estimatedHours) {
    const budgetUsageRate = (project.actualHours / project.estimatedHours) * 100;

    if (budgetUsageRate > 90 && project.progress < 90) {
      risks.push({
        type: 'budget',
        severity: budgetUsageRate > 100 ? 'critical' : 'high',
        title: 'Budget Overrun Risk',
        description: `${Math.round(budgetUsageRate)}% of budget used with ${Math.round(project.progress)}% progress`,
        recommendation: 'Review resource allocation and consider budget adjustment',
      });
    }
  }

  // Activity risks
  const lastUpdate = new Date(project.updatedAt);
  const daysSinceUpdate = Math.ceil((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceUpdate > 14 && project.status === 'in_progress') {
    risks.push({
      type: 'activity',
      severity: daysSinceUpdate > 30 ? 'high' : 'medium',
      title: 'Low Activity Detected',
      description: `No updates in ${daysSinceUpdate} days`,
      recommendation: 'Check project status and team availability',
    });
  }

  // Timeline risks
  if (project.endDate) {
    const endDate = new Date(project.endDate);
    const daysUntilDeadline = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDeadline < 7 && project.progress < 90) {
      risks.push({
        type: 'timeline',
        severity: 'critical',
        title: 'Deadline Approaching',
        description: `Only ${daysUntilDeadline} days remaining with ${Math.round(project.progress)}% completion`,
        recommendation: 'Prioritize critical tasks and consider deadline extension',
      });
    }
  }

  return risks;
};

/**
 * Predict project completion date
 */
export const predictCompletionDate = (project: ProjectData): ProjectPrediction => {
  const now = new Date();
  const startDate = project.startDate ? new Date(project.startDate) : new Date(project.createdAt);

  // Calculate days elapsed
  const daysElapsed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate velocity (progress per day)
  const velocity = daysElapsed > 0 ? project.progress / daysElapsed : 0;

  // Calculate remaining progress
  const remainingProgress = 100 - project.progress;

  // Predict days remaining
  const predictedDaysRemaining = velocity > 0 ? Math.ceil(remainingProgress / velocity) : 999;

  // Calculate estimated completion date
  const estimatedCompletionDate = new Date(now);
  estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + predictedDaysRemaining);

  // Check if on track
  let onTrack = true;
  let confidenceLevel: 'high' | 'medium' | 'low' = 'high';

  if (project.endDate) {
    const plannedEndDate = new Date(project.endDate);
    onTrack = estimatedCompletionDate <= plannedEndDate;

    // Confidence based on data quality
    if (daysElapsed < 7) confidenceLevel = 'low';
    else if (daysElapsed < 14) confidenceLevel = 'medium';
  } else {
    confidenceLevel = 'medium';
  }

  return {
    estimatedCompletionDate,
    daysRemaining: predictedDaysRemaining,
    onTrack,
    velocityScore: velocity,
    confidenceLevel,
  };
};

/**
 * Calculate budget burn rate
 */
export const calculateBudgetBurnRate = (project: ProjectData): {
  currentBurnRate: number;
  projectedTotal: number;
  isOverBudget: boolean;
  daysUntilBudgetExhausted: number;
} => {
  if (!project.budget || !project.actualHours || !project.estimatedHours) {
    return {
      currentBurnRate: 0,
      projectedTotal: 0,
      isOverBudget: false,
      daysUntilBudgetExhausted: 999,
    };
  }

  const budgetUsageRate = (project.actualHours / project.estimatedHours) * 100;
  const currentBurnRate = budgetUsageRate / (project.progress || 1);
  const projectedTotal = (currentBurnRate * 100 * project.estimatedHours) / 100;
  const isOverBudget = projectedTotal > project.estimatedHours;

  // Calculate days until budget exhausted
  const now = new Date();
  const startDate = project.startDate ? new Date(project.startDate) : new Date(project.createdAt);
  const daysElapsed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const hoursPerDay = daysElapsed > 0 ? project.actualHours / daysElapsed : 0;
  const remainingHours = project.estimatedHours - project.actualHours;
  const daysUntilBudgetExhausted = hoursPerDay > 0 ? Math.ceil(remainingHours / hoursPerDay) : 999;

  return {
    currentBurnRate,
    projectedTotal,
    isOverBudget,
    daysUntilBudgetExhausted,
  };
};

