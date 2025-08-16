'use client';

import React from 'react';
import { Star, TrendingUp, TrendingDown, Shield, Award } from 'lucide-react';

interface ReputationBadgeProps {
  reputation: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showProgress?: boolean;
}

export function ReputationBadge({ reputation, size = 'md', showLabel = true, showProgress = false }: ReputationBadgeProps) {
  const getReputationLevel = (rep: number) => {
    if (rep >= 180) return { 
      level: 'Legendary', 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-100', 
      border: 'border-yellow-300',
      icon: Award,
      gradient: 'from-yellow-400 to-yellow-600'
    };
    if (rep >= 150) return { 
      level: 'Excellent', 
      color: 'text-purple-500', 
      bg: 'bg-purple-100', 
      border: 'border-purple-300',
      icon: Shield,
      gradient: 'from-purple-400 to-purple-600'
    };
    if (rep >= 120) return { 
      level: 'Good', 
      color: 'text-green-500', 
      bg: 'bg-green-100', 
      border: 'border-green-300',
      icon: TrendingUp,
      gradient: 'from-green-400 to-green-600'
    };
    if (rep >= 80) return { 
      level: 'Average', 
      color: 'text-blue-500', 
      bg: 'bg-blue-100', 
      border: 'border-blue-300',
      icon: Star,
      gradient: 'from-blue-400 to-blue-600'
    };
    if (rep >= 50) return { 
      level: 'Poor', 
      color: 'text-orange-500', 
      bg: 'bg-orange-100', 
      border: 'border-orange-300',
      icon: TrendingDown,
      gradient: 'from-orange-400 to-orange-600'
    };
    return { 
      level: 'Terrible', 
      color: 'text-red-500', 
      bg: 'bg-red-100', 
      border: 'border-red-300',
      icon: TrendingDown,
      gradient: 'from-red-400 to-red-600'
    };
  };

  const reputationInfo = getReputationLevel(reputation);
  const IconComponent = reputationInfo.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  // Calculate progress to next level
  const getProgressToNext = (rep: number) => {
    const levels = [0, 50, 80, 120, 150, 180, 200];
    const currentLevelIndex = levels.findIndex(level => rep < level) - 1;
    
    if (currentLevelIndex === -1 || currentLevelIndex === levels.length - 2) {
      return { current: rep, max: 200, percentage: 100 };
    }

    const currentLevel = levels[currentLevelIndex];
    const nextLevel = levels[currentLevelIndex + 1];
    const progress = rep - currentLevel;
    const total = nextLevel - currentLevel;
    const percentage = (progress / total) * 100;

    return { current: progress, max: total, percentage };
  };

  const progress = getProgressToNext(reputation);

  return (
    <div className="flex items-center gap-2">
      <div className={`
        inline-flex items-center gap-1.5 rounded-full border
        ${reputationInfo.bg} ${reputationInfo.border} ${reputationInfo.color}
        ${sizeClasses[size]}
        font-medium shadow-sm
      `}>
        <IconComponent className={iconSizes[size]} />
        <span>{reputation}</span>
        {showLabel && (
          <span className="hidden sm:inline">
            {reputationInfo.level}
          </span>
        )}
      </div>

      {showProgress && (
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>{reputationInfo.level}</span>
            <span>{Math.round(progress.percentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${reputationInfo.gradient} transition-all duration-300`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface ReputationHistoryProps {
  history: Array<{
    id: string;
    change: number;
    reason: string;
    fromPlayer?: string;
    timestamp: number;
  }>;
  maxItems?: number;
}

export function ReputationHistory({ history, maxItems = 10 }: ReputationHistoryProps) {
  const sortedHistory = [...history]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, maxItems);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Recent Reputation Changes</h3>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {sortedHistory.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No reputation changes yet</p>
        ) : (
          sortedHistory.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between text-xs bg-gray-50 rounded p-2">
              <div className="flex-1 min-w-0">
                <p className="text-gray-700 truncate">{entry.reason}</p>
                {entry.fromPlayer && (
                  <p className="text-gray-500 text-xs">from {entry.fromPlayer}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-gray-500">{formatTime(entry.timestamp)}</span>
                <span className={`font-medium ${
                  entry.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {entry.change > 0 ? '+' : ''}{entry.change}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
