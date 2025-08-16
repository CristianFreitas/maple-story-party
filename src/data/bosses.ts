export interface Boss {
  id: string;
  name: string;
  difficulty: 'normal' | 'chaos' | 'hard' | 'extreme';
  level: number;
  maxPartySize: number;
  estimatedTime: string;
  description: string;
  rewards: string[];
  requirements?: string;
  icon: string;
  color: string;
}

export const bosses: Boss[] = [
  {
    id: 'zakum',
    name: 'Zakum',
    difficulty: 'normal',
    level: 110,
    maxPartySize: 6,
    estimatedTime: '15-20 min',
    description: 'Um dos bosses clássicos do MapleStory. Perfeito para iniciantes!',
    rewards: ['Zakum Helmet', 'Face Accessory', 'Eye Accessory'],
    requirements: 'Level 110+',
    icon: '🌋',
    color: '#E74C3C',
  },
  {
    id: 'chaos-zakum',
    name: 'Chaos Zakum',
    difficulty: 'chaos',
    level: 140,
    maxPartySize: 6,
    estimatedTime: '25-30 min',
    description: 'Versão mais poderosa do Zakum com mecânicas mais complexas.',
    rewards: ['Chaos Zakum Helmet', 'Superior Face/Eye Accessory'],
    requirements: 'Level 140+, clear Normal Zakum',
    icon: '🌋',
    color: '#9B59B6',
  },
  {
    id: 'horntail',
    name: 'Horntail',
    difficulty: 'normal',
    level: 130,
    maxPartySize: 6,
    estimatedTime: '30-40 min',
    description: 'Dragão lendário com múltiplas cabeças e fases desafiadoras.',
    rewards: ['Horntail Necklace', 'Dragon Equipment'],
    requirements: 'Level 130+',
    icon: '🐉',
    color: '#27AE60',
  },
  {
    id: 'chaos-horntail',
    name: 'Chaos Horntail',
    difficulty: 'chaos',
    level: 160,
    maxPartySize: 6,
    estimatedTime: '45-60 min',
    description: 'Versão extremamente poderosa do Horntail com ataques devastadores.',
    rewards: ['Chaos Horntail Necklace', 'Superior Dragon Equipment'],
    requirements: 'Level 160+, clear Normal Horntail',
    icon: '🐉',
    color: '#9B59B6',
  },
  {
    id: 'hilla',
    name: 'Hilla',
    difficulty: 'normal',
    level: 120,
    maxPartySize: 6,
    estimatedTime: '20-25 min',
    description: 'Necromante poderosa com habilidades de magia negra.',
    rewards: ['Hilla Pet', 'Necromancer Equipment'],
    requirements: 'Level 120+',
    icon: '💀',
    color: '#8B4513',
  },
  {
    id: 'hard-hilla',
    name: 'Hard Hilla',
    difficulty: 'hard',
    level: 170,
    maxPartySize: 6,
    estimatedTime: '30-40 min',
    description: 'Versão muito mais difícil da Hilla com mecânicas mortais.',
    rewards: ['Hard Hilla Pet', 'Superior Necromancer Equipment'],
    requirements: 'Level 170+, clear Normal Hilla',
    icon: '💀',
    color: '#4A90E2',
  },
  {
    id: 'pink-bean',
    name: 'Pink Bean',
    difficulty: 'normal',
    level: 140,
    maxPartySize: 6,
    estimatedTime: '25-35 min',
    description: 'Boss peculiar e divertido com aparência fofa mas poderes devastadores.',
    rewards: ['Pink Bean Pet', 'Pink Equipment'],
    requirements: 'Level 140+',
    icon: '🌸',
    color: '#FF69B4',
  },
  {
    id: 'chaos-pink-bean',
    name: 'Chaos Pink Bean',
    difficulty: 'chaos',
    level: 170,
    maxPartySize: 6,
    estimatedTime: '40-50 min',
    description: 'Pink Bean enfurecido com poderes caóticos aumentados.',
    rewards: ['Chaos Pink Bean Pet', 'Superior Pink Equipment'],
    requirements: 'Level 170+, clear Normal Pink Bean',
    icon: '🌸',
    color: '#9B59B6',
  },
  {
    id: 'cygnus',
    name: 'Cygnus',
    difficulty: 'normal',
    level: 165,
    maxPartySize: 6,
    estimatedTime: '35-45 min',
    description: 'Imperatriz dos Cygnus Knights com poderes de luz celestial.',
    rewards: ['Cygnus Equipment', 'Light Crystal'],
    requirements: 'Level 165+',
    icon: '👑',
    color: '#F1C40F',
  },
  {
    id: 'easy-magnus',
    name: 'Easy Magnus',
    difficulty: 'normal',
    level: 115,
    maxPartySize: 6,
    estimatedTime: '20-30 min',
    description: 'Comandante do Exército Negro em sua forma mais acessível.',
    rewards: ['Magnus Coin', 'Nova Equipment'],
    requirements: 'Level 115+',
    icon: '⚔️',
    color: '#2C3E50',
  },
  {
    id: 'normal-magnus',
    name: 'Normal Magnus',
    difficulty: 'hard',
    level: 155,
    maxPartySize: 6,
    estimatedTime: '40-50 min',
    description: 'Versão completa do Magnus com todas as suas mecânicas mortais.',
    rewards: ['Magnus Badge', 'Superior Nova Equipment'],
    requirements: 'Level 155+, clear Easy Magnus',
    icon: '⚔️',
    color: '#4A90E2',
  },
  {
    id: 'hard-magnus',
    name: 'Hard Magnus',
    difficulty: 'extreme',
    level: 180,
    maxPartySize: 6,
    estimatedTime: '60+ min',
    description: 'A forma mais poderosa do Magnus. Apenas para os mais experientes!',
    rewards: ['Tyrant Equipment', 'Magnus Soul'],
    requirements: 'Level 180+, clear Normal Magnus',
    icon: '⚔️',
    color: '#F39C12',
  },
  {
    id: 'von-leon',
    name: 'Von Leon',
    difficulty: 'normal',
    level: 125,
    maxPartySize: 6,
    estimatedTime: '25-35 min',
    description: 'Rei Leão caído com sede de vingança.',
    rewards: ['Royal Equipment', 'Lion King Items'],
    requirements: 'Level 125+',
    icon: '🦁',
    color: '#D4AF37',
  },
  {
    id: 'hard-von-leon',
    name: 'Hard Von Leon',
    difficulty: 'hard',
    level: 155,
    maxPartySize: 6,
    estimatedTime: '40-50 min',
    description: 'Von Leon em sua forma mais furiosa e poderosa.',
    rewards: ['Superior Royal Equipment', 'Lion King Soul'],
    requirements: 'Level 155+, clear Normal Von Leon',
    icon: '🦁',
    color: '#4A90E2',
  },
  {
    id: 'arkarium',
    name: 'Arkarium',
    difficulty: 'normal',
    level: 140,
    maxPartySize: 6,
    estimatedTime: '30-40 min',
    description: 'Mago das trevas com poderes de manipulação temporal.',
    rewards: ['Arkarium Equipment', 'Dark Magic Items'],
    requirements: 'Level 140+',
    icon: '🔮',
    color: '#663399',
  },
];

export const getAvailableBosses = () => bosses;

export const getBossByDifficulty = (difficulty: Boss['difficulty']) => 
  bosses.filter(boss => boss.difficulty === difficulty);

export const getBossById = (id: string) => 
  bosses.find(boss => boss.id === id);

export const servers = [
  'Azera',
  'Brennan',
  'Elysium',
  'Luna',
  'Red',
  'Aurora',
  'Bera',
  'Scania',
  'Windia',
  'Khaini',
  'Yellonde',
  'Demethos',
  'Galicia',
  'El Nido',
  'Zenith',
  'Croa',
  'Mardia',
];

export const jobs = [
  // Warriors
  'Hero', 'Paladin', 'Dark Knight',
  'Aran', 'Demon Slayer', 'Demon Avenger',
  'Kaiser', 'Hayato', 'Zero', 'Mihile',
  
  // Magicians
  'Archmage (I/L)', 'Archmage (F/P)', 'Bishop',
  'Evan', 'Luminous', 'Battle Mage',
  'Beast Tamer', 'Kinesis', 'Illium',
  
  // Bowmen
  'Bowmaster', 'Marksman', 'Mercedes',
  'Wild Hunter', 'Wind Archer', 'Kanna',
  
  // Thieves
  'Night Lord', 'Shadower', 'Dual Blade',
  'Phantom', 'Xenon', 'Cadena', 'Hoyoung',
  
  // Pirates
  'Buccaneer', 'Corsair', 'Cannoneer',
  'Jett', 'Thunder Breaker', 'Shade',
  'Mechanic', 'Blaster', 'Ark',
  
  // Others
  'Angelic Buster', 'Adele', 'Kain',
  'Lara', 'Khali'
];

