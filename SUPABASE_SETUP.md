# 🚀 Guia de Configuração do Supabase

Este guia te ajudará a configurar o Supabase (versão gratuita) para o MapleStory Party Finder.

## 📋 **Pré-requisitos**

- Conta no [Supabase](https://supabase.com) (gratuita)
- Acesso ao projeto MapleStory Party Finder

## 🎯 **Passo 1: Criar Conta e Projeto no Supabase**

### 1.1 Criar Conta
1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"Start your project"**
3. Faça login com GitHub, Google ou email
4. Confirme seu email se necessário

### 1.2 Criar Novo Projeto
1. No dashboard, clique em **"New Project"**
2. Escolha uma organização (ou crie uma nova)
3. Preencha os dados do projeto:
   - **Name**: `maple-party-finder` (ou nome de sua escolha)
   - **Database Password**: Crie uma senha forte (anote ela!)
   - **Region**: Escolha a região mais próxima (recomendado: São Paulo)
   - **Pricing Plan**: Deixe em **"Free"**
4. Clique em **"Create new project"**
5. ⏱️ Aguarde ~2 minutos para o projeto ser criado

## 🗄️ **Passo 2: Configurar o Banco de Dados**

### 2.1 Executar Script SQL
1. No painel do Supabase, vá em **"SQL Editor"** (sidebar esquerda)
2. Clique em **"New query"**
3. Copie e cole o conteúdo completo do arquivo `backend/supabase-schema.sql`
4. Clique em **"Run"** (ou pressione Ctrl+Enter)
5. ✅ Verifique se executou sem erros

### 2.2 Verificar Tabelas Criadas
1. Vá em **"Table Editor"** (sidebar esquerda)
2. Confirme que as seguintes tabelas foram criadas:
   - `players`
   - `parties`
   - `party_members`
   - `party_invites`
   - `buff_schedules`
   - `buff_votes`
   - `weekly_resets`

## 🔑 **Passo 3: Obter Chaves de API**

### 3.1 Acessar Configurações
1. Vá em **"Settings"** > **"API"** (sidebar esquerda)
2. Na seção **"Project API keys"**, você verá:

### 3.2 Chaves Importantes
- **Project URL**: `https://xxx.supabase.co`
- **anon/public key**: `eyJ...` (chave pública)
- **service_role key**: `eyJ...` (chave privada - **MANTENHA SECRETA!**)

## ⚙️ **Passo 4: Configurar Variáveis de Ambiente**

### 4.1 Criar Arquivo de Configuração
Crie o arquivo `backend/.env` com o seguinte conteúdo:

```env
# Porta do servidor
PORT=3002

# Ambiente
NODE_ENV=development

# JWT Secret (mude em produção)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# CORS
CORS_ORIGIN=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=https://sua-url-do-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon-aqui
SUPABASE_SERVICE_KEY=sua-chave-service-role-aqui

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Buff Scheduling
WEEKLY_RESET_DAY=3
WEEKLY_RESET_HOUR=21
WEEKLY_RESET_TIMEZONE=America/Sao_Paulo

# Security
BCRYPT_ROUNDS=12
SESSION_TIMEOUT=86400000
```

### 4.2 Substituir as Chaves
⚠️ **IMPORTANTE**: Substitua os valores placeholders:

- `SUPABASE_URL`: Cole a **Project URL** do Passo 3.2
- `SUPABASE_ANON_KEY`: Cole a **anon public key** do Passo 3.2  
- `SUPABASE_SERVICE_KEY`: Cole a **service_role key** do Passo 3.2

## 🔒 **Passo 5: Configurar Row Level Security (RLS)**

### 5.1 Verificar Políicas de Segurança
1. No Supabase, vá em **"Authentication"** > **"Policies"**
2. Confirme que as políticas foram criadas automaticamente pelo script SQL
3. Se não apareceram, execute novamente o script SQL

### 5.2 Verificar RLS Ativo
1. Vá em **"Table Editor"**
2. Para cada tabela, clique no ícone de configuração (⚙️)
3. Verifique se **"Enable RLS"** está ativo
4. Se não estiver, ative manualmente

## 🧪 **Passo 6: Testar a Configuração**

### 6.1 Iniciar Backend
```bash
cd backend
npm install
npm run build
npm run dev
```

### 6.2 Verificar Conexão
1. Acesse: http://localhost:3002/health
2. ✅ Deve retornar status de sucesso
3. No terminal, verifique: `Connected to Supabase database`

### 6.3 Testar API
```bash
# Teste criar um player
curl -X POST http://localhost:3002/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "uniqueId": "TestPlayer001",
    "name": "Test Player",
    "level": 250,
    "job": "Night Lord",
    "server": "Scania",
    "preferredDifficulty": "chaos"
  }'
```

## 🔧 **Passo 7: Configuração Opcional (Produção)**

### 7.1 Configurar Domínio Personalizado
1. Vá em **"Settings"** > **"Custom Domains"**
2. Adicione seu domínio se tiver um

### 7.2 Backup Automático
1. Vá em **"Settings"** > **"Database"**
2. Configure backups automáticos (disponível no plano pago)

### 7.3 Monitoramento
1. Vá em **"Reports"** para ver métricas de uso
2. Configure alertas se necessário

## 📊 **Limitações da Versão Gratuita**

- **Database**: 500MB de armazenamento
- **Auth users**: 50,000 usuários
- **API requests**: 50,000 por mês
- **Bandwidth**: 5GB por mês
- **Storage**: 1GB

*Para um projeto inicial, essas limitações são mais que suficientes!*

## 🆘 **Solução de Problemas**

### Erro: "Invalid API key"
- ✅ Verifique se as chaves no `.env` estão corretas
- ✅ Confirme que não há espaços extras nas chaves
- ✅ Teste com a chave anon primeiro

### Erro: "Permission denied"
- ✅ Verifique se o RLS está configurado corretamente
- ✅ Confirme que as policies foram criadas
- ✅ Use a service_role key para operações do backend

### Erro: "Connection timeout"
- ✅ Verifique sua conexão com internet
- ✅ Confirme se o projeto Supabase está ativo
- ✅ Teste a URL do projeto no navegador

### Tabelas não foram criadas
- ✅ Execute o script SQL novamente
- ✅ Verifique se não há erros no SQL Editor
- ✅ Confirme que você tem permissões de administrador

## 🎉 **Parabéns!**

Se tudo funcionou, você agora tem:

✅ **Supabase configurado** com todas as tabelas necessárias  
✅ **Backend funcionando** com PostgreSQL na nuvem  
✅ **API testada** e respondendo corretamente  
✅ **Segurança configurada** com RLS  
✅ **Ambiente pronto** para desenvolvimento e produção  

Agora você pode:
- **Criar perfis de players**
- **Gerenciar parties privadas/públicas**
- **Agendar buffs semanais**
- **Sistema de votação e reputação**
- **Websockets em tempo real**

## 📞 **Próximos Passos**

1. **Testar todas as funcionalidades** no frontend
2. **Criar alguns dados de exemplo** para testar
3. **Configurar monitoring** se necessário
4. **Planejar backup strategy** quando for para produção

---

🍁 **Happy Mapling!** 🍁
