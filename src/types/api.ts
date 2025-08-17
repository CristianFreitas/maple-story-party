// API Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PlayerData {
  id: string;
  uniqueId: string;
  name: string;
  level: number;
  job: string;
  server: string;
  favoriteClasses: string;
  preferredDifficulty: string;
  createdAt: string;
  lastActive: string;
  reputation: number;
  isBanned: number;
}

export interface PartyData {
  id: string;
  hostId: string;
  hostName: string;
  bossName: string;
  difficulty: string;
  currentMembers: number;
  maxMembers: number;
  scheduledTime?: string;
  server: string;
  requirements: string;
  description: string;
  isPrivate: boolean;
  allowedPlayers: string;
  createdAt: string;
  members: string;
  invites?: string;
}

export interface BuffScheduleData {
  id: string;
  playerId: string;
  playerName: string;
  server: string;
  buffType: string;
  scheduledTime: number;
  location: string;
  description: string;
  isConfirmed: boolean;
  confirmedAt?: number;
  week: string;
  upvotes: number;
  downvotes: number;
  reports: number;
  votes: string;
}
