export interface Translation {
  // Header
  header: {
    title: string;
    subtitle: string;
    connectWallet: string;
    createProfile: string;
    editProfile: string;
    logout: string;
    profile: string;
    wallet: string;
  };

  // Navigation
  nav: {
    home: string;
    bossGuide: string;
    myParties: string;
    createParty: string;
  };

  // Common
  common: {
    level: string;
    server: string;
    difficulty: string;
    members: string;
    maxMembers: string;
    requirements: string;
    description: string;
    rewards: string;
    estimatedTime: string;
    scheduledTime: string;
    flexibleTime: string;
    save: string;
    cancel: string;
    create: string;
    edit: string;
    delete: string;
    join: string;
    leave: string;
    close: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
          info: string;
      or: string;
  };

  // Home page
  home: {
    heroTitle: string;
    heroSubtitle: string;
    activeParties: string;
    activePlayers: string;
    yourParties: string;
    readyForBattle: string;
    connectedNow: string;
    participateMore: string;
    welcomeTitle: string;
    welcomeDescription: string;
    createPartiesTitle: string;
    createPartiesDesc: string;
    findPlayersTitle: string;
    findPlayersDesc: string;
    defeatBossesTitle: string;
    defeatBossesDesc: string;
    youAreHost: string;
    member: string;
    createdBy: string;
    communityFooter: string;
  };

  // Party system
  party: {
    partiesActive: string;
    findOrCreateParty: string;
    createParty: string;
    createNewParty: string;
    noPartiesFound: string;
    noPartiesDescription: string;
    createFirstParty: string;
    joinParty: string;
    leaveParty: string;
    partyFull: string;
    youAreInParty: string;
    createProfileFirst: string;
    selectBoss: string;
    selectServer: string;
    maxMembersLabel: string;
    scheduledTimeLabel: string;
    scheduledTimeOptional: string;
    requirementsOptional: string;
    descriptionOptional: string;
    hostInfo: string;
    hostInfoDesc: string;
    members: string;
    host: string;
    deleteParty: string;
    confirmDelete: string;
    filters: string;
    all: string;
    filterByServer: string;
    filterByBoss: string;
    requirementsExample: string;
    descriptionPlaceholder: string;
    leaveEmpty: string;
    supportsBoss: string;
  };

  // Profile
  profile: {
    createProfile: string;
    editProfile: string;
    profileRequired: string;
    profileRequiredDesc: string;
    understood: string;
    characterName: string;
    characterNameRequired: string;
    enterCharacterName: string;
    levelRequired: string;
    classRequired: string;
    selectClass: string;
    serverRequired: string;
    selectServer: string;
    preferredDifficulty: string;
    favoriteClasses: string;
    favoriteClassesOptional: string;
    walletConnected: string;
    updateProfile: string;
    createProfile: string;
    fillRequired: string;
  };

  // Boss guide
  bossGuide: {
    title: string;
    showGuide: string;
    hideGuide: string;
    filterByDifficulty: string;
    noBossesFound: string;
    maxPlayers: string;
    estimatedTime: string;
    requirements: string;
    rewards: string;
  };

  // Difficulties
  difficulties: {
    normal: string;
    chaos: string;
    hard: string;
    extreme: string;
  };

  // Sample data
  sampleData: {
    descriptions: {
      chaosZakum: string;
      hardHilla: string;
      normalZakum: string;
      hardMagnus: string;
      pinkBean: string;
      cygnus: string;
    };
    requirements: {
      experienced: string;
      knowMechanics: string;
      beginnersWelcome: string;
      veryExperienced: string;
      goodHumor: string;
      respectEmpress: string;
    };
  };

  // Errors and messages
  messages: {
    profileNeeded: string;
    fillAllFields: string;
    partyCreated: string;
    joinedParty: string;
    leftParty: string;
    partyDeleted: string;
    errorOccurred: string;
  };

  // Footer
  footer: {
    createdBy: string;
    findPerfectParty: string;
    discord: string;
    reddit: string;
    feedback: string;
  };
}

export const translations: Record<'en' | 'pt', Translation> = {
  en: {
    header: {
      title: "Maple Party",
      subtitle: "Find your boss party!",
      connectWallet: "Connect Wallet",
      createProfile: "Create Profile",
      editProfile: "Edit Profile",
      logout: "Logout",
      profile: "Profile",
      wallet: "Wallet",
    },
    nav: {
      home: "Home",
      bossGuide: "Boss Guide",
      myParties: "My Parties",
      createParty: "Create Party",
    },
    common: {
      level: "Level",
      server: "Server",
      difficulty: "Difficulty",
      members: "members",
      maxMembers: "Max Members",
      requirements: "Requirements",
      description: "Description",
      rewards: "Rewards",
      estimatedTime: "Estimated Time",
      scheduledTime: "Scheduled Time",
      flexibleTime: "Flexible time",
      save: "Save",
      cancel: "Cancel",
      create: "Create",
      edit: "Edit",
      delete: "Delete",
      join: "Join",
      leave: "Leave",
      close: "Close",
      loading: "Loading",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Info",
      or: "or",
    },
    home: {
      heroTitle: "MapleStory Party Finder",
      heroSubtitle: "Find the perfect party to defeat the most challenging bosses!",
      activeParties: "Active Parties",
      activePlayers: "Active Players",
      yourParties: "Your Parties",
      readyForBattle: "Ready for battle!",
      connectedNow: "Connected now",
      participateMore: "Join more!",
      welcomeTitle: "Welcome to MapleStory Party Finder!",
      welcomeDescription: "Create your player profile and start finding parties to defeat MapleStory's most powerful bosses. Connect with other players, organize strategies and conquer the best rewards!",
      createPartiesTitle: "Create Parties",
      createPartiesDesc: "Be the leader and organize your own group",
      findPlayersTitle: "Find Players",
      findPlayersDesc: "Join existing groups",
      defeatBossesTitle: "Defeat Bosses",
      defeatBossesDesc: "Conquer the best rewards",
      youAreHost: "You are the host",
      member: "Member",
      createdBy: "Created by",
      communityFooter: "Created by MapleStory Community • Find your perfect party!",
    },
    party: {
      partiesActive: "🎯 Active Parties",
      findOrCreateParty: "Find or create a party to defeat bosses!",
      createParty: "Create Party",
      createNewParty: "Create New Party",
      noPartiesFound: "No parties found",
      noPartiesDescription: "Be the first to create a party for this boss!",
      createFirstParty: "Create First Party",
      joinParty: "Join Party",
      leaveParty: "Leave Party",
      partyFull: "Party Full",
      youAreInParty: "✓ You're in the party",
      createProfileFirst: "Create a profile to participate",
      selectBoss: "Boss",
      selectServer: "Server",
      maxMembersLabel: "Max Members",
      scheduledTimeLabel: "Scheduled Time (optional)",
      scheduledTimeOptional: "Scheduled Time (optional)",
      requirementsOptional: "Requirements (optional)",
      descriptionOptional: "Description (optional)",
      hostInfo: "👑 You will be the host of this party",
      hostInfoDesc: "Character",
      members: "Members:",
      host: "Host",
      deleteParty: "Delete party",
      confirmDelete: "Are you sure you want to delete this party?",
      filters: "Filters",
      all: "All",
      filterByServer: "Filter by server...",
      filterByBoss: "Filter by boss...",
      requirementsExample: "Ex: Level 180+, boss experience...",
      descriptionPlaceholder: "Party description, strategies, notes...",
      leaveEmpty: "Leave empty if time is flexible",
      supportsBoss: "This boss supports up to",
    },
    profile: {
      createProfile: "Create Profile",
      editProfile: "Edit Profile",
      profileRequired: "Profile Required",
      profileRequiredDesc: "You need to create a profile before creating a party!",
      understood: "Understood",
      characterName: "Character Name",
      characterNameRequired: "Character Name *",
      enterCharacterName: "Enter your character name",
      levelRequired: "Level *",
      classRequired: "Class *",
      selectClass: "Select your class",
      serverRequired: "Server *",
      selectServer: "Select your server",
      preferredDifficulty: "Preferred Difficulty",
      favoriteClasses: "Favorite Classes",
      favoriteClassesOptional: "Favorite Classes (optional)",
      walletConnected: "Connected Wallet:",
      updateProfile: "Update Profile",
      createProfile: "Create Profile",
      fillRequired: "Please fill in all required fields!",
    },
    bossGuide: {
      title: "📚 Boss Guide",
      showGuide: "Show Guide",
      hideGuide: "Hide Guide",
      filterByDifficulty: "Filter by difficulty",
      noBossesFound: "No bosses found for this difficulty.",
      maxPlayers: "Max:",
      estimatedTime: "Time:",
      requirements: "Requirements:",
      rewards: "Rewards:",
    },
    difficulties: {
      normal: "Normal",
      chaos: "Chaos",
      hard: "Hard",
      extreme: "Extreme",
    },
    sampleData: {
      descriptions: {
        chaosZakum: "Daily Chaos Zakum farm! Experienced group, come with us!",
        hardHilla: "Weekly Hard Hilla run! Need more DPS. Coordinated and experienced group.",
        normalZakum: "Teaching Zakum mechanics to newbies! Educational and friendly party. 😊",
        hardMagnus: "Hard Magnus serious run! Only very experienced players. Goal: sub 10min clear.",
        pinkBean: "Pink Bean cute run! 🌸 Relaxed party to get the cute pet. All welcome!",
        cygnus: "Weekly Cygnus for Glory! Respectful and organized group. For Ereve! 👑",
      },
      requirements: {
        experienced: "Level 150+, boss experience",
        knowMechanics: "Level 170+, know mechanics",
        beginnersWelcome: "Level 110+, beginners welcome!",
        veryExperienced: "Level 180+, LOTS of experience required!",
        goodHumor: "Level 140+, good humor required!",
        respectEmpress: "Level 165+, respect the Empress!",
      },
    },
    messages: {
      profileNeeded: "You need to create a profile first!",
      fillAllFields: "Please fill in all required fields!",
      partyCreated: "Party created successfully!",
      joinedParty: "Joined party successfully!",
      leftParty: "Left party successfully!",
      partyDeleted: "Party deleted successfully!",
      errorOccurred: "An error occurred. Please try again.",
    },
    footer: {
      createdBy: "Created by",
      findPerfectParty: "Find your perfect party!",
      discord: "Discord",
      reddit: "Reddit",
      feedback: "Feedback",
    },
  },
  pt: {
    header: {
      title: "Maple Party",
      subtitle: "Encontre sua party para boss!",
      connectWallet: "Conectar Wallet",
      createProfile: "Criar Perfil",
      editProfile: "Editar Perfil",
      logout: "Sair",
      profile: "Perfil",
      wallet: "Wallet",
    },
    nav: {
      home: "Início",
      bossGuide: "Guia de Bosses",
      myParties: "Minhas Parties",
      createParty: "Criar Party",
    },
    common: {
      level: "Level",
      server: "Servidor",
      difficulty: "Dificuldade",
      members: "membros",
      maxMembers: "Máximo de Membros",
      requirements: "Requisitos",
      description: "Descrição",
      rewards: "Recompensas",
      estimatedTime: "Tempo Estimado",
      scheduledTime: "Horário Agendado",
      flexibleTime: "Horário flexível",
      save: "Salvar",
      cancel: "Cancelar",
      create: "Criar",
      edit: "Editar",
      delete: "Excluir",
      join: "Entrar",
      leave: "Sair",
      close: "Fechar",
      loading: "Carregando",
      error: "Erro",
      success: "Sucesso",
      warning: "Aviso",
      info: "Info",
      or: "ou",
    },
    home: {
      heroTitle: "MapleStory Party Finder",
      heroSubtitle: "Encontre a party perfeita para derrotar os bosses mais desafiadores!",
      activeParties: "Parties Ativas",
      activePlayers: "Jogadores Ativos",
      yourParties: "Suas Parties",
      readyForBattle: "Prontas para batalha!",
      connectedNow: "Conectados agora",
      participateMore: "Participe de mais!",
      welcomeTitle: "Bem-vindo ao MapleStory Party Finder!",
      welcomeDescription: "Crie seu perfil de jogador e comece a encontrar parties para derrotar os bosses mais poderosos do MapleStory. Conecte com outros players, organize estratégias e conquiste as melhores recompensas!",
      createPartiesTitle: "Crie Parties",
      createPartiesDesc: "Seja o líder e organize seu próprio grupo",
      findPlayersTitle: "Encontre Players",
      findPlayersDesc: "Junte-se a grupos existentes",
      defeatBossesTitle: "Derrote Bosses",
      defeatBossesDesc: "Conquiste as melhores recompensas",
      youAreHost: "Você é o host",
      member: "Membro",
      createdBy: "Criado pela",
      communityFooter: "Criado pela comunidade MapleStory • Encontre sua party perfeita!",
    },
    party: {
      partiesActive: "🎯 Parties Ativas",
      findOrCreateParty: "Encontre ou crie uma party para derrotar bosses!",
      createParty: "Criar Party",
      createNewParty: "Criar Nova Party",
      noPartiesFound: "Nenhuma party encontrada",
      noPartiesDescription: "Seja o primeiro a criar uma party para este boss!",
      createFirstParty: "Criar Primera Party",
      joinParty: "Entrar na Party",
      leaveParty: "Sair da Party",
      partyFull: "Party Completa",
      youAreInParty: "✓ Você está na party",
      createProfileFirst: "Crie um perfil para participar",
      selectBoss: "Boss",
      selectServer: "Servidor",
      maxMembersLabel: "Máximo de Membros",
      scheduledTimeLabel: "Horário Agendado (opcional)",
      scheduledTimeOptional: "Horário Agendado (opcional)",
      requirementsOptional: "Requisitos (opcional)",
      descriptionOptional: "Descrição (opcional)",
      hostInfo: "👑 Você será o host desta party",
      hostInfoDesc: "Personagem",
      members: "Membros:",
      host: "Host",
      deleteParty: "Excluir party",
      confirmDelete: "Tem certeza que deseja excluir esta party?",
      filters: "Filtros",
      all: "Todas",
      filterByServer: "Filtrar por servidor...",
      filterByBoss: "Filtrar por boss...",
      requirementsExample: "Ex: Level 180+, experiência com o boss...",
      descriptionPlaceholder: "Descrição da party, estratégias, observações...",
      leaveEmpty: "Deixe vazio se o horário for flexível",
      supportsBoss: "Este boss suporta até",
    },
    profile: {
      createProfile: "Criar Perfil",
      editProfile: "Editar Perfil",
      profileRequired: "Perfil Necessário",
      profileRequiredDesc: "Você precisa criar um perfil antes de criar uma party!",
      understood: "Entendi",
      characterName: "Nome do Personagem",
      characterNameRequired: "Nome do Personagem *",
      enterCharacterName: "Digite o nome do seu personagem",
      levelRequired: "Level *",
      classRequired: "Classe *",
      selectClass: "Selecione sua classe",
      serverRequired: "Servidor *",
      selectServer: "Selecione seu servidor",
      preferredDifficulty: "Dificuldade Preferida",
      favoriteClasses: "Classes Favoritas",
      favoriteClassesOptional: "Classes Favoritas (opcional)",
      walletConnected: "Wallet Conectada:",
      updateProfile: "Atualizar Perfil",
      createProfile: "Criar Perfil",
      fillRequired: "Por favor, preencha todos os campos obrigatórios!",
    },
    bossGuide: {
      title: "📚 Guia de Bosses",
      showGuide: "Mostrar Guia",
      hideGuide: "Esconder Guia",
      filterByDifficulty: "Filtrar por dificuldade",
      noBossesFound: "Nenhum boss encontrado para esta dificuldade.",
      maxPlayers: "Máx:",
      estimatedTime: "Tempo:",
      requirements: "Requisitos:",
      rewards: "Recompensas:",
    },
    difficulties: {
      normal: "Normal",
      chaos: "Chaos",
      hard: "Hard",
      extreme: "Extreme",
    },
    sampleData: {
      descriptions: {
        chaosZakum: "Farm diário de Chaos Zakum! Grupo experiente, vem com a gente!",
        hardHilla: "Weekly Hard Hilla run! Precisamos de mais DPS. Grupo coordenado e experiente.",
        normalZakum: "Ensino as mecânicas do Zakum para novatos! Party educativa e friendly. 😊",
        hardMagnus: "Hard Magnus serious run! Apenas players muito experientes. Meta: sub 10min clear.",
        pinkBean: "Pink Bean cute run! 🌸 Party descontraída para pegar o pet fofo. All welcome!",
        cygnus: "Weekly Cygnus para Glory! Grupo respeitoso e organizado. For Ereve! 👑",
      },
      requirements: {
        experienced: "Level 150+, experiência com boss",
        knowMechanics: "Level 170+, conhecer mecânicas",
        beginnersWelcome: "Level 110+, iniciantes bem-vindos!",
        veryExperienced: "Level 180+, MUITA experiência necessária!",
        goodHumor: "Level 140+, bom humor obrigatório!",
        respectEmpress: "Level 165+, respeitar a Imperatriz!",
      },
    },
    messages: {
      profileNeeded: "Você precisa criar um perfil primeiro!",
      fillAllFields: "Por favor, preencha todos os campos obrigatórios!",
      partyCreated: "Party criada com sucesso!",
      joinedParty: "Entrou na party com sucesso!",
      leftParty: "Saiu da party com sucesso!",
      partyDeleted: "Party excluída com sucesso!",
      errorOccurred: "Ocorreu um erro. Tente novamente.",
    },
    footer: {
      createdBy: "Criado pela",
      findPerfectParty: "Encontre sua party perfeita!",
      discord: "Discord",
      reddit: "Reddit",
      feedback: "Feedback",
    },
  },
};
