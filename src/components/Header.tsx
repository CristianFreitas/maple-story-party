'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePlayerSession } from '@/hooks/usePlayerSession';
import { useLanguage } from '@/contexts/LanguageContext';
import { Crown, Users, LogOut } from 'lucide-react';
import { useState } from 'react';
import { PlayerProfileModal } from './PlayerProfileModal';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const { profile, isLoggedIn, logout } = usePlayerSession();
  const { t } = useLanguage();
  const [showProfile, setShowProfile] = useState(false);

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
                    </div>
                    <button
                      onClick={() => setShowProfile(true)}
                      className="maple-button px-2 md:px-3 py-1 text-sm"
                      title={t.header.editProfile}
                    >
                      <Crown className="w-4 h-4" />
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
                    {t.header.connectWallet} {t.common.or} {t.header.createProfile.toLowerCase()}
                  </div>
                  <div className="flex space-x-1 md:space-x-2">
                    <ConnectButton.Custom>
                      {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        authenticationStatus,
                        mounted,
                      }) => {
                        const ready = mounted && authenticationStatus !== 'loading';
                        const connected =
                          ready &&
                          account &&
                          chain &&
                          (!authenticationStatus ||
                            authenticationStatus === 'authenticated');

                        return (
                          <div
                            {...(!ready && {
                              'aria-hidden': true,
                              'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                              },
                            })}
                          >
                            {(() => {
                              if (!connected) {
                                return (
                                  <button 
                                    onClick={openConnectModal} 
                                    type="button"
                                    className="maple-button px-2 md:px-4 py-2 text-xs md:text-sm"
                                  >
                                    <span className="hidden md:inline">{t.header.connectWallet}</span>
                                    <span className="md:hidden">{t.header.wallet}</span>
                                  </button>
                                );
                              }

                              if (chain.unsupported) {
                                return (
                                  <button 
                                    onClick={openChainModal} 
                                    type="button"
                                    className="maple-button px-4 py-2 text-sm bg-red-500"
                                  >
                                    Rede Errada
                                  </button>
                                );
                              }

                              return (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={openChainModal}
                                    className="maple-button px-3 py-2 text-sm"
                                    type="button"
                                  >
                                    {chain.hasIcon && (
                                      <div
                                        style={{
                                          background: chain.iconBackground,
                                          width: 12,
                                          height: 12,
                                          borderRadius: 999,
                                          overflow: 'hidden',
                                          marginRight: 4,
                                        }}
                                      >
                                        {chain.iconUrl && (
                                          <img
                                            alt={chain.name ?? 'Chain icon'}
                                            src={chain.iconUrl}
                                            style={{ width: 12, height: 12 }}
                                          />
                                        )}
                                      </div>
                                    )}
                                    {chain.name}
                                  </button>

                                  <button 
                                    onClick={openAccountModal} 
                                    type="button"
                                    className="maple-button px-4 py-2 text-sm"
                                  >
                                    {account.displayName}
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                        );
                      }}
                    </ConnectButton.Custom>
                    <button
                      onClick={() => setShowProfile(true)}
                      className="maple-button px-2 md:px-4 py-2 text-xs md:text-sm bg-maple-green"
                    >
                      <Users className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">{t.header.createProfile}</span>
                      <span className="md:hidden">{t.header.profile}</span>
                    </button>
                  </div>
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
    </>
  );
}
