import {
  FolderKanban,
  MessageSquare,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { trpc } from '../../lib/trpc';
import { Link } from 'wouter';
import { Skeleton } from '../ui/skeleton';
import NotificationPermissionPrompt from './NotificationPermissionPrompt';

const DashboardOverview = () => {
  const { data: stats, isLoading: statsLoading } = trpc.clientPortal.getDashboardStats.useQuery();
  const { data: projectsData, isLoading: projectsLoading } = trpc.clientPortal.getProjects.useQuery({ 
    limit: 5, 
    offset: 0 
  });
  const { data: notifications, isLoading: notificationsLoading } = trpc.clientPortal.getNotifications.useQuery({ 
    limit: 5, 
    offset: 0,
    unreadOnly: true 
  });
  const { data: activities, isLoading: activitiesLoading } = trpc.clientPortal.getActivityLog.useQuery({ 
    limit: 10, 
    offset: 0 
  });

  const statCards = [
    {
      title: 'Active Projects',
      value: stats?.projects.active || 0,
      total: stats?.projects.total || 0,
      icon: FolderKanban,
      color: 'blue',
      description: `${stats?.projects.completed || 0} completed`,
      href: '/client-portal/projects',
    },
    {
      title: 'Unread Messages',
      value: stats?.messages.unread || 0,
      icon: MessageSquare,
      color: 'purple',
      description: 'New messages',
      href: '/client-portal/messages',
    },
    {
      title: 'Pending Invoices',
      value: stats?.invoices.pending || 0,
      icon: FileText,
      color: 'green',
      description: `${stats?.invoices.overdue || 0} overdue`,
      href: '/client-portal/invoices',
    },
    {
      title: 'Open Tickets',
      value: stats?.tickets.open || 0,
      icon: AlertCircle,
      color: 'orange',
      description: 'Support tickets',
      href: '/client-portal/support',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (statsLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Notification Permission Prompt */}
      <NotificationPermissionPrompt />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <a>
                <Card className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.value}
                      {stat.total !== undefined && (
                        <span className="text-lg text-gray-500 ml-2">/ {stat.total}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </CardContent>
                </Card>
              </a>
            </Link>
          );
        })}
      </div>

      {/* Recent Projects & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Recent Projects</CardTitle>
              <Link href="/client-portal/projects">
                <a>
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    View All
                  </Button>
                </a>
              </Link>
            </div>
            <CardDescription className="text-gray-400">
              Your active and recent projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : projectsData?.projects && projectsData.projects.length > 0 ? (
              <div className="space-y-3">
                {projectsData.projects.slice(0, 5).map((project) => (
                  <Link key={project.id} href={`/client-portal/projects/${project.id}`}>
                    <a className="block p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{project.title}</h4>
                        <Badge className={getColorClasses(
                          project.status === 'completed' ? 'green' :
                          project.status === 'in_progress' ? 'blue' :
                          project.status === 'on_hold' ? 'orange' : 'purple'
                        )}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {project.progress}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not started'}
                        </span>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FolderKanban className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No projects yet</p>
                <Link href="/client-portal/projects">
                  <a>
                    <Button variant="link" className="text-blue-400 mt-2">
                      Create your first project
                    </Button>
                  </a>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your latest actions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : activities && activities.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/50">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;

