import { useState, useEffect, useCallback } from 'react';
import { 
  notificationService, 
  NotificationPermission,
  BrowserNotificationOptions 
} from '../lib/notifications';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(notificationService.isSupported());
    setPermission(notificationService.getPermission());
  }, []);

  const requestPermission = useCallback(async () => {
    const newPermission = await notificationService.requestPermission();
    setPermission(newPermission);
    return newPermission;
  }, []);

  const showNotification = useCallback(
    async (options: BrowserNotificationOptions) => {
      return await notificationService.show(options);
    },
    []
  );

  const showNotificationWithAction = useCallback(
    async (
      options: BrowserNotificationOptions,
      onClick?: (event: Event) => void,
      onClose?: (event: Event) => void
    ) => {
      return await notificationService.showWithAction(options, onClick, onClose);
    },
    []
  );

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    showNotificationWithAction,
  };
};

