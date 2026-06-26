/**
 * Browser Notification Service
 * Handles Web Notifications API for desktop notifications
 */

import { BRAND_LOGO_SRC } from '@shared/const';

export type NotificationPermission = 'default' | 'granted' | 'denied';

export interface BrowserNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
}

class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Check if browser supports notifications
   */
  public isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Get current notification permission status
   */
  public getPermission(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied';
    }
    return Notification.permission as NotificationPermission;
  }

  /**
   * Request notification permission from user
   */
  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn('Browser does not support notifications');
      return 'denied';
    }

    if (this.getPermission() === 'granted') {
      return 'granted';
    }

    try {
      const permission = await Notification.requestPermission();
      return permission as NotificationPermission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Show a browser notification
   */
  public async show(options: BrowserNotificationOptions): Promise<Notification | null> {
    if (!this.isSupported()) {
      console.warn('Browser does not support notifications');
      return null;
    }

    // Request permission if not already granted
    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || BRAND_LOGO_SRC,
        badge: options.badge || BRAND_LOGO_SRC,
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
      });

      // Auto-close after 5 seconds if not requiring interaction
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  /**
   * Show notification with click handler
   */
  public async showWithAction(
    options: BrowserNotificationOptions,
    onClick?: (event: Event) => void,
    onClose?: (event: Event) => void
  ): Promise<Notification | null> {
    const notification = await this.show(options);

    if (notification) {
      if (onClick) {
        notification.onclick = onClick;
      }
      if (onClose) {
        notification.onclose = onClose;
      }
    }

    return notification;
  }

  /**
   * Close all notifications with a specific tag
   */
  public closeByTag(tag: string): void {
    // Note: This is a limitation of the Web Notifications API
    // We can't programmatically close notifications by tag
    // The tag is used to replace existing notifications with the same tag
    console.log(`Notifications with tag "${tag}" will be replaced on next show`);
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Export helper functions
export const requestNotificationPermission = () => notificationService.requestPermission();
export const showNotification = (options: BrowserNotificationOptions) => notificationService.show(options);
export const isNotificationSupported = () => notificationService.isSupported();
export const getNotificationPermission = () => notificationService.getPermission();

