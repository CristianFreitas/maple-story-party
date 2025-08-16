'use client';

// Wallet connection temporarily removed
// import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePlayerSession } from '@/hooks/usePlayerSession';
import { useLanguage } from '@/contexts/LanguageContext';
import { Crown, Users, LogOut, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { PlayerProfileModal } from './PlayerProfileModal';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ReputationBadge } from './ReputationBadge';
import { ProfileSyncModal } from './ProfileSyncModal';

export function Header() {
  const { profile, isLoggedIn, logout } = usePlayerSession();
  const { t } = useLanguage();
  const [showProfile, setShowProfile] = useState(false);
  const [showSync, setShowSync] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-maple shadow-maple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="text-2xl md:text-3xl">🍁</div>
              <div>
                <h1 className="text-lg md:text-2xl font-display font-bold text-white text-shadow">
                  {t.header.title}
                </h1>
                <p className="text-xs md:text-sm text-maple-light opacity-90 hidden sm:block">
                  {t.header.subtitle}
                </p>
              </div>
            </div>

            {/* Navigation & User Info */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Language Switcher */}
              <LanguageSwitcher />
              {isLoggedIn && profile ? (
                <>
                  <div className="flex items-center space-x-2 md:space-x-3 maple-panel p-2 md:p-3">
                    <div className="text-xl md:text-2xl">{profile.level >= 200 ? '👑' : '⚔️'}</div>
                    <div className="text-xs md:text-sm hidden sm:block">
                      <div className="font-bold text-maple-dark">{profile.name}</div>
                      <div className="text-maple-blue">Lv.{profile.level} {profile.job}</div>
                      <div className="mt-1">
                        <ReputationBadge reputation={profile.reputation || 100} size="sm" showLabel={false} />
                      </div>
                    </div>
                    <button
                      onClick={() => setShowProfile(true)}
                      className="maple-button px-2 md:px-3 py-1 text-sm"
                      title={t.header.editProfile}
                    >
                      <Crown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowSync(true)}
                      className="maple-button px-2 md:px-3 py-1 text-sm bg-green-500 hover:bg-green-600"
                      title="Sync Profile"
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={logout}
                      className="maple-button px-2 md:px-3 py-1 text-sm bg-red-500 hover:bg-red-600"
                      title={t.header.logout}
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="maple-panel p-2 md:p-3">
                  <div className="text-xs md:text-sm text-maple-dark mb-2 hidden md:block">
                    {t.header.createProfile}
                  </div>
                  <button
                    onClick={() => setShowProfile(true)}
                    className="maple-button px-4 md:px-6 py-2 text-sm bg-maple-orange hover:bg-orange-600 w-full"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {t.header.createProfile}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showProfile && (
        <PlayerProfileModal
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
      
      {showSync && (
        <ProfileSyncModal
          isOpen={showSync}
          onClose={() => setShowSync(false)}
        />
      )}
    </>
  );
}
