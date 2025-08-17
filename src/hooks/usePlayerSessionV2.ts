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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoggedIn(!!profile);
  }, [profile]);

  // Function to generate a unique user-friendly ID
  const generateUniqueId = () => {
    const adjectives = ['Brave', 'Mighty', 'Swift', 'Noble', 'Epic', 'Legendary', 'Divine', 'Mystic', 'Shadow', 'Fire'];
    const nouns = ['Warrior', 'Mage', 'Archer', 'Knight', 'Hero', 'Champion', 'Hunter', 'Guardian', 'Master', 'Legend'];
    const numbers = Math.floor(Math.random() * 9999).toString().padStart(4, '0');

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${adjective}${noun}${numbers}`;
  };

  // Load parties from backend
  const loadParties = async () => {
    try {
      setLoading(true);
      const response = await partyApi.list();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch parties');
      }
      const backendParties = response.data;
      
      // Transform backend data to frontend format
      const transformedParties: PartyListing[] = (backendParties as unknown as Record<string, unknown>[]).map((party) => ({
        id: party.id as string,
        hostId: party.host_id as string,
        hostName: party.host_name as string,
        bossName: party.boss_name as string,
        difficulty: party.difficulty as 'normal' | 'chaos' | 'hard' | 'extreme',
        currentMembers: party.current_members as number,
        maxMembers: party.max_members as number,
        scheduledTime: party.scheduled_time ? new Date(party.scheduled_time as string).getTime() : undefined,
        server: party.server as string,
        requirements: (party.requirements as string) || '',
        description: (party.description as string) || '',
        isPrivate: (party.is_private as boolean) || false,
        allowedPlayers: (party.allowed_players as string[]) || [],
        createdAt: new Date(party.created_at as string).getTime(),
        members: ((party.party_members as Record<string, unknown>[]) || []).map((member) => ({
          id: member.player_id as string,
          name: member.player_name as string,
          level: member.level as number,
          job: member.job as string,
          joinedAt: new Date(member.joined_at as string).getTime(),
          isHost: (member.is_host as boolean) || false,
        })),
        invites: ((party.party_invites as Record<string, unknown>[]) || []).map((invite) => ({
          id: invite.id as string,
          invitedPlayerName: invite.invited_player_name as string,
          status: invite.status as 'pending' | 'accepted' | 'declined' | 'expired',
          createdAt: new Date(invite.created_at as string).getTime(),
        })),
      }));

      setParties(transformedParties);
      setError(null);
    } catch (err) {
      console.error('Error loading parties:', err);
      setError('Failed to load parties');
      // Fallback to localStorage
      const localParties = localStorage.getItem('maplePartyListings');
      if (localParties) {
        try {
          setParties(JSON.parse(localParties));
        } catch (e) {
          console.error('Error parsing local parties:', e);
          setParties([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Load parties on mount
  useEffect(() => {
    loadParties();
  }, []);

  const createProfile = async (profileData: Omit<PlayerProfile, 'id' | 'uniqueId' | 'createdAt' | 'lastActive'>) => {
    const uniqueId = generateUniqueId();
    const newProfile: PlayerProfile = {
      ...profileData,
      id: crypto.randomUUID(),
      uniqueId,
      createdAt: Date.now(),
      lastActive: Date.now(),
    };

    try {
      // Try to create in backend
      await playerApi.createOrUpdate({
        uniqueId: newProfile.uniqueId,
        name: newProfile.name,
        level: newProfile.level,
        job: newProfile.job,
        server: newProfile.server,
        favoriteClasses: JSON.stringify(newProfile.favoriteClasses),
        preferredDifficulty: newProfile.preferredDifficulty,
      });
      
      setProfile(newProfile);
      return newProfile;
    } catch (err) {
      console.error('Error creating profile in backend:', err);
      // Fallback to localStorage
      setProfile(newProfile);
      return newProfile;
    }
  };

  const updateProfile = async (updates: Partial<PlayerProfile>) => {
    if (!profile) return null;

    const updatedProfile = { ...profile, ...updates, lastActive: Date.now() };

    try {
      // Try to update in backend
      await playerApi.createOrUpdate({
        id: profile.id,
        uniqueId: updatedProfile.uniqueId,
        name: updatedProfile.name,
        level: updatedProfile.level,
        job: updatedProfile.job,
        server: updatedProfile.server,
        favoriteClasses: JSON.stringify(updatedProfile.favoriteClasses),
        preferredDifficulty: updatedProfile.preferredDifficulty,
      });

      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.error('Error updating profile in backend:', err);
      // Fallback to localStorage
      setProfile(updatedProfile);
      return updatedProfile;
    }
  };

  const createParty = async (partyData: Omit<PartyListing, 'id' | 'hostId' | 'hostName' | 'currentMembers' | 'createdAt' | 'members' | 'invites'>) => {
    if (!profile) return null;

    const newParty: PartyListing = {
      ...partyData,
      id: crypto.randomUUID(),
      hostId: profile.id,
      hostName: profile.name,
      currentMembers: 1,
      createdAt: Date.now(),
      members: [{
        id: profile.id,
        name: profile.name,
        level: profile.level,
        job: profile.job,
        joinedAt: Date.now(),
        isHost: true,
      }],
      invites: [],
    };

    try {
      // Try to create in backend
      const backendParty = await partyApi.create({
        hostId: newParty.hostId,
        hostName: newParty.hostName,
        bossName: newParty.bossName,
        difficulty: newParty.difficulty,
        maxMembers: newParty.maxMembers,
        scheduledTime: newParty.scheduledTime ? new Date(newParty.scheduledTime).toISOString() : undefined,
        server: newParty.server,
        requirements: newParty.requirements,
        description: newParty.description,
        isPrivate: newParty.isPrivate,
        allowedPlayers: JSON.stringify(newParty.allowedPlayers || []),
      });

      // Refresh parties list
      await loadParties();
      
      // Add to my parties
      if (backendParty.success && backendParty.data) {
        setMyParties(prev => [...prev, backendParty.data!.id]);
      }
      
      return backendParty;
    } catch (err) {
      console.error('Error creating party in backend:', err);
      // Fallback to localStorage
      setParties(prev => [...prev, newParty]);
      setMyParties(prev => [...prev, newParty.id]);
      return newParty;
    }
  };

  const joinParty = async (partyId: string): Promise<boolean> => {
    if (!profile) return false;

    const party = parties.find(p => p.id === partyId);
    if (!party) return false;

    if (party.currentMembers >= party.maxMembers) {
      alert('Party is full!');
      return false;
    }

    if (party.members.some(m => m.id === profile.id)) {
      alert('You are already in this party!');
      return false;
    }

    try {
      // Try to join in backend
      await partyApi.join(partyId, {
        playerId: profile.id,
        playerName: profile.name,
      });

      // Refresh parties list
      await loadParties();
      
      // Add to my parties
      setMyParties(prev => [...prev, partyId]);
      
      return true;
    } catch (err) {
      console.error('Error joining party in backend:', err);
      
      // Fallback to localStorage
      const newMember = {
        id: profile.id,
        name: profile.name,
        level: profile.level,
        job: profile.job,
        joinedAt: Date.now(),
        isHost: false,
      };

      setParties(prev => prev.map(p => 
        p.id === partyId 
          ? { ...p, members: [...p.members, newMember], currentMembers: p.currentMembers + 1 }
          : p
      ));
      setMyParties(prev => [...prev, partyId]);
      
      return true;
    }
  };

  const leaveParty = async (partyId: string): Promise<boolean> => {
    if (!profile) return false;

    try {
      // Try to leave in backend
      await partyApi.leave(partyId, profile.id);

      // Refresh parties list
      await loadParties();
      
      // Remove from my parties
      setMyParties(prev => prev.filter(id => id !== partyId));
      
      return true;
    } catch (err) {
      console.error('Error leaving party in backend:', err);
      
      // Fallback to localStorage
      setParties(prev => prev.map(p => {
        if (p.id !== partyId) return p;
        
        const updatedMembers = p.members.filter(m => m.id !== profile.id);
        return {
          ...p,
          members: updatedMembers,
          currentMembers: updatedMembers.length,
        };
      }));
      setMyParties(prev => prev.filter(id => id !== partyId));
      
      return true;
    }
  };

  const deleteParty = async (partyId: string): Promise<boolean> => {
    if (!profile) return false;

    const party = parties.find(p => p.id === partyId);
    if (!party || party.hostId !== profile.id) {
      alert('You can only delete your own parties!');
      return false;
    }

    try {
      // Try to delete in backend
      // TODO: Implement delete party API endpoint
      // await partyApi.delete(partyId);

      // Refresh parties list
      await loadParties();
      
      // Remove from my parties
      setMyParties(prev => prev.filter(id => id !== partyId));
      
      return true;
    } catch (err) {
      console.error('Error deleting party in backend:', err);
      
      // Fallback to localStorage
      setParties(prev => prev.filter(p => p.id !== partyId));
      setMyParties(prev => prev.filter(id => id !== partyId));
      
      return true;
    }
  };

  const logout = () => {
    setProfile(null);
    setMyParties([]);
  };

  return {
    profile,
    parties,
    myParties,
    isLoggedIn,
    loading,
    error,
    createProfile,
    updateProfile,
    createParty,
    joinParty,
    leaveParty,
    deleteParty,
    logout,
    refreshParties: loadParties,
  };
}