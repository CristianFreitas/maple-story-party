'use client';

import { useEffect, useState } from 'react';
import { usePlayerSession } from './usePlayerSession';
import { 
  notificationManager, 
  requestNotificationPermission,
  scheduleBuffNotifications,
  showPartyInviteNotification 
} from '@/utils/notifications';

export function useNotifications() {
  const { profile } = usePlayerSession();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(notificationManager.isSupported());
    setPermission(notificationManager.getPermission());
  }, []);

  const requestPermission = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    return result;
  };

  // Auto-request permission when user creates a profile
  useEffect(() => {
    if (profile && permission === 'default') {
      // Show a friendly prompt instead of immediately requesting
      const shouldRequest = window.confirm(
        '🔔 Would you like to enable notifications for party invites, chat messages, and buff reminders?'
      );
      
      if (shouldRequest) {
        requestPermission();
      }
    }
  }, [profile, permission]);

  // Schedule buff notifications
  const scheduleBuffReminder = (buffSchedule: {
    id: string;
    playerName: string;
    buffType: string;
    scheduledTime: number;
  }) => {
    if (permission === 'granted') {
      scheduleBuffNotifications(buffSchedule);
    }
  };

  // Show party invite notification
  const notifyPartyInvite = (hostName: string, bossName: string, partyId: string) => {
    if (permission === 'granted') {
      return showPartyInviteNotification(hostName, bossName, partyId);
    }
    return Promise.resolve(false);
  };

  // Show reputation change notification
  const notifyReputationChange = (change: number, newReputation: number) => {
    if (permission === 'granted') {
      return notificationManager.notifyReputationChange(change, newReputation);
    }
    return Promise.resolve(false);
  };

  // Show party update notification
  const notifyPartyUpdate = (action: string, partyName: string, details: string) => {
    if (permission === 'granted') {
      return notificationManager.notifyPartyUpdate(action, partyName, details);
    }
    return Promise.resolve(false);
  };

  return {
    isSupported,
    permission,
    requestPermission,
    scheduleBuffReminder,
    notifyPartyInvite,
    notifyReputationChange,
    notifyPartyUpdate,
  };
}
