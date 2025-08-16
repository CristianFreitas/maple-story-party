'use client';

import { useState, useEffect } from 'react';
import { usePlayerSession } from '@/hooks/usePlayerSession';
import { useLanguage } from '@/contexts/LanguageContext';
import { jobs, servers } from '@/data/bosses';
import { X, Save, User } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ReputationBadge, ReputationHistory } from './ReputationBadge';

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlayerProfileModal({ isOpen, onClose }: PlayerProfileModalProps) {
  const { profile, createProfile, updateProfile } = usePlayerSession();
  const { t } = useLanguage();
  const { address } = useAccount();
  
  const [formData, setFormData] = useState({
    name: '',
    level: 100,
    job: '',
    server: '',
    favoriteClasses: [] as string[],
    preferredDifficulty: 'normal' as 'normal' | 'chaos' | 'hard' | 'extreme',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        level: profile.level,
        job: profile.job,
        server: profile.server,
        favoriteClasses: profile.favoriteClasses,
        preferredDifficulty: profile.preferredDifficulty,
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.job || !formData.server) {
      alert(t.profile.fillRequired);
      return;
    }

    const profileData = {
      ...formData,
      walletAddress: address,
    };

    if (profile) {
      updateProfile(profileData);
    } else {
      createProfile(profileData);
    }
    
    onClose();
  };

  const handleFavoriteClassToggle = (jobName: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteClasses: prev.favoriteClasses.includes(jobName)
        ? prev.favoriteClasses.filter(j => j !== jobName)
        : [...prev.favoriteClasses, jobName]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="maple-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6 text-maple-blue" />
              <div>
                <h2 className="text-2xl font-display font-bold text-maple-dark">
                  {profile ? t.profile.editProfile : t.profile.createProfile}
                </h2>
                {profile && (
                  <div className="mt-1">
                    <ReputationBadge reputation={profile.reputation || 100} size="sm" showProgress />
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Character Name */}
            <div>
              <label className="block text-sm font-bold text-maple-dark mb-2">
                {t.profile.characterNameRequired}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-maple-blue rounded-lg focus:outline-none focus:border-maple-orange"
                placeholder={t.profile.enterCharacterName}
                required
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-bold text-maple-dark mb-2">
                {t.profile.levelRequired}
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) || 100 }))}
                className="w-full px-4 py-2 border-2 border-maple-blue rounded-lg focus:outline-none focus:border-maple-orange"
                required
              />
            </div>

            {/* Job */}
            <div>
              <label className="block text-sm font-bold text-maple-dark mb-2">
                {t.profile.classRequired}
              </label>
              <select
                value={formData.job}
                onChange={(e) => setFormData(prev => ({ ...prev, job: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-maple-blue rounded-lg focus:outline-none focus:border-maple-orange"
                required
              >
                <option value="">{t.profile.selectClass}</option>
                {jobs.map(job => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
            </div>

            {/* Server */}
            <div>
              <label className="block text-sm font-bold text-maple-dark mb-2">
                {t.profile.serverRequired}
              </label>
              <select
                value={formData.server}
                onChange={(e) => setFormData(prev => ({ ...prev, server: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-maple-blue rounded-lg focus:outline-none focus:border-maple-orange"
                required
              >
                <option value="">{t.profile.selectServer}</option>
                {servers.map(server => (
                  <option key={server} value={server}>{server}</option>
                ))}
              </select>
            </div>

            {/* Dificuldade Preferida */}
            <div>
              <label className="block text-sm font-bold text-maple-dark mb-2">
                {t.profile.preferredDifficulty}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(['normal', 'chaos', 'hard', 'extreme'] as const).map(difficulty => (
                  <button
                    key={difficulty}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, preferredDifficulty: difficulty }))}
                    className={`px-4 py-2 rounded-lg border-2 font-bold text-sm transition-all ${
                      formData.preferredDifficulty === difficulty
                        ? 'border-maple-orange bg-maple-orange text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-maple-blue'
                    }`}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Classes Favoritas */}
            <div>
              <label className="block text-sm font-bold text-maple-dark mb-2">
                {t.profile.favoriteClassesOptional}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {jobs.map(job => (
                  <button
                    key={job}
                    type="button"
                    onClick={() => handleFavoriteClassToggle(job)}
                    className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                      formData.favoriteClasses.includes(job)
                        ? 'border-maple-green bg-maple-green text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-maple-blue'
                    }`}
                  >
                    {job}
                  </button>
                ))}
              </div>
            </div>

            {/* Wallet Info */}
            {address && (
              <div className="bg-maple-light p-3 rounded-lg">
                <p className="text-sm text-maple-dark">
                  <strong>{t.profile.walletConnected}</strong> {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:border-gray-400"
              >
{t.common.cancel}
              </button>
              <button
                type="submit"
                className="maple-button px-6 py-2 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{profile ? t.profile.updateProfile : t.profile.createProfile}</span>
              </button>
            </div>
          </form>

          {/* Reputation History */}
          {profile && profile.reputationHistory && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <ReputationHistory history={profile.reputationHistory} maxItems={5} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

