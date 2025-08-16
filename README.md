# 🍁 MapleStory Party Finder

Um site moderno e intuitivo para ajudar a comunidade do MapleStory a encontrar parties para boss fights! Construído com Next.js, TypeScript e uma interface temática do MapleStory.

![MapleStory Party Finder](https://github.com/user-images/placeholder.png)

## ✨ Características

### 🎮 Sistema de Perfil de Jogador
- **Criação de perfil sem login tradicional** - Sistema baseado em localStorage
- **Integração com wallet crypto** - Login opcional via RainbowKit/WalletConnect
- **Informações completas** - Nome, level, classe, servidor, preferências

### 👥 Sistema de Parties
- **Criação de parties** - Seja o host e organize seu grupo
- **Busca inteligente** - Filtros por boss, dificuldade, servidor
- **Participação simples** - Entre e saia de parties com um clique
- **Informações detalhadas** - Requisitos, horários, descrições

### 👹 Guia de Bosses Completo
- **Todos os bosses principais** - Zakum, Horntail, Hilla, Magnus, Pink Bean, etc.
- **Informações detalhadas** - Level, dificuldade, tempo estimado, recompensas
- **Filtros por dificuldade** - Normal, Chaos, Hard, Extreme
- **Requisitos claros** - Saiba exatamente o que é necessário

### 🎨 Design Temático MapleStory
- **Cores autênticas** - Paleta de cores inspirada no jogo
- **Componentes estilizados** - Botões e painéis com visual do MapleStory
- **Animações suaves** - Efeitos visuais que lembram o jogo
- **Totalmente responsivo** - Funciona perfeitamente em mobile e desktop

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática para maior confiabilidade
- **Tailwind CSS** - Estilização utilitária com customizações temáticas
- **RainbowKit** - Integração com wallets crypto
- **Wagmi** - Hooks para interação com blockchain
- **Lucide React** - Ícones modernos e consistentes
- **localStorage** - Gerenciamento de sessão local

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos para execução

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/maple-story-party.git
cd maple-story-party
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto**
```bash
npm run dev
```

4. **Acesse no navegador**
```
http://localhost:3000
```

## 📱 Funcionalidades Principais

### 🔐 Sistema de Sessão
- **Sem necessidade de cadastro** - Comece a usar imediatamente
- **Dados persistentes** - Suas informações ficam salvas no navegador
- **Wallet opcional** - Conecte sua wallet crypto se desejar
- **Multiplataforma** - Funciona em qualquer dispositivo

### 🎯 Encontrar Parties
1. **Navegue pelas parties ativas** - Veja todas as parties disponíveis
2. **Use os filtros** - Encontre exatamente o que procura
3. **Entre na party** - Um clique para participar
4. **Veja informações dos membros** - Levels, classes, experiência

### 👑 Criar Parties
1. **Selecione o boss** - Escolha entre todos os bosses disponíveis
2. **Configure detalhes** - Horário, requisitos, descrição
3. **Gerencie membros** - Aceite ou remova participantes
4. **Lidere seu grupo** - Organize estratégias e coordene

### 📚 Consultar Bosses
- **Informações completas** - Level mínimo, mecânicas, recompensas
- **Dificuldades explicadas** - Entenda as diferenças entre Normal, Chaos, Hard, Extreme
- **Estratégias básicas** - Dicas para cada boss
- **Tempo estimado** - Planeje seu tempo de jogo

## 🎮 Bosses Incluídos

### Normal Difficulty
- **Zakum** (Lv.110) - Boss clássico, perfeito para iniciantes
- **Horntail** (Lv.130) - Dragão lendário com múltiplas fases
- **Hilla** (Lv.120) - Necromante poderosa
- **Pink Bean** (Lv.140) - Boss peculiar e divertido
- **Cygnus** (Lv.165) - Imperatriz dos Cygnus Knights

### Chaos & Hard
- **Chaos Zakum** (Lv.140) - Versão mais poderosa
- **Chaos Horntail** (Lv.160) - Extremamente desafiador
- **Hard Hilla** (Lv.170) - Mecânicas mortais
- **Von Leon** (Lv.125/155) - Rei Leão caído
- **Normal/Hard Magnus** (Lv.155/180) - Comandante do Exército Negro

### Extreme
- **Hard Magnus** (Lv.180+) - Apenas para os mais experientes
- E muitos outros...

## 💡 Como Usar

### Para Novatos
1. **Crie seu perfil** - Adicione informações básicas do seu personagem
2. **Explore o guia de bosses** - Aprenda sobre cada boss
3. **Procure parties para iniciantes** - Muitos hosts ajudam novatos
4. **Entre em parties do seu nível** - Comece com bosses mais fáceis

### Para Veterans
1. **Crie parties para bosses difíceis** - Lidere grupos experientes
2. **Ajude novatos** - Crie parties educativas
3. **Organize raids regulares** - Forme grupos fixos
4. **Compartilhe estratégias** - Use as descrições para explicar táticas

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Este é um projeto da comunidade para a comunidade.

1. **Fork o projeto**
2. **Crie uma branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit suas mudanças** (`git commit -m 'Add some AmazingFeature'`)
4. **Push para a branch** (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

### Ideias para Contribuições
- 🆕 Novos bosses e conteúdos
- 🎨 Melhorias de design e UX
- 📱 Otimizações mobile
- 🔧 Novas funcionalidades
- 🐛 Correções de bugs
- 📝 Melhorias na documentação

## 📝 Roadmap

### Próximas Funcionalidades
- [ ] 🔔 Sistema de notificações
- [ ] 👥 Chat em tempo real
- [ ] 📊 Estatísticas de jogadores
- [ ] 🏆 Sistema de reputação
- [ ] 📅 Agendamento avançado
- [ ] 🌐 Suporte a múltiplos idiomas
- [ ] 💾 Backup de dados na nuvem
- [ ] 🎯 Recomendações inteligentes

### Melhorias Técnicas
- [ ] ⚡ Performance otimizations
- [ ] 🧪 Testes automatizados
- [ ] 📱 PWA support
- [ ] 🔄 Sincronização entre dispositivos
- [ ] 🛡️ Segurança aprimorada

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- **Comunidade MapleStory** - Por inspirar este projeto
- **Nexon** - Pelo incrível universo do MapleStory
- **Next.js Team** - Pelo framework incrível
- **Todos os contribuidores** - Por tornar este projeto melhor

## 📞 Contato

- **Discord**: [Link do servidor da comunidade]
- **Reddit**: [r/MapleStoryPartyFinder]
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/maple-story-party/issues)

---

**🍁 Happy Mapling! Que todos encontrem suas parties perfeitas! ⚔️**
