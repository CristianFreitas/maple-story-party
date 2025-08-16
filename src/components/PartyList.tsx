'use client';

import { usePlayerSession } from '@/hooks/usePlayerSession';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBossById } from '@/data/bosses';
import { Users, Clock, Shield, Crown, UserPlus, UserMinus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PartyListProps {
  onCreateParty: () => void;
}

export function PartyList({ onCreateParty }: PartyListProps) {
  const { parties, profile, joinParty, leaveParty, deleteParty, myParties } = usePlayerSession();
  const { t } = useLanguage();
  const [filter, setFilter] = useState({
    difficulty: '',
    server: '',
    bossName: '',
  });

  const filteredParties = parties.filter(party => {
    if (filter.difficulty && getBossById(party.bossName)?.difficulty !== filter.difficulty) return false;
    if (filter.server && party.server !== filter.server) return false;
    if (filter.bossName && !party.bossName.toLowerCase().includes(filter.bossName.toLowerCase())) return false;
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      normal: 'text-boss-normal',
      chaos: 'text-boss-chaos',
      hard: 'text-boss-hard',
      extreme: 'text-boss-extreme',
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-500';
  };

  const getDifficultyBg = (difficulty: string) => {
    const colors = {
      normal: 'bg-boss-normal',
      chaos: 'bg-boss-chaos',
      hard: 'bg-boss-hard',
      extreme: 'bg-boss-extreme',
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-500';
  };

  const handleJoinParty = (partyId: string) => {
    if (!profile) {
      alert(t.messages.profileNeeded);
      return;
    }
    joinParty(partyId);
  };

  const handleLeaveParty = (partyId: string) => {
    leaveParty(partyId);
  };

  const handleDeleteParty = (partyId: string) => {
    if (confirm(t.party.confirmDelete)) {
      deleteParty(partyId);
    }
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return t.common.flexibleTime;
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">
            {t.party.partiesActive}
          </h2>
          <p className="text-maple-light">
            {t.party.findOrCreateParty}
          </p>
        </div>
        <button
          onClick={onCreateParty}
          className="maple-button px-6 py-3 text-lg flex items-center space-x-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>{t.party.createParty}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="maple-panel p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-maple-dark mb-2">
              {t.common.difficulty}
            </label>
            <select
              value={filter.difficulty}
              onChange={(e) => setFilter(prev => ({ ...prev, difficulty: e.target.value }))}
              className="w-full px-3 py-2 border-2 border-maple-blue rounded-lg focus:outline-none focus:border-maple-orange"
            >
              <option value="">{t.party.all}</option>
              <option value="normal">Normal</option>
              <option value="chaos">Chaos</option>
              <option value="hard">Hard</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-maple-dark mb-2">
              {t.common.server}
            </label>
            <input
              type="text"
              value={filter.server}
              onChange={(e) => setFilter(prev => ({ ...prev, server: e.target.value }))}
              placeholder={t.party.filterByServer}
              className="w-full px-3 py-2 border-2 border-maple-blue rounded-lg focus:outline-none focus:border-maple-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-maple-dark mb-2">
              Boss
            </label>
            <input
              type="text"
              value={filter.bossName}
              onChange={(e) => setFilter(prev => ({ ...prev, bossName: e.target.value }))}
              placeholder={t.party.filterByBoss}
              className="w-full px-3 py-2 border-2 border-maple-blue rounded-lg focus:outline-none focus:border-maple-orange"
            />
          </div>
        </div>
      </div>

      {/* Party List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredParties.length === 0 ? (
          <div className="col-span-full maple-panel p-8 text-center">
            <div className="text-6xl mb-4">🍃</div>
            <h3 className="text-xl font-bold text-maple-dark mb-2">
              {t.party.noPartiesFound}
            </h3>
            <p className="text-gray-600 mb-4">
              {t.party.noPartiesDescription}
            </p>
            <button
              onClick={onCreateParty}
              className="maple-button px-6 py-3"
            >
{t.party.createFirstParty}
            </button>
          </div>
        ) : (
          filteredParties.map(party => {
            const boss = getBossById(party.bossName);
            const isHost = profile?.id === party.hostId;
            const isMember = party.members.some(member => member.id === profile?.id);
            const canJoin = !isMember && party.currentMembers < party.maxMembers && profile;

            return (
              <div key={party.id} className="maple-panel p-6 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{boss?.icon || '👹'}</div>
                    <div>
                      <h3 className="text-xl font-bold text-maple-dark flex items-center space-x-2">
                        <span>{party.bossName}</span>
                        {boss && (
                          <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getDifficultyBg(boss.difficulty)}`}>
                            {boss.difficulty.toUpperCase()}
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t.party.host}: {party.hostName} {isHost && <Crown className="inline w-4 h-4 text-yellow-500" />}
                      </p>
                    </div>
                  </div>
                  
                  {isHost && (
                    <button
                      onClick={() => handleDeleteParty(party.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Excluir party"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-maple-blue" />
                    <span>
                      {party.currentMembers}/{party.maxMembers} membros
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-maple-green" />
                    <span>{party.server}</span>
                  </div>
                  <div className="flex items-center space-x-2 col-span-2">
                    <Clock className="w-4 h-4 text-maple-orange" />
                    <span>{formatTime(party.scheduledTime)}</span>
                  </div>
                </div>

                {/* Description */}
                {party.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {party.description}
                    </p>
                  </div>
                )}

                {/* Requirements */}
                {party.requirements && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600">
                      <strong>{t.common.requirements}:</strong> {party.requirements}
                    </p>
                  </div>
                )}

                {/* Members */}
                {party.members.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-maple-dark mb-2">{t.party.members}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {party.members.map(member => (
                        <div key={member.id} className="flex items-center space-x-2 text-xs bg-maple-light p-2 rounded">
                          <div className="text-lg">
                            {member.id === party.hostId ? '👑' : '⚔️'}
                          </div>
                          <div>
                            <div className="font-bold">{member.name}</div>
                            <div className="text-gray-600">Lv.{member.level} {member.job}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  {canJoin ? (
                    <button
                      onClick={() => handleJoinParty(party.id)}
                      className="maple-button flex-1 py-2 text-sm flex items-center justify-center space-x-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{t.party.joinParty}</span>
                    </button>
                  ) : isMember && !isHost ? (
                    <button
                      onClick={() => handleLeaveParty(party.id)}
                      className="maple-button flex-1 py-2 text-sm bg-red-500 hover:bg-red-600 flex items-center justify-center space-x-2"
                    >
                      <UserMinus className="w-4 h-4" />
                      <span>{t.party.leaveParty}</span>
                    </button>
                  ) : !profile ? (
                    <div className="flex-1 text-center text-sm text-gray-500 py-2">
    {t.party.createProfileFirst}
                    </div>
                  ) : party.currentMembers >= party.maxMembers ? (
                    <div className="flex-1 text-center text-sm text-red-500 py-2 font-bold">
  {t.party.partyFull}
                    </div>
                  ) : isMember ? (
                    <div className="flex-1 text-center text-sm text-green-600 py-2 font-bold">
  {t.party.youAreInParty}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

