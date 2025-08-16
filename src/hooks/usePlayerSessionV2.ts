'use client';

import { useLocalStorage } from './useLocalStorage';
import { useState, useEffect } from 'react';
import { playerApi, partyApi } from '@/services/api';

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
  isPrivate: boolean;
  allowedPlayers?: string[];
  createdAt: number;
  members: Array<{
    id: string;
    name: string;
    level: number;
    job: string;
    joinedAt: number;
    isHost?: boolean;
  }>;
  invites?: Array<{
    id: string;
    invitedPlayerName: string;
    status: 'pending' | 'accepted' | 'declined' | 'expired';
    createdAt: number;
  }>;
}

export function usePlayerSessionV2() {
  const [profile, setProfile] = useLocalStorage<PlayerProfile | null>('maplePlayerProfile', null);
  const [parties, setParties] = useState<PartyListing[]>([]);
  const [myParties, setMyParties] = useLocalStorage<string[]>('mapleMyParties', []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setIsLoggedIn(!!profile);
  }, [profile]);

  // Check backend availability
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:3002/health');
        setBackendAvailable(response.ok);
      } catch (error) {
        setBackendAvailable(false);
      }
    };
    
    checkBackend();
  }, []);

  // Sync profile with backend when available
  useEffect(() => {
    if (profile && backendAvailable) {
      syncProfileToBackend(profile);
    }
  }, [profile, backendAvailable]);

  // Load parties from backend or localStorage
  useEffect(() => {
    if (backendAvailable) {
      loadPartiesFromBackend();
    } else {
      loadPartiesFromLocalStorage();
    }
  }, [backendAvailable]);

  const syncProfileToBackend = async (playerProfile: PlayerProfile) => {
    try {
      const response = await playerApi.createOrUpdate({
        uniqueId: playerProfile.uniqueId,
        name: playerProfile.name,
        level: playerProfile.level,
        job: playerProfile.job,
        server: playerProfile.server,
        walletAddress: playerProfile.walletAddress,
        favoriteClasses: playerProfile.favoriteClasses,
        preferredDifficulty: playerProfile.preferredDifficulty,
      });

      if (!response.success) {
        console.warn('Failed to sync profile to backend:', response.error);
      }
    } catch (error) {
      console.warn('Backend sync failed:', error);
    }
  };

  const loadPartiesFromBackend = async () => {
    try {
      const response = await partyApi.list({ limit: 50 });
      if (response.success && response.data) {
        setParties(response.data);
      }
    } catch (error) {
      console.error('Failed to load parties from backend:', error);
      // Fallback to localStorage
      loadPartiesFromLocalStorage();
    }
  };

  const loadPartiesFromLocalStorage = () => {
    try {
      const storedParties = localStorage.getItem('maplePartyListings');
      if (storedParties) {
        const parsedParties = JSON.parse(storedParties);
        setParties(parsedParties);
      }
    } catch (error) {
      console.error('Error loading parties from localStorage:', error);
    }
  };

  // Function to generate a unique user-friendly ID
  const generateUniqueId = () => {
    const adjectives = ['Brave', 'Mighty', 'Swift', 'Noble', 'Epic', 'Legendary', 'Divine', 'Mystic', 'Shadow', 'Fire'];
    const nouns = ['Warrior', 'Mage', 'Archer', 'Knight', 'Hero', 'Champion', 'Hunter', 'Guardian', 'Master', 'Legend'];
    const numbers = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${adjective}${noun}${numbers}`;
  };

  const createProfile = async (profileData: Omit<PlayerProfile, 'id' | 'uniqueId' | 'createdAt' | 'lastActive'>) => {
    const newProfile: PlayerProfile = {
      ...profileData,
      id: crypto.randomUUID(),
      uniqueId: generateUniqueId(),
      createdAt: Date.now(),
      lastActive: Date.now(),
    };

    setProfile(newProfile);

    // Sync to backend if available
    if (backendAvailable) {
      await syncProfileToBackend(newProfile);
    }

    return newProfile;
  };

  const updateProfile = async (updates: Partial<PlayerProfile>) => {
    if (profile) {
      const updatedProfile = {
        ...profile,
        ...updates,
        lastActive: Date.now(),
      };
      
      setProfile(updatedProfile);

      // Sync to backend if available
      if (backendAvailable) {
        await syncProfileToBackend(updatedProfile);
      }

      return updatedProfile;
    }
    return null;
  };

  const logout = () => {
    setProfile(null);
    setMyParties([]);
  };

  const createParty = async (partyData: Omit<PartyListing, 'id' | 'hostId' | 'hostName' | 'createdAt' | 'members'>) => {
    if (!profile) return null;

    if (backendAvailable) {
      try {
        const response = await partyApi.create({
          hostId: profile.id,
          hostName: profile.name,
          bossName: partyData.bossName,
          difficulty: partyData.difficulty,
          maxMembers: partyData.maxMembers,
          scheduledTime: partyData.scheduledTime,
          server: partyData.server,
          requirements: partyData.requirements,
          description: partyData.description,
          isPrivate: partyData.isPrivate || false,
          allowedPlayers: partyData.allowedPlayers || [],
        });

        if (response.success) {
          await loadPartiesFromBackend(); // Refresh parties list
          setMyParties(prev => [response.data.id, ...prev]);
          return response.data;
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        console.error('Failed to create party on backend:', error);
        // Fallback to localStorage
      }
    }

    // LocalStorage fallback
    const newParty: PartyListing = {
      ...partyData,
      id: crypto.randomUUID(),
      hostId: profile.id,
      hostName: profile.name,
      isPrivate: partyData.isPrivate || false,
      allowedPlayers: partyData.allowedPlayers || [],
      createdAt: Date.now(),
      members: [{
        id: profile.id,
        name: profile.name,
        level: profile.level,
        job: profile.job,
        joinedAt: Date.now(),
        isHost: true,
      }],
    };

    const updatedParties = [newParty, ...parties];
    setParties(updatedParties);
    setMyParties(prev => [newParty.id, ...prev]);
    
    // Save to localStorage as backup
    localStorage.setItem('maplePartyListings', JSON.stringify(updatedParties));
    
    return newParty;
  };

  const joinParty = async (partyId: string) => {
    if (!profile) return false;

    if (backendAvailable) {
      try {
        const response = await partyApi.join(partyId, {
          playerId: profile.id,
          playerName: profile.name,
        });

        if (response.success) {
          await loadPartiesFromBackend(); // Refresh parties list
          setMyParties(prev => [...prev, partyId]);
          return true;
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        console.error('Failed to join party on backend:', error);
        alert(error instanceof Error ? error.message : 'Failed to join party');
        return false;
      }
    }

    // LocalStorage fallback
    const updatedParties = parties.map(party => {
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
    });

    setParties(updatedParties);
    setMyParties(prev => [...prev, partyId]);
    localStorage.setItem('maplePartyListings', JSON.stringify(updatedParties));
    return true;
  };

  const leaveParty = async (partyId: string) => {
    if (!profile) return false;

    if (backendAvailable) {
      try {
        const response = await partyApi.leave(partyId, profile.id);

        if (response.success) {
          await loadPartiesFromBackend(); // Refresh parties list
          setMyParties(prev => prev.filter(id => id !== partyId));
          return true;
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        console.error('Failed to leave party on backend:', error);
        return false;
      }
    }

    // LocalStorage fallback
    const updatedParties = parties.map(party => {
      if (party.id === partyId) {
        const updatedMembers = party.members.filter(member => member.id !== profile.id);
        return {
          ...party,
          currentMembers: updatedMembers.length,
          members: updatedMembers,
        };
      }
      return party;
    });

    setParties(updatedParties);
    setMyParties(prev => prev.filter(id => id !== partyId));
    localStorage.setItem('maplePartyListings', JSON.stringify(updatedParties));
    return true;
  };

  const deleteParty = async (partyId: string) => {
    if (!profile) return false;

    if (backendAvailable) {
      try {
        const response = await partyApi.leave(partyId, profile.id); // This will delete if host leaves
        
        if (response.success) {
          await loadPartiesFromBackend(); // Refresh parties list
          setMyParties(prev => prev.filter(id => id !== partyId));
          return true;
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        console.error('Failed to delete party on backend:', error);
        return false;
      }
    }

    // LocalStorage fallback
    const updatedParties = parties.filter(party => 
      !(party.id === partyId && party.hostId === profile.id)
    );
    
    setParties(updatedParties);
    setMyParties(prev => prev.filter(id => id !== partyId));
    localStorage.setItem('maplePartyListings', JSON.stringify(updatedParties));
    return true;
  };

  const inviteToParty = async (partyId: string, playerName: string) => {
    if (!profile) return false;

    if (backendAvailable) {
      try {
        const response = await partyApi.invite(partyId, playerName, profile.id);
        
        if (response.success) {
          return true;
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        console.error('Failed to send invite:', error);
        alert(error instanceof Error ? error.message : 'Failed to send invite');
        return false;
      }
    }

    // For localStorage mode, we can't really send invites
    alert('Invite feature requires backend connection');
    return false;
  };

  const getMyInvites = async () => {
    if (!profile || !backendAvailable) return [];

    try {
      const response = await partyApi.getInvites(profile.id);
      return response.success ? response.data || [] : [];
    } catch (error) {
      console.error('Failed to get invites:', error);
      return [];
    }
  };

  const respondToInvite = async (inviteId: string, response: 'accept' | 'decline') => {
    if (!profile || !backendAvailable) return false;

    try {
      const apiResponse = await partyApi.respondToInvite(inviteId, response, profile.id);
      
      if (apiResponse.success) {
        if (response === 'accept') {
          await loadPartiesFromBackend(); // Refresh to show new party membership
        }
        return true;
      } else {
        throw new Error(apiResponse.error);
      }
    } catch (error) {
      console.error('Failed to respond to invite:', error);
      return false;
    }
  };

  return {
    profile,
    parties,
    myParties,
    isLoggedIn,
    backendAvailable,
    createProfile,
    updateProfile,
    logout,
    createParty,
    joinParty,
    leaveParty,
    deleteParty,
    inviteToParty,
    getMyInvites,
    respondToInvite,
    refreshParties: loadPartiesFromBackend,
  };
}
