'use client';

import { useState } from 'react';
import { getAvailableBosses, Boss } from '@/data/bosses';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown, ChevronUp, Clock, Users, Shield, Trophy, Info } from 'lucide-react';

export function BossGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const { t } = useLanguage();
  
  const bosses = getAvailableBosses();
  const filteredBosses = selectedDifficulty === 'all' 
    ? bosses 
    : bosses.filter(boss => boss.difficulty === selectedDifficulty);

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

  if (!isOpen) {
    return (
      <div className="mb-8">
        <button
          onClick={() => setIsOpen(true)}
          className="maple-button w-full py-3 flex items-center justify-center space-x-2"
        >
          <Info className="w-5 h-5" />
          <span>{t.bossGuide.title}</span>
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="maple-panel">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">📚</div>
              <h2 className="text-2xl font-display font-bold text-maple-dark">
                {t.bossGuide.title}
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
          </div>

          {/* Difficulty Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDifficulty('all')}
                className={`px-4 py-2 rounded-lg border-2 font-bold text-sm transition-all ${
                  selectedDifficulty === 'all'
                    ? 'border-maple-orange bg-maple-orange text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-maple-blue'
                }`}
              >
{t.party.all}
              </button>
              {(['normal', 'chaos', 'hard', 'extreme'] as const).map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-lg border-2 font-bold text-sm transition-all ${
                    selectedDifficulty === difficulty
                      ? 'border-maple-orange bg-maple-orange text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-maple-blue'
                  }`}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Boss List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBosses.map(boss => (
              <div key={boss.id} className="bg-white rounded-lg border-2 border-maple-blue p-4 hover:shadow-lg transition-shadow">
                {/* Boss Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{boss.icon}</span>
                    <div>
                      <h3 className="font-bold text-maple-dark">{boss.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getDifficultyBg(boss.difficulty)}`}>
                        {boss.difficulty.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-maple-dark">Lv.{boss.level}</div>
                  </div>
                </div>

                {/* Boss Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-maple-blue" />
                    <span>{t.bossGuide.maxPlayers} {boss.maxPartySize}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-maple-orange" />
                    <span>{boss.estimatedTime}</span>
                  </div>
                  {boss.requirements && (
                    <div className="flex items-start space-x-2 text-sm">
                      <Shield className="w-4 h-4 text-maple-green mt-0.5" />
                      <span className="text-gray-600">{boss.requirements}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4">
                  {boss.description}
                </p>

                {/* Rewards */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy className="w-4 h-4 text-maple-gold" />
                    <span className="text-sm font-bold text-maple-dark">{t.bossGuide.rewards}:</span>
                  </div>
                  <div className="space-y-1">
                    {boss.rewards.map((reward, index) => (
                      <div key={index} className="text-xs bg-maple-light px-2 py-1 rounded">
                        • {reward}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBosses.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-600">
                {t.bossGuide.noBossesFound}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

