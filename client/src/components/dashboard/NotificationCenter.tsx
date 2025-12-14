import { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, X, Clock, AlertCircle, MessageSquare, FileText, FolderKanban, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationCenterProps {
  className?: string;
}

const NotificationCenter = ({ className }: NotificationCenterProps) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const { permission, showNotificationWithAction } = useNotifications();
  const previousNotificationCount = useRef<number>(0);

  // Fetch notifications
  const { data: notificationsData, isLoading } = trpc.clientPortal.getNotifications.useQuery({
    limit: 50,
    offset: 0,
    unreadOnly: filter === 'unread',
  });

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.unreadCount || 0;

  // Mark as read mutation
  const markAsReadMutation = trpc.clientPortal.markNotificationAsRead.useMutation({
    onSuccess: () => {
      utils.clientPortal.getNotifications.invalidate();
      utils.clientPortal.getDashboardStats.invalidate();
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = trpc.clientPortal.markAllNotificationsAsRead.useMutation({
    onSuccess: () => {
      utils.clientPortal.getNotifications.invalidate();
      utils.clientPortal.getDashboardStats.invalidate();
      toast.success('All notifications marked as read');
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = trpc.clientPortal.deleteNotification.useMutation({
    onSuccess: () => {
      utils.clientPortal.getNotifications.invalidate();
      utils.clientPortal.getDashboardStats.invalidate();
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'invoice':
        return <FileText className="h-4 w-4" />;
      case 'project_update':
        return <FolderKanban className="h-4 w-4" />;
      case 'ticket':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'low':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    if (!notification.read) {
      markAsReadMutation.mutate({ notificationId: notification.id });
    }

    // Navigate if there's a link
    if (notification.link) {
      setOpen(false);
      setLocation(notification.link);
    } else if (notification.actionUrl) {
      setOpen(false);
      setLocation(notification.actionUrl);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  // Show desktop notification for new notifications
  useEffect(() => {
    if (permission === 'granted' && notifications.length > 0) {
      // Check if there are new notifications
      if (previousNotificationCount.current > 0 && notifications.length > previousNotificationCount.current) {
        // Get the newest notification (first in the list)
        const newestNotification = notifications[0];

        // Show desktop notification
        showNotificationWithAction(
          {
            title: newestNotification.title,
            body: newestNotification.message,
            tag: newestNotification.groupKey || `notification-${newestNotification.id}`,
            requireInteraction: newestNotification.priority === 'urgent',
          },
          () => {
            // On click, navigate to the notification link
            if (newestNotification.link || newestNotification.actionUrl) {
              window.focus();
              setLocation(newestNotification.link || newestNotification.actionUrl);
            }
          }
        );
      }

      // Update the previous count
      previousNotificationCount.current = notifications.length;
    }
  }, [notifications, permission, showNotificationWithAction, setLocation]);

  // Group notifications by groupKey
  const groupedNotifications = notifications.reduce((acc: any, notification: any) => {
    const key = notification.groupKey || notification.id.toString();
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(notification);
    return acc;
  }, {});

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative text-gray-400 hover:text-white hover:bg-slate-800", className)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 bg-slate-900 border-slate-800" align="end">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')} className="w-full">
          <TabsList className="w-full bg-slate-800/50 border-b border-slate-800 rounded-none">
            <TabsTrigger value="unread" className="flex-1">
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="m-0">
            <ScrollArea className="h-[400px]">
              {isLoading ? (
                <div className="p-8 text-center text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-sm">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  <AnimatePresence>
                    {Object.entries(groupedNotifications).map(([groupKey, groupNotifications]: [string, any]) => {
                      const notification = groupNotifications[0];
                      const count = groupNotifications.length;

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className={cn(
                            "p-4 hover:bg-slate-800/50 cursor-pointer transition-colors relative",
                            !notification.read && "bg-slate-800/30"
                          )}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "p-2 rounded-lg border flex-shrink-0",
                              getPriorityColor(notification.priority)
                            )}>
                              {getNotificationIcon(notification.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className={cn(
                                  "text-sm font-medium",
                                  notification.read ? "text-gray-400" : "text-white"
                                )}>
                                  {notification.title}
                                  {count > 1 && (
                                    <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/30">
                                      {count}
                                    </Badge>
                                  )}
                                </h4>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-gray-500 hover:text-red-400 flex-shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotificationMutation.mutate({ notificationId: notification.id });
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>

                              <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                                {notification.message}
                              </p>

                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                                {notification.actionLabel && (
                                  <span className="text-blue-400 font-medium">
                                    {notification.actionLabel}
                                  </span>
                                )}
                              </div>
                            </div>

                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;

