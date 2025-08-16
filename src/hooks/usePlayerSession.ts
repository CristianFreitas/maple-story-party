'use client';

import { useLocalStorage } from './useLocalStorage';
import { useState, useEffect } from 'react';

export interface PlayerProfile {
  id: string;
  uniqueId: string; // User-friendly unique identifier
  name: string;
  level: number;
  job: string;
  server: string;
  walletAddress?: string;
  favoriteClasses: string[];
  preferredDifficulty: 'normal' | 'chaos' | 'hard' | 'extreme';
  createdAt: number;
  lastActive: number;
  reputation: number; // Reputation score (0-200)
  reputationHistory: Array<{
    id: string;
    change: number;
    reason: string;
    fromPlayer?: string;
    timestamp: number;
  }>;
}

export interface PartyListing {
  id: string;
  hostId: string;
  hostName: string;
  bossName: string;
  difficulty: 'normal' | 'chaos' | 'hard' | 'extreme';
  currentMembers: number;
  maxMembers: number;
  scheduledTime?: number;
  server: string;
  requirements: string;
  description: string;
  createdAt: number;
  members: Array<{
    id: string;
    name: string;
    level: number;
    job: string;
    joinedAt: number;
  }>;
}

export function usePlayerSession() {
  const [profile, setProfile] = useLocalStorage<PlayerProfile | null>('maplePlayerProfile', null);
  const [parties, setParties] = useLocalStorage<PartyListing[]>('maplePartyListings', []);
  const [myParties, setMyParties] = useLocalStorage<string[]>('mapleMyParties', []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!profile);
  }, [profile]);

  // Listen for storage events to sync data across tabs/components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'maplePartyListings' && e.newValue) {
        try {
          const newParties = JSON.parse(e.newValue);
          setParties(newParties);
        } catch (error) {
          console.error('Error parsing party data from storage:', error);
        }
      }
    };

    const handleCustomStorageEvent = () => {
      // Force refresh of parties data
      const partiesData = localStorage.getItem('maplePartyListings');
      if (partiesData) {
        try {
          const newParties = JSON.parse(partiesData);
          setParties(newParties);
        } catch (error) {
          console.error('Error parsing party data:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage', handleCustomStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage', handleCustomStorageEvent);
    };
  }, [setParties]);

  // Function to generate a unique user-friendly ID
  const generateUniqueId = () => {
    const adjectives = ['Brave', 'Mighty', 'Swift', 'Noble', 'Epic', 'Legendary', 'Divine', 'Mystic', 'Shadow', 'Fire'];
    const nouns = ['Warrior', 'Mage', 'Archer', 'Knight', 'Hero', 'Champion', 'Hunter', 'Guardian', 'Master', 'Legend'];
    const numbers = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${adjective}${noun}${numbers}`;
  };

  const createProfile = (profileData: Omit<PlayerProfile, 'id' | 'uniqueId' | 'createdAt' | 'lastActive' | 'reputation' | 'reputationHistory'>) => {
    const newProfile: PlayerProfile = {
      ...profileData,
      id: crypto.randomUUID(),
      uniqueId: generateUniqueId(),
      createdAt: Date.now(),
      lastActive: Date.now(),
      reputation: 100, // Starting reputation
      reputationHistory: [{
        id: crypto.randomUUID(),
        change: 100,
        reason: 'Account created',
        timestamp: Date.now()
      }]
    };
    setProfile(newProfile);
    return newProfile;
  };

  const updateProfile = (updates: Partial<PlayerProfile>) => {
    if (profile) {
      const updatedProfile = {
        ...profile,
        ...updates,
        lastActive: Date.now(),
      };
      setProfile(updatedProfile);
      return updatedProfile;
    }
    return null;
  };

  const logout = () => {
    setProfile(null);
    setMyParties([]);
  };

  const createParty = (partyData: Omit<PartyListing, 'id' | 'hostId' | 'hostName' | 'createdAt' | 'members'>) => {
    if (!profile) return null;

    const newParty: PartyListing = {
      ...partyData,
      id: crypto.randomUUID(),
      hostId: profile.id,
      hostName: profile.name,
      createdAt: Date.now(),
      members: [{
        id: profile.id,
        name: profile.name,
        level: profile.level,
        job: profile.job,
        joinedAt: Date.now(),
      }],
    };

    setParties(prev => [newParty, ...prev]);
    setMyParties(prev => [newParty.id, ...prev]);
    return newParty;
  };

  const joinParty = (partyId: string) => {
    if (!profile) return false;

    setParties(prev => prev.map(party => {
      if (party.id === partyId && party.currentMembers < party.maxMembers) {
        const alreadyMember = party.members.some(member => member.id === profile.id);
        if (!alreadyMember) {
          return {
            ...party,
            currentMembers: party.currentMembers + 1,
            members: [...party.members, {
              id: profile.id,
              name: profile.name,
              level: profile.level,
              job: profile.job,
              joinedAt: Date.now(),
            }],
          };
        }
      }
      return party;
    }));

    setMyParties(prev => [...prev, partyId]);
    return true;
  };

  const leaveParty = (partyId: string) => {
    if (!profile) return false;

    setParties(prev => prev.map(party => {
      if (party.id === partyId) {
        const updatedMembers = party.members.filter(member => member.id !== profile.id);
        return {
          ...party,
          currentMembers: updatedMembers.length,
          members: updatedMembers,
        };
      }
      return party;
    }));

    setMyParties(prev => prev.filter(id => id !== partyId));
    return true;
  };

  const deleteParty = (partyId: string) => {
    if (!profile) return false;

    setParties(prev => prev.filter(party => 
      !(party.id === partyId && party.hostId === profile.id)
    ));
    
    setMyParties(prev => prev.filter(id => id !== partyId));
    return true;
  };

  // Reputation management
  const addReputationChange = (change: number, reason: string, fromPlayer?: string) => {
    if (!profile) return;

    const newReputation = Math.max(0, Math.min(200, profile.reputation + change));
    const reputationEntry = {
      id: crypto.randomUUID(),
      change,
      reason,
      fromPlayer,
      timestamp: Date.now()
    };

    const updatedProfile = {
      ...profile,
      reputation: newReputation,
      reputationHistory: [...profile.reputationHistory, reputationEntry],
      lastActive: Date.now()
    };

    setProfile(updatedProfile);
    return reputationEntry;
  };

  const getReputationLevel = (reputation: number) => {
    if (reputation >= 180) return { level: 'Legendary', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    if (reputation >= 150) return { level: 'Excellent', color: 'text-purple-500', bg: 'bg-purple-100' };
    if (reputation >= 120) return { level: 'Good', color: 'text-green-500', bg: 'bg-green-100' };
    if (reputation >= 80) return { level: 'Average', color: 'text-blue-500', bg: 'bg-blue-100' };
    if (reputation >= 50) return { level: 'Poor', color: 'text-orange-500', bg: 'bg-orange-100' };
    return { level: 'Terrible', color: 'text-red-500', bg: 'bg-red-100' };
  };

  const canPerformAction = (action: 'create_party' | 'join_party' | 'schedule_buff' | 'vote') => {
    if (!profile) return false;
    
    const minReputation = {
      create_party: 20,
      join_party: 10,
      schedule_buff: 30,
      vote: 15
    };

    return profile.reputation >= minReputation[action];
  };

  return {
    profile,
    parties,
    myParties,
    isLoggedIn,
    createProfile,
    updateProfile,
    logout,
    createParty,
    joinParty,
    leaveParty,
    deleteParty,
    addReputationChange,
    getReputationLevel,
    canPerformAction,
  };
}

