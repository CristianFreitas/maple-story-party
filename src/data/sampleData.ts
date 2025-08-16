import { PartyListing } from '@/hooks/usePlayerSession';

export const sampleParties: PartyListing[] = [
  {
    id: 'sample-1',
    hostId: 'host-1',
    hostName: 'MapleHero123',
    bossName: 'Chaos Zakum',
    difficulty: 'chaos',
    currentMembers: 3,
    maxMembers: 6,
    scheduledTime: Date.now() + 3600000, // 1 hora no futuro
    server: 'Azera',
    requirements: 'Level 150+, boss experience',
    description: 'Daily Chaos Zakum farm! Experienced group, come with us!',
    createdAt: Date.now() - 1800000, // 30 minutos atrás
    members: [
      {
        id: 'host-1',
        name: 'MapleHero123',
        level: 180,
        job: 'Hero',
        joinedAt: Date.now() - 1800000,
      },
      {
        id: 'member-1',
        name: 'IceMage47',
        level: 175,
        job: 'Archmage (I/L)',
        joinedAt: Date.now() - 1200000,
      },
      {
        id: 'member-2',
        name: 'ShadowNinja88',
        level: 165,
        job: 'Night Lord',
        joinedAt: Date.now() - 600000,
      },
    ],
  },
  {
    id: 'sample-2',
    hostId: 'host-2',
    hostName: 'BossHunterPro',
    bossName: 'Hard Hilla',
    difficulty: 'hard',
    currentMembers: 4,
    maxMembers: 6,
    server: 'Bera',
    requirements: 'Level 170+, know mechanics',
    description: 'Weekly Hard Hilla run! Need more DPS. Coordinated and experienced group.',
    createdAt: Date.now() - 3600000, // 1 hora atrás
    members: [
      {
        id: 'host-2',
        name: 'BossHunterPro',
        level: 200,
        job: 'Paladin',
        joinedAt: Date.now() - 3600000,
      },
      {
        id: 'member-3',
        name: 'FireWizard99',
        level: 185,
        job: 'Archmage (F/P)',
        joinedAt: Date.now() - 2400000,
      },
      {
        id: 'member-4',
        name: 'HolyPriest',
        level: 178,
        job: 'Bishop',
        joinedAt: Date.now() - 1800000,
      },
      {
        id: 'member-5',
        name: 'DragonRider',
        level: 190,
        job: 'Aran',
        joinedAt: Date.now() - 900000,
      },
    ],
  },
  {
    id: 'sample-3',
    hostId: 'host-3',
    hostName: 'NewbieHelper',
    bossName: 'Zakum',
    difficulty: 'normal',
    currentMembers: 2,
    maxMembers: 6,
    server: 'Scania',
    requirements: 'Level 110+, beginners welcome!',
    description: 'Teaching Zakum mechanics to newbies! Educational and friendly party. 😊',
    createdAt: Date.now() - 900000, // 15 minutos atrás
    members: [
      {
        id: 'host-3',
        name: 'NewbieHelper',
        level: 220,
        job: 'Luminous',
        joinedAt: Date.now() - 900000,
      },
      {
        id: 'member-6',
        name: 'LevelUp123',
        level: 115,
        job: 'Demon Slayer',
        joinedAt: Date.now() - 300000,
      },
    ],
  },
  {
    id: 'sample-4',
    hostId: 'host-4',
    hostName: 'Magnus_Master',
    bossName: 'Hard Magnus',
    difficulty: 'extreme',
    currentMembers: 5,
    maxMembers: 6,
    scheduledTime: Date.now() + 7200000, // 2 horas no futuro
    server: 'Windia',
    requirements: 'Level 180+, LOTS of experience required!',
    description: 'Hard Magnus serious run! Only very experienced players. Goal: sub 10min clear.',
    createdAt: Date.now() - 2700000, // 45 minutos atrás
    members: [
      {
        id: 'host-4',
        name: 'Magnus_Master',
        level: 250,
        job: 'Adele',
        joinedAt: Date.now() - 2700000,
      },
      {
        id: 'member-7',
        name: 'BowMaster_Elite',
        level: 235,
        job: 'Bowmaster',
        joinedAt: Date.now() - 2100000,
      },
      {
        id: 'member-8',
        name: 'KannaSupport',
        level: 210,
        job: 'Kanna',
        joinedAt: Date.now() - 1800000,
      },
      {
        id: 'member-9',
        name: 'NightLord_Pro',
        level: 240,
        job: 'Night Lord',
        joinedAt: Date.now() - 1200000,
      },
      {
        id: 'member-10',
        name: 'HeroOfMaple',
        level: 225,
        job: 'Hero',
        joinedAt: Date.now() - 600000,
      },
    ],
  },
  {
    id: 'sample-5',
    hostId: 'host-5',
    hostName: 'PinkBeanFan',
    bossName: 'Pink Bean',
    difficulty: 'normal',
    currentMembers: 1,
    maxMembers: 6,
    server: 'Luna',
    requirements: 'Level 140+, good humor required!',
    description: 'Pink Bean cute run! 🌸 Relaxed party to get the cute pet. All welcome!',
    createdAt: Date.now() - 600000, // 10 minutos atrás
    members: [
      {
        id: 'host-5',
        name: 'PinkBeanFan',
        level: 155,
        job: 'Angelic Buster',
        joinedAt: Date.now() - 600000,
      },
    ],
  },
  {
    id: 'sample-6',
    hostId: 'host-6',
    hostName: 'CygnusLoyalist',
    bossName: 'Cygnus',
    difficulty: 'normal',
    currentMembers: 4,
    maxMembers: 6,
    scheduledTime: Date.now() + 1800000, // 30 minutos no futuro
    server: 'Brennan',
    requirements: 'Level 165+, respect the Empress!',
    description: 'Weekly Cygnus for Glory! Respectful and organized group. For Ereve! 👑',
    createdAt: Date.now() - 1200000, // 20 minutos atrás
    members: [
      {
        id: 'host-6',
        name: 'CygnusLoyalist',
        level: 170,
        job: 'Dawn Warrior',
        joinedAt: Date.now() - 1200000,
      },
      {
        id: 'member-11',
        name: 'ThunderBolt',
        level: 168,
        job: 'Thunder Breaker',
        joinedAt: Date.now() - 900000,
      },
      {
        id: 'member-12',
        name: 'WindStorm',
        level: 172,
        job: 'Wind Archer',
        joinedAt: Date.now() - 600000,
      },
      {
        id: 'member-13',
        name: 'FlameWizard',
        level: 165,
        job: 'Blaze Wizard',
        joinedAt: Date.now() - 300000,
      },
    ],
  },
];

// Função para carregar dados de exemplo no localStorage
export function loadSampleData() {
  try {
    const existingParties = localStorage.getItem('maplePartyListings');
    if (!existingParties || JSON.parse(existingParties).length === 0) {
      localStorage.setItem('maplePartyListings', JSON.stringify(sampleParties));
      console.log('✨ Dados de exemplo carregados!');
      // Força um reload da página para atualizar os dados
      window.dispatchEvent(new Event('storage'));
    }
  } catch (error) {
    console.error('Erro ao carregar dados de exemplo:', error);
    // Em caso de erro, força o carregamento
    localStorage.setItem('maplePartyListings', JSON.stringify(sampleParties));
    console.log('✨ Dados de exemplo carregados (fallback)!');
  }
}

