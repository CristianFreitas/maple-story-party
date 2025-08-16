'use client';

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

class NotificationManager {
  private permission: NotificationPermission = 'default';
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.permission = Notification.permission;
      this.initializeServiceWorker();
    }
  }

  private async initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('🔔 Service Worker registered for notifications');
      } catch (error) {
        console.error('🔔 Service Worker registration failed:', error);
      }
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('🔔 This browser does not support notifications');
      return 'denied';
    }

    if (this.permission === 'default') {
      this.permission = await Notification.requestPermission();
    }

    return this.permission;
  }

  async showNotification(options: NotificationOptions): Promise<boolean> {
    const permission = await this.requestPermission();
    
    if (permission !== 'granted') {
      console.warn('🔔 Notification permission denied');
      return false;
    }

    try {
      if (this.serviceWorkerRegistration) {
        // Use Service Worker for better control
        await this.serviceWorkerRegistration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/maple-leaf.png',
          badge: options.badge || '/icons/badge.png',
          tag: options.tag,
          data: options.data,
          actions: options.actions,
          requireInteraction: false,
          silent: false,
        });
      } else {
        // Fallback to regular notification
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/maple-leaf.png',
          tag: options.tag,
          data: options.data,
        });
      }

      return true;
    } catch (error) {
      console.error('🔔 Error showing notification:', error);
      return false;
    }
  }

  // Specific notification types for MapleStory Party Finder
  async notifyNewMessage(playerName: string, message: string, partyName: string) {
    return this.showNotification({
      title: `💬 ${playerName}`,
      body: message.length > 50 ? `${message.substring(0, 50)}...` : message,
      icon: '/icons/chat.png',
      tag: 'chat-message',
      data: { type: 'chat', playerName, partyName },
      actions: [
        { action: 'reply', title: '💬 Reply' },
        { action: 'view', title: '👀 View Chat' }
      ]
    });
  }

  async notifyPartyInvite(hostName: string, bossName: string, partyId: string) {
    return this.showNotification({
      title: '🎉 Party Invite!',
      body: `${hostName} invited you to fight ${bossName}`,
      icon: '/icons/party-invite.png',
      tag: 'party-invite',
      data: { type: 'party-invite', hostName, bossName, partyId },
      actions: [
        { action: 'accept', title: '✅ Join Party' },
        { action: 'decline', title: '❌ Decline' }
      ]
    });
  }

  async notifyPartyUpdate(action: string, partyName: string, details: string) {
    const actionEmojis = {
      joined: '👥',
      left: '👋',
      started: '⚔️',
      cancelled: '❌',
      updated: '📝'
    };

    return this.showNotification({
      title: `${actionEmojis[action as keyof typeof actionEmojis] || '🔔'} Party Update`,
      body: `${partyName}: ${details}`,
      icon: '/icons/party-update.png',
      tag: 'party-update',
      data: { type: 'party-update', action, partyName }
    });
  }

  async notifyBuffSchedule(playerName: string, buffType: string, timeUntil: string) {
    const buffEmojis = {
      exp: '🎯',
      drop: '💰',
      burning: '🔥',
      other: '⭐'
    };

    return this.showNotification({
      title: `${buffEmojis[buffType as keyof typeof buffEmojis]} Buff Starting Soon!`,
      body: `${playerName}'s ${buffType} buff starts in ${timeUntil}`,
      icon: '/icons/buff.png',
      tag: 'buff-schedule',
      data: { type: 'buff-schedule', playerName, buffType },
      actions: [
        { action: 'calendar', title: '📅 Add to Calendar' },
        { action: 'dismiss', title: '🔕 Dismiss' }
      ]
    });
  }

  async notifyReputationChange(change: number, newReputation: number) {
    const isPositive = change > 0;
    
    return this.showNotification({
      title: `${isPositive ? '📈' : '📉'} Reputation ${isPositive ? 'Increased' : 'Decreased'}`,
      body: `Your reputation ${isPositive ? 'increased' : 'decreased'} by ${Math.abs(change)}. Current: ${newReputation}`,
      icon: '/icons/reputation.png',
      tag: 'reputation-change',
      data: { type: 'reputation', change, newReputation }
    });
  }

  // Schedule notifications for buff reminders
  scheduleBuffReminder(buffSchedule: {
    id: string;
    playerName: string;
    buffType: string;
    scheduledTime: number;
  }) {
    const now = Date.now();
    const timeUntilBuff = buffSchedule.scheduledTime - now;

    // Schedule notifications at different intervals
    const reminderTimes = [
      { minutes: 30, label: '30 minutes' },
      { minutes: 10, label: '10 minutes' },
      { minutes: 5, label: '5 minutes' },
      { minutes: 1, label: '1 minute' }
    ];

    reminderTimes.forEach(({ minutes, label }) => {
      const reminderTime = timeUntilBuff - (minutes * 60 * 1000);
      
      if (reminderTime > 0) {
        setTimeout(() => {
          this.notifyBuffSchedule(buffSchedule.playerName, buffSchedule.buffType, label);
        }, reminderTime);
      }
    });
  }

  // Clear notifications by tag
  async clearNotifications(tag: string) {
    if (this.serviceWorkerRegistration) {
      const notifications = await this.serviceWorkerRegistration.getNotifications({ tag });
      notifications.forEach(notification => notification.close());
    }
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  // Get current permission status
  getPermission(): NotificationPermission {
    return this.permission;
  }
}

// Export singleton instance
export const notificationManager = new NotificationManager();

// Utility functions
export const showChatNotification = (playerName: string, message: string, partyName: string) => {
  return notificationManager.notifyNewMessage(playerName, message, partyName);
};

export const showPartyInviteNotification = (hostName: string, bossName: string, partyId: string) => {
  return notificationManager.notifyPartyInvite(hostName, bossName, partyId);
};

export const showBuffReminderNotification = (playerName: string, buffType: string, timeUntil: string) => {
  return notificationManager.notifyBuffSchedule(playerName, buffType, timeUntil);
};

export const requestNotificationPermission = () => {
  return notificationManager.requestPermission();
};

export const scheduleBuffNotifications = (buffSchedule: {
  id: string;
  playerName: string;
  buffType: string;
  scheduledTime: number;
}) => {
  return notificationManager.scheduleBuffReminder(buffSchedule);
};
