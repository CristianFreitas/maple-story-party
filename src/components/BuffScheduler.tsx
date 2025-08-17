'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePlayerSession } from '@/hooks/usePlayerSession';
import { buffApi } from '@/services/api';
import { Calendar, MapPin, Users, ThumbsUp, ThumbsDown, Flag, CheckCircle, ExternalLink } from 'lucide-react';
import { createBuffScheduleEvent, openGoogleCalendar } from '@/utils/googleCalendar';

interface BuffSchedule {
  id: string;
  playerId: string;
  playerName: string;
  server: string;
  buffType: 'exp' | 'drop' | 'burning' | 'other';
  scheduledTime: number;
  location: string;
  description: string;
  isConfirmed: boolean;
  confirmedAt?: number;
  week: string;
  createdAt: number;
  reputation: number;
  upvotes: number;
  downvotes: number;
  reports: number;
  votes: Array<{
    id: string;
    playerId: string;
    voteType: 'upvote' | 'downvote' | 'report';
    reason?: string;
    timestamp: number;
  }>;
}

interface BuffStats {
  week: string;
  nextReset: number;
  totalSchedules: number;
  confirmedSchedules: number;
  uniquePlayers: number;
  serversUsed: number;
  serverDistribution: { server: string; count: number }[];
}

export function BuffScheduler() {
  const { t } = useLanguage();
  const { profile } = usePlayerSession();
  const [schedules, setSchedules] = useState<BuffSchedule[]>([]);
  const [stats, setStats] = useState<BuffStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [serverFilter, setServerFilter] = useState('');
  const [buffTypeFilter, setBuffTypeFilter] = useState('');

  // Form states
  const [formData, setFormData] = useState<{
    buffType: 'exp' | 'drop' | 'burning' | 'other';
    scheduledTime: string;
    scheduledDate: string;
    location: string;
    description: string;
  }>({
    buffType: 'exp',
    scheduledTime: '',
    scheduledDate: '',
    location: '',
    description: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [schedulesResponse, statsResponse] = await Promise.all([
        buffApi.list({ server: serverFilter || undefined, buffType: buffTypeFilter || undefined }),
        buffApi.getStats(serverFilter || undefined)
      ]);

      if (schedulesResponse.success && schedulesResponse.data) {
        const mappedSchedules = schedulesResponse.data.map((schedule: any) => ({
          ...schedule,
          votes: schedule.votes ? JSON.parse(schedule.votes) : [],
        }));
        setSchedules(mappedSchedules);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error loading buff data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [serverFilter, buffTypeFilter]);

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      alert('You need to create a profile first');
      return;
    }

    const scheduledTimestamp = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).getTime();

    const response = await buffApi.create({
      playerId: profile.id,
      playerName: profile.name,
      server: profile.server,
      buffType: formData.buffType,
      scheduledTime: scheduledTimestamp,
      location: formData.location,
      description: formData.description,
    });

    if (response.success) {
      setShowCreateModal(false);
      
      // Ask if user wants to add to Google Calendar
      const addToCalendar = window.confirm('Schedule created successfully! Would you like to add it to your Google Calendar?');
      
      if (addToCalendar) {
        const event = createBuffScheduleEvent({
          playerName: profile.name,
          buffType: formData.buffType,
          scheduledTime: new Date(scheduledTimestamp),
          location: formData.location,
          description: formData.description,
          server: profile.server
        });
        openGoogleCalendar(event);
      }
      
      setFormData({
        buffType: 'exp',
        scheduledTime: '',
        scheduledDate: '',
        location: '',
        description: '',
      });
      loadData();
    } else {
      alert(response.error || 'Failed to create schedule');
    }
  };

  const handleVote = async (scheduleId: string, voteType: 'upvote' | 'downvote' | 'report', reason?: string) => {
    if (!profile) {
      alert('You need to create a profile first');
      return;
    }

    const response = await buffApi.vote(scheduleId, {
      voterId: profile.id,
      voteType,
      reason,
    });

    if (response.success) {
      loadData(); // Reload to update vote counts
    } else {
      alert(response.error || 'Failed to vote');
    }
  };

  const handleConfirm = async (scheduleId: string) => {
    if (!profile) return;

    const response = await buffApi.confirm(scheduleId, profile.id);
    if (response.success) {
      loadData();
    } else {
      alert(response.error || 'Failed to confirm');
    }
  };

  const handleCancel = async (scheduleId: string) => {
    if (!profile) return;
    if (!confirm('Are you sure you want to cancel this buff schedule?')) return;

    const response = await buffApi.cancel(scheduleId, profile.id);
    if (response.success) {
      loadData();
    } else {
      alert(response.error || 'Failed to cancel');
    }
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const formatTimeUntil = (timestamp: number) => {
    const diff = timestamp - Date.now();
    if (diff < 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  const buffTypeLabels = {
    exp: '🎯 EXP Buff',
    drop: '💰 Drop Buff', 
    burning: '🔥 Burning Event',
    other: '⭐ Other Buff'
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maple-blue"></div>
          <span className="ml-3 text-gray-600">Loading buff schedules...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-maple-dark mb-4 text-shadow">
          🗓️ Buff Schedule Manager
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Coordinate buff usage with the community! Each player can schedule one buff per week.
          Weekly reset: Wednesday 9 PM (Brazil time)
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="bg-gradient-to-r from-maple-blue to-maple-purple rounded-lg p-6 mb-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalSchedules}</div>
              <div className="text-sm opacity-90">Total Schedules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.confirmedSchedules}</div>
              <div className="text-sm opacity-90">Confirmed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.uniquePlayers}</div>
              <div className="text-sm opacity-90">Players</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatTimeUntil(stats.nextReset)}</div>
              <div className="text-sm opacity-90">Until Reset</div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={serverFilter}
              onChange={(e) => setServerFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maple-blue focus:border-transparent"
            >
              <option value="">All Servers</option>
              <option value="Scania">Scania</option>
              <option value="Bera">Bera</option>
              <option value="Aurora">Aurora</option>
              <option value="Elysium">Elysium</option>
              <option value="Luna">Luna</option>
              <option value="Zenith">Zenith</option>
            </select>

            <select
              value={buffTypeFilter}
              onChange={(e) => setBuffTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maple-blue focus:border-transparent"
            >
              <option value="">All Buff Types</option>
              <option value="exp">EXP Buff</option>
              <option value="drop">Drop Buff</option>
              <option value="burning">Burning Event</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!profile}
            className="maple-button px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📅 Schedule Buff
          </button>
        </div>
      </div>

      {/* Schedule List */}
      <div className="space-y-4">
        {schedules.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No buff schedules this week</h3>
            <p className="text-gray-500">Be the first to schedule a buff!</p>
          </div>
        ) : (
          schedules.map((schedule) => (
            <div key={schedule.id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-maple-blue">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{buffTypeLabels[schedule.buffType]}</span>
                    <span className="bg-maple-blue text-white px-3 py-1 rounded-full text-sm">
                      {schedule.server}
                    </span>
                    {schedule.isConfirmed && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Confirmed
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDateTime(schedule.scheduledTime)}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {schedule.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {schedule.playerName} ({schedule.reputation} rep)
                    </div>
                  </div>

                  {schedule.description && (
                    <p className="text-gray-700 mb-3">{schedule.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm">
                    <span className={`${formatTimeUntil(schedule.scheduledTime) === 'Expired' ? 'text-red-500' : 'text-green-600'} font-medium`}>
                      {formatTimeUntil(schedule.scheduledTime) === 'Expired' ? '⏰ Expired' : `⏱️ ${formatTimeUntil(schedule.scheduledTime)}`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-4 md:mt-0">
                  {/* Google Calendar button */}
                  <div className="flex justify-center mb-2">
                    <button
                      onClick={() => {
                        const event = createBuffScheduleEvent({
                          playerName: schedule.playerName,
                          buffType: schedule.buffType,
                          scheduledTime: new Date(schedule.scheduledTime),
                          location: schedule.location,
                          description: schedule.description,
                          server: schedule.server
                        });
                        openGoogleCalendar(event);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                      title="Add to Google Calendar"
                    >
                      <Calendar className="w-4 h-4" />
                      <ExternalLink className="w-3 h-3" />
                      Add to Calendar
                    </button>
                  </div>

                  {/* Vote buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(schedule.id, 'upvote')}
                      disabled={!profile || schedule.playerId === profile?.id}
                      className="flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {schedule.upvotes}
                    </button>
                    <button
                      onClick={() => handleVote(schedule.id, 'downvote')}
                      disabled={!profile || schedule.playerId === profile?.id}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      {schedule.downvotes}
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Reason for report (optional):');
                        if (reason !== null) handleVote(schedule.id, 'report', reason);
                      }}
                      disabled={!profile || schedule.playerId === profile?.id}
                      className="flex items-center gap-1 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Flag className="w-4 h-4" />
                      {schedule.reports}
                    </button>
                  </div>

                  {/* Owner actions */}
                  {profile && schedule.playerId === profile.id && (
                    <div className="flex gap-2">
                      {!schedule.isConfirmed && (
                        <button
                          onClick={() => handleConfirm(schedule.id)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                        >
                          Confirm
                        </button>
                      )}
                      <button
                        onClick={() => handleCancel(schedule.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Schedule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-maple-dark mb-4">Schedule Buff</h2>
              
              <form onSubmit={handleCreateSchedule} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buff Type
                  </label>
                  <select
                    value={formData.buffType}
                    onChange={(e) => setFormData(prev => ({ ...prev, buffType: e.target.value as 'exp' | 'drop' | 'burning' | 'other' }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maple-blue focus:border-transparent"
                    required
                  >
                    <option value="exp">🎯 EXP Buff</option>
                    <option value="drop">💰 Drop Buff</option>
                    <option value="burning">🔥 Burning Event</option>
                    <option value="other">⭐ Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maple-blue focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maple-blue focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Henesys, Leafre, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maple-blue focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional details about the buff session..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maple-blue focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 maple-button px-4 py-2"
                  >
                    Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
