'use client';

import { useState, useEffect } from 'react';
import { PlayerProfile } from './usePlayerSession';

interface SyncCode {
  code: string;
  profileId: string;
  expiresAt: number;
}

interface ProfileSyncData {
  profile: PlayerProfile;
  lastSync: number;
  deviceId: string;
}

export function useProfileSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);

  // Generate device ID
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('maple_device_id');
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('maple_device_id', deviceId);
    }
    return deviceId;
  };

  // Generate sync code (6-digit alphanumeric)
  const generateSyncCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Upload profile to cloud (using localStorage as fallback, could be replaced with real API)
  const uploadProfile = async (profile: PlayerProfile): Promise<string> => {
    const syncCode = generateSyncCode();
    const deviceId = getDeviceId();
    
    const syncData: ProfileSyncData = {
      profile,
      lastSync: Date.now(),
      deviceId
    };

    try {
      // In a real app, this would be an API call
      // For now, we'll use localStorage with a sync code system
      const syncKey = `maple_sync_${syncCode}`;
      localStorage.setItem(syncKey, JSON.stringify(syncData));
      
      // Store sync code with expiration (24 hours)
      const codeData: SyncCode = {
        code: syncCode,
        profileId: profile.id,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      
      localStorage.setItem(`maple_code_${syncCode}`, JSON.stringify(codeData));
      
      // Store in user's sync history
      const userSyncHistory = JSON.parse(localStorage.getItem(`maple_user_syncs_${profile.id}`) || '[]');
      userSyncHistory.push({
        code: syncCode,
        timestamp: Date.now(),
        deviceId
      });
      localStorage.setItem(`maple_user_syncs_${profile.id}`, JSON.stringify(userSyncHistory));

      return syncCode;
    } catch (error) {
      throw new Error('Failed to upload profile');
    }
  };

  // Download profile from cloud
  const downloadProfile = async (syncCode: string): Promise<PlayerProfile> => {
    try {
      const syncKey = `maple_sync_${syncCode}`;
      const syncDataStr = localStorage.getItem(syncKey);
      
      if (!syncDataStr) {
        throw new Error('Sync code not found or expired');
      }

      const syncData: ProfileSyncData = JSON.parse(syncDataStr);
      
      // Check if code is still valid
      const codeDataStr = localStorage.getItem(`maple_code_${syncCode}`);
      if (!codeDataStr) {
        throw new Error('Sync code expired');
      }

      const codeData: SyncCode = JSON.parse(codeDataStr);
      if (Date.now() > codeData.expiresAt) {
        // Clean up expired code
        localStorage.removeItem(syncKey);
        localStorage.removeItem(`maple_code_${syncCode}`);
        throw new Error('Sync code expired');
      }

      return syncData.profile;
    } catch (error) {
      throw new Error('Failed to download profile: ' + (error as Error).message);
    }
  };

  // Sync profile to cloud
  const syncProfileToCloud = async (profile: PlayerProfile): Promise<string> => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      const syncCode = await uploadProfile(profile);
      setLastSyncTime(Date.now());
      return syncCode;
    } catch (error) {
      setSyncError((error as Error).message);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync profile from cloud
  const syncProfileFromCloud = async (syncCode: string): Promise<PlayerProfile> => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      const profile = await downloadProfile(syncCode);
      setLastSyncTime(Date.now());
      return profile;
    } catch (error) {
      setSyncError((error as Error).message);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  // Get user's sync history
  const getSyncHistory = (profileId: string) => {
    try {
      const history = JSON.parse(localStorage.getItem(`maple_user_syncs_${profileId}`) || '[]');
      return history.sort((a: any, b: any) => b.timestamp - a.timestamp);
    } catch (error) {
      return [];
    }
  };

  // Auto-sync when profile changes (debounced)
  const [autoSyncTimer, setAutoSyncTimer] = useState<NodeJS.Timeout | null>(null);

  const enableAutoSync = (profile: PlayerProfile) => {
    if (autoSyncTimer) {
      clearTimeout(autoSyncTimer);
    }

    const timer = setTimeout(() => {
      uploadProfile(profile).catch(console.error);
    }, 30000); // Auto-sync after 30 seconds of inactivity

    setAutoSyncTimer(timer);
  };

  const disableAutoSync = () => {
    if (autoSyncTimer) {
      clearTimeout(autoSyncTimer);
      setAutoSyncTimer(null);
    }
  };

  // Clean up expired sync codes
  const cleanupExpiredCodes = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('maple_code_')) {
        try {
          const codeData = JSON.parse(localStorage.getItem(key) || '');
          if (Date.now() > codeData.expiresAt) {
            const syncCode = key.replace('maple_code_', '');
            localStorage.removeItem(key);
            localStorage.removeItem(`maple_sync_${syncCode}`);
          }
        } catch (error) {
          // Invalid data, remove it
          localStorage.removeItem(key);
        }
      }
    });
  };

  // Run cleanup on mount
  useEffect(() => {
    cleanupExpiredCodes();
  }, []);

  return {
    isSyncing,
    syncError,
    lastSyncTime,
    syncProfileToCloud,
    syncProfileFromCloud,
    getSyncHistory,
    enableAutoSync,
    disableAutoSync,
    generateSyncCode,
    getDeviceId,
  };
}
