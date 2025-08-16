'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { PartyList } from '@/components/PartyList';
import { CreatePartyModal } from '@/components/CreatePartyModal';
import { SampleDataLoader } from '@/components/SampleDataLoader';
import { BossGuide } from '@/components/BossGuide';
import { BuffScheduler } from '@/components/BuffScheduler';
import { usePlayerSession } from '@/hooks/usePlayerSession';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Crown, Users, Trophy, Sparkles, Calendar, Swords } from 'lucide-react';

export default function Home() {
  const [showCreateParty, setShowCreateParty] = useState(false);
  const [activeTab, setActiveTab] = useState<'parties' | 'buffs' | 'guide'>('parties');
  const { profile, parties, myParties } = usePlayerSession();
  const { t } = useLanguage();

  const myPartiesData = parties.filter(party => myParties.includes(party.id));
  const totalParties = parties.length;
  const activePlayers = new Set(parties.flatMap(party => party.members.map(member => member.id))).size;

  return (
    <div className="min-h-screen">
      <SampleDataLoader />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="text-6xl animate-bounce-slow">🍁</div>
            <div>
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white text-shadow mb-2">
                {t.home.heroTitle}
              </h1>
              <p className="text-xl text-maple-light">
                {t.home.heroSubtitle}
              </p>
            </div>
            <div className="text-6xl animate-bounce-slow">⚔️</div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="maple-panel p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-maple-blue mr-2" />
                <span className="text-3xl font-bold text-maple-dark">{totalParties}</span>
              </div>
              <h3 className="font-bold text-maple-dark">{t.home.activeParties}</h3>
              <p className="text-sm text-gray-600">{t.home.readyForBattle}</p>
            </div>
            
            <div className="maple-panel p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-maple-green mr-2" />
                <span className="text-3xl font-bold text-maple-dark">{activePlayers}</span>
              </div>
              <h3 className="font-bold text-maple-dark">{t.home.activePlayers}</h3>
              <p className="text-sm text-gray-600">{t.home.connectedNow}</p>
            </div>
            
            <div className="maple-panel p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Trophy className="w-8 h-8 text-maple-gold mr-2" />
                <span className="text-3xl font-bold text-maple-dark">{myPartiesData.length}</span>
              </div>
              <h3 className="font-bold text-maple-dark">{t.home.yourParties}</h3>
              <p className="text-sm text-gray-600">{t.home.participateMore}</p>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        {!profile && (
          <div className="maple-panel p-8 text-center mb-8">
            <div className="text-5xl mb-4">🎮</div>
            <h2 className="text-2xl font-display font-bold text-maple-dark mb-4">
              {t.home.welcomeTitle}
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              {t.home.welcomeDescription}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="bg-maple-light p-4 rounded-lg">
                <Crown className="w-8 h-8 text-maple-orange mx-auto mb-2" />
                <h3 className="font-bold text-maple-dark mb-1">{t.home.createPartiesTitle}</h3>
                <p className="text-sm text-gray-600">{t.home.createPartiesDesc}</p>
              </div>
              <div className="bg-maple-light p-4 rounded-lg">
                <Users className="w-8 h-8 text-maple-blue mx-auto mb-2" />
                <h3 className="font-bold text-maple-dark mb-1">{t.home.findPlayersTitle}</h3>
                <p className="text-sm text-gray-600">{t.home.findPlayersDesc}</p>
              </div>
              <div className="bg-maple-light p-4 rounded-lg">
                <Sparkles className="w-8 h-8 text-maple-purple mx-auto mb-2" />
                <h3 className="font-bold text-maple-dark mb-1">{t.home.defeatBossesTitle}</h3>
                <p className="text-sm text-gray-600">{t.home.defeatBossesDesc}</p>
              </div>
            </div>
          </div>
        )}

        {/* My Parties Section */}
        {profile && myPartiesData.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-display font-bold text-white mb-6 flex items-center">
              <Crown className="w-8 h-8 text-maple-gold mr-3" />
              {t.home.yourParties}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myPartiesData.map(party => {
                const isHost = party.hostId === profile.id;
                return (
                  <div key={party.id} className="maple-panel p-6 border-l-4 border-maple-gold">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">👹</span>
                        <h3 className="text-xl font-bold text-maple-dark">{party.bossName}</h3>
                        {isHost && <Crown className="w-5 h-5 text-yellow-500" />}
                      </div>
                      <span className="text-sm text-gray-600">{party.server}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{party.currentMembers}/{party.maxMembers} membros</span>
                      <span>{isHost ? t.home.youAreHost : t.home.member}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <button
              onClick={() => setActiveTab('parties')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'parties'
                  ? 'bg-maple-blue text-white shadow-lg'
                  : 'text-maple-dark hover:bg-maple-light'
              }`}
            >
              <Swords className="w-5 h-5" />
              Boss Parties
            </button>
            <button
              onClick={() => setActiveTab('buffs')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'buffs'
                  ? 'bg-maple-purple text-white shadow-lg'
                  : 'text-maple-dark hover:bg-maple-light'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Buff Schedule
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'guide'
                  ? 'bg-maple-orange text-white shadow-lg'
                  : 'text-maple-dark hover:bg-maple-light'
              }`}
            >
              <Shield className="w-5 h-5" />
              Boss Guide
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'parties' && (
          <>
            {/* Debug Button (temporário) */}
            {parties.length === 0 && (
              <div className="mb-4 text-center">
                <button
                  onClick={() => {
                    const { loadSampleData } = require('@/data/sampleData');
                    loadSampleData();
                    window.location.reload();
                  }}
                  className="maple-button px-4 py-2 text-sm bg-maple-orange"
                >
                  🔧 Carregar Dados de Exemplo (Debug)
                </button>
              </div>
            )}
            <PartyList onCreateParty={() => setShowCreateParty(true)} />
          </>
        )}

        {activeTab === 'buffs' && <BuffScheduler />}

        {activeTab === 'guide' && <BossGuide />}
      </main>

      {/* Footer */}
      <footer className="bg-maple-dark text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <span className="text-2xl">🍁</span>
            <span className="text-lg font-display font-bold">MapleStory Party Finder</span>
            <span className="text-2xl">⚔️</span>
          </div>
          <p className="text-maple-light text-sm">
            {t.home.createdBy} MapleStory Community • {t.home.communityFooter}
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <a href="#" className="text-maple-light hover:text-white transition-colors">
              Discord
            </a>
            <a href="#" className="text-maple-light hover:text-white transition-colors">
              Reddit
            </a>
            <a href="#" className="text-maple-light hover:text-white transition-colors">
              Feedback
            </a>
          </div>
        </div>
      </footer>

      {/* Create Party Modal */}
      <CreatePartyModal
        isOpen={showCreateParty}
        onClose={() => setShowCreateParty(false)}
      />
    </div>
  );
}
