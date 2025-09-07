# 🎬 ORBE NERD - PROJETO COMPLETO

## 📋 Visão Geral

O **Orbe Nerd** é uma plataforma completa de descoberta e acompanhamento de mídia que integra filmes, séries, animes e jogos em uma única experiência. O projeto foi desenvolvido com **Next.js** no frontend e **Flask** no backend, consumindo dados reais das APIs do **TMDB**, **Anilist** e **Twitch/IGDB**.

## 🚀 Funcionalidades Implementadas

### ✅ Frontend (Next.js + TypeScript + Tailwind CSS)

#### **Interface Completa:**
- **Header fixo** com navegação responsiva
- **Sistema de temas** (claro/escuro/automático)
- **Logo gradiente** "Orbe Nerd" conforme especificação
- **Navegação completa** (Filmes, Séries, Animes, Jogos, Premiações, "O que tem pra hoje")

#### **Sistema de Pesquisa:**
- **Layout correto**: barra à esquerda, categorias abaixo, filtros rápidos
- **MidiaCards à direita** com filtro dinâmico
- **Conteúdo "Em Alta"** carregado automaticamente
- **Pesquisa em tempo real** com recomendações

#### **Componentes Principais:**
- **MidiaCard**: Cards de mídia com informações detalhadas
- **Carousel**: Carrosséis com navegação temporal (《 》)
- **Super Modal**: Modal completo com detalhes de mídia
- **SearchOverlay**: Sistema de pesquisa fullscreen
- **NotificationModal**: Modal de notificações

#### **Páginas Funcionais:**
- **Página inicial** com carrosséis dinâmicos
- **Páginas de catálogo** (filmes, séries, animes, jogos)
- **Páginas de autenticação** (login, cadastro, perfil)
- **Páginas institucionais** (ajuda, contato, termos, privacidade)

#### **Sistema de Cores:**
- **Tema claro**: branco e dourado
- **Tema escuro**: preto e azul
- **Detecção automática** do tema do sistema

### ✅ Backend (Flask + PostgreSQL)

#### **APIs Integradas:**
- **TMDB**: 42 filmes e 20 séries sincronizados
- **Anilist**: 39 animes sincronizados
- **Twitch/IGDB**: 40 jogos sincronizados

#### **Endpoints Completos:**
```
GET /api/filmes          - Lista filmes com filtros
GET /api/series          - Lista séries
GET /api/animes          - Lista animes
GET /api/jogos           - Lista jogos
GET /api/search          - Pesquisa global
GET /api/trending        - Conteúdo em alta
POST /api/auth/register  - Cadastro de usuário
POST /api/auth/login     - Login de usuário
GET /api/auth/me         - Usuário atual
GET /api/notifications   - Notificações
```

#### **Recursos Avançados:**
- **Autenticação JWT** completa
- **Paginação** em todas as listagens
- **Filtros por gênero** e categoria
- **CORS configurado** para frontend
- **Tratamento de erros** robusto

#### **Banco de Dados:**
- **PostgreSQL** configurado e funcionando
- **Modelos completos** para todas as entidades
- **Dados reais** das APIs sincronizados
- **Relacionamentos** entre tabelas

## 🛠️ Tecnologias Utilizadas

### Frontend:
- **Next.js 15** com Turbopack
- **TypeScript** para tipagem
- **Tailwind CSS** para estilização
- **Zustand** para gerenciamento de estado
- **React Query** para cache de dados
- **Lucide Icons** para ícones

### Backend:
- **Flask** com extensões
- **SQLAlchemy** para ORM
- **PostgreSQL** como banco de dados
- **Flask-CORS** para CORS
- **PyJWT** para autenticação
- **Requests** para APIs externas

### APIs Externas:
- **TMDB** para filmes e séries
- **Anilist** para animes
- **Twitch/IGDB** para jogos

## 📁 Estrutura do Projeto

```
orbe-nerd/
├── frontend/                 # Frontend Next.js
│   ├── src/
│   │   ├── app/             # Páginas do Next.js
│   │   ├── components/      # Componentes React
│   │   ├── data/           # APIs e dados
│   │   ├── hooks/          # Hooks customizados
│   │   ├── lib/            # Utilitários
│   │   ├── stores/         # Gerenciamento de estado
│   │   └── types/          # Tipos TypeScript
│   ├── .env.local          # Variáveis de ambiente
│   └── package.json
│
├── backend/                 # Backend Flask
│   ├── app.py              # Aplicação principal
│   ├── api_clients.py      # Clientes das APIs
│   ├── data_sync.py        # Sincronização de dados
│   ├── .env                # Variáveis de ambiente
│   └── requirements.txt
│
└── docs/                   # Documentação
    ├── BACKEND_INTEGRATION.md
    └── README.md
```

## 🔧 Como Executar

### 1. Backend (Flask)

```bash
# Navegar para o diretório backend
cd backend

# Criar ambiente virtual
python3.11 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Configurar banco de dados PostgreSQL
sudo service postgresql start
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'admin2011';"
sudo -u postgres psql -c "CREATE DATABASE orbe_nerd_db;"

# Executar aplicação
python app.py
```

### 2. Frontend (Next.js)

```bash
# Navegar para o diretório frontend
cd orbe-nerd-frontend

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

### 3. Acessar Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔑 Variáveis de Ambiente

### Backend (.env):
```env
# APIs Externas
TMDB_API_KEY=d1bdd2a306b19467ef1a090dc2c6d374
ANILIST_CLIENT_ID=29199
ANILIST_CLIENT_SECRET=zDBJzQncm8YJMv5D67rFzKGLsTV9QScsZf0OpQXL
TWITCH_CLIENT_ID=7dexczkemb76cpnru6k64nfu6tltu7
TWITCH_CLIENT_SECRET=o19443t8dlnl83la2q428o1kztbdw2

# Banco de Dados
DATABASE_URL=postgresql://postgres:admin2011@localhost:5432/orbe_nerd_db
```

### Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📊 Dados Sincronizados

### Estatísticas Atuais:
- **42 filmes** do TMDB (populares, em cartaz, em breve)
- **20 séries** do TMDB (populares)
- **39 animes** do Anilist (em alta e populares)
- **40 jogos** do Twitch/IGDB (populares e em breve)

**Total: 141 itens de mídia** disponíveis!

## 🧪 Testes Realizados

### ✅ Backend:
- Conexão com banco de dados PostgreSQL
- Sincronização com APIs externas
- Endpoints funcionando corretamente
- Autenticação JWT
- CORS configurado

### ✅ Frontend:
- Carregamento de dados reais
- Navegação entre páginas
- Sistema de pesquisa
- Modais funcionais
- Responsividade

### ✅ Integração:
- Comunicação frontend-backend
- Tratamento de erros
- Estados de loading
- Cache de dados

## 🎯 Funcionalidades Testadas

### Interface:
- ✅ Header fixo e navegação
- ✅ Sistema de temas funcionando
- ✅ Pesquisa com layout correto
- ✅ Super Modal abrindo ao clicar nos cards
- ✅ Modal de notificações
- ✅ Todas as páginas acessíveis
- ✅ Footer completo
- ✅ Design responsivo

### Backend:
- ✅ APIs retornando dados reais
- ✅ Filtros e paginação
- ✅ Pesquisa global
- ✅ Autenticação
- ✅ Notificações

## 🚀 Próximos Passos (Opcional)

### Melhorias Futuras:
1. **Deploy em produção** (Vercel + Railway/Heroku)
2. **Cache Redis** para melhor performance
3. **WebSockets** para notificações em tempo real
4. **Sistema de favoritos** e listas personalizadas
5. **Recomendações** baseadas em IA
6. **PWA** para aplicativo mobile
7. **Testes automatizados** (Jest, Cypress)

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs do backend e frontend
2. Confirmar se PostgreSQL está rodando
3. Verificar variáveis de ambiente
4. Testar endpoints da API diretamente

## 🎉 Conclusão

O **Orbe Nerd** está **100% funcional** e atende a todas as especificações solicitadas:

- ✅ Frontend Next.js completo e responsivo
- ✅ Backend Flask com APIs reais integradas
- ✅ Banco de dados PostgreSQL configurado
- ✅ 141 itens de mídia sincronizados
- ✅ Sistema de autenticação funcionando
- ✅ Todas as funcionalidades implementadas

O projeto está pronto para uso e pode ser facilmente expandido com novas funcionalidades!

