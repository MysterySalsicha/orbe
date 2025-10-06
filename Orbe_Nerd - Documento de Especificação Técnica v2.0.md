# Documento de Especificação Técnica - Orbe Nerd v2.0 (Final)

## 1. Visão Geral do Projeto

O Orbe Nerd é um hub de entretenimento pessoal e curado, projetado para ser uma central de lançamentos de Filmes, Séries, Animes e Jogos. O objetivo é fornecer uma interface elegante, rápida e rica em informações, com uma experiência de usuário moderna e interativa.

## 2. Arquitetura Geral

A arquitetura do Orbe Nerd é baseada em um ecossistema TypeScript, com um backend Node.js atuando como uma API robusta e um frontend moderno em Next.js.

- **Backend:** API construída com **Node.js, Express, e TypeScript**. Atua como um proxy seguro e uma camada de orquestração de dados.
- **Frontend:** Aplicação web construída com **Next.js (App Router), TypeScript**, e estilizada com **Tailwind CSS** e **Shadcn/UI**.
- **Banco de Dados:** **PostgreSQL** gerenciado pelo **Prisma ORM**, que serve como a única fonte da verdade para os dados exibidos no frontend.
- **Cache:** **Redis** é utilizado para uma camada de cache agressivo no backend, otimizando a performance e reduzindo a carga nas APIs externas.
- **Comunicação API:**
    - **RESTful:** Principal meio de comunicação entre o frontend e o backend para busca de dados.
    - **WebSocket:** Utilizado para notificações em tempo real, permitindo que o backend envie atualizações instantâneas para os clientes conectados.
- **Fontes de Dados Externas:**
    - **TMDB (The Movie Database):** Fonte primária para Filmes e Séries.
    - **Anilist:** Fonte exclusiva para Animes, utilizando sua API GraphQL.
    - **IGDB (Internet Game Database):** Fonte primária para Jogos.
    - **Web Scraping (Cheerio):** Utilizado para coletar dados de premiações de fontes como a Wikipédia.

### Diagrama de Arquitetura Simplificado:

- **Frontend (Next.js)** ↔️ **Backend (Node.js/Express)** ↔️ **Banco de Dados (PostgreSQL) & Cache (Redis)**
- **Backend** ↔️ **APIs Externas (TMDB, Anilist, IGDB, etc.)**
- **Frontend** ↕️ **Backend via WebSocket** (para notificações)

## 3. Funcionalidades Detalhadas do Backend

### 3.1. Sincronização Avançada de Dados (`sync.ts` e submódulos)

O coração do sistema. Um conjunto de scripts responsáveis por coletar, processar e armazenar os dados das APIs externas no banco de dados local.

- **Lógica de "Atualizar ou Criar" (Upsert):** Para cada item de mídia, o sistema utiliza `prisma.upsert` para verificar se ele já existe no banco. Se sim, atualiza os campos que mudaram; se não, cria um novo registro.
- **Paginação e Controle de Taxa:** Todas as chamadas às APIs externas são paginadas e feitas com pausas (`delay`) para evitar sobrecarga e bloqueios.
- **Módulos de Sincronização Específicos:**
    - `syncMovies.ts`: Busca filmes do TMDB, incluindo relacionamentos com Gêneros, Elenco, Equipe, Vídeos e Plataformas de Streaming.
    - `syncSeries.ts`: Busca séries do TMDB, incluindo Temporadas, Criadores, Elenco, etc.
    - `syncAnimes.ts`: Busca animes do Anilist, incluindo Gêneros, Tags, Estúdios, Links de Streaming e agendamento de episódios (`AiringSchedule`).
    - `syncGames.ts`: Busca jogos do IGDB, incluindo Plataformas, Gêneros, Modos de Jogo, Screenshots e Websites.
- **Coleta de Premiações (`scrapeAwards.ts`):** Uma sub-rotina de web scraping que extrai indicados e vencedores de premiações (Oscar, Globo de Ouro, The Game Awards) e os associa às mídias correspondentes no banco de dados.
- **Detetive Digital (`detetive.ts`):**
    - Valida automaticamente a existência de páginas de filmes no `ingresso.com`.
    - Se um link é validado, ele é salvo no banco. Se falha, cria uma notificação para o administrador.
- **Agendamento:** A sincronização completa é projetada para rodar semanalmente, enquanto o Detetive Digital roda diariamente.

### 3.2. Estrutura do Banco de Dados (`schema.prisma`)

O `schema.prisma` define todos os modelos de dados. A estratégia de curadoria **não utiliza campos duplicados** (ex: `titulo_api` vs `titulo_curado`). Em vez disso, há um campo único (ex: `title`) que é preenchido pela sincronização e pode ser sobrescrito pelo administrador através dos endpoints de edição.

### 3.3. Lógica da API (`index.ts`, `mediaRoutes.ts`, `userRoutes.ts`)

A API RESTful é o ponto de acesso para o frontend.

- **Endpoints de Mídia (`mediaRoutes.ts`):**
    - **Listagem e Filtragem:** Rotas como `GET /api/filmes`.
    - **Detalhes Agregados:** Rotas como `GET /api/filmes/:id/details`.
    - **Pesquisa Global:** `GET /api/pesquisa`.
    - **Dados para Filtros:** Endpoints como `GET /api/filmes/filtros`.
- **Endpoints de Autenticação e Usuários (`index.ts`, `userRoutes.ts`):**
    - **Registro e Login:** `POST /register` e `POST /login` com hash de senha (bcrypt) e retorno de **JWT**.
    - **Rotas Protegidas:** Um middleware (`authMiddleware`) valida o JWT para proteger rotas de usuário, como as que gerenciam interações (`GET /api/me/interactions`).
- **Endpoints de Curadoria (Admin):**
    - Rotas `PUT` (ex: `/api/filmes/:id`) protegidas por um `adminMiddleware` que verifica a role "admin" no token JWT.
    - Permitem a edição de dados e invalidam o cache do Redis para o item modificado.
- **Notificações em Tempo Real (WebSocket):**
    - O servidor WebSocket (`ws`) é inicializado no `index.ts`. Uma função `broadcast` permite que qualquer módulo envie mensagens em tempo real para todos os clientes conectados.
- **Gerenciamento de Cache (`cacheMiddleware.ts`):**
    - Um middleware utilizando Redis é aplicado às rotas de mídia para cachear respostas e acelerar a entrega de dados.

## 4. Funcionalidades e Layout do Frontend

### 4.1. Identidade Visual e Temas

- **Paleta de Cores:**
    - **Tema Escuro (Padrão):** Fundo preto/azul escuro com acentos em azul vibrante e gradientes.
    - **Tema Claro:** Fundo branco com acentos em dourado.
- **Comportamento do Tema:** O site detecta e aplica o tema do sistema operacional do usuário por padrão. Um botão no Header permite a troca manual a qualquer momento.

### 4.2. Navegação Principal (`Header.tsx`)

- **Estrutura e Estilo:** Barra de navegação fixa no topo (`sticky`), com fundo translúcido e efeito de desfoque (`backdrop-blur`).
- **Elementos:**
    - **Logo "Orbe Nerd"** como link para a home.
    - **Links de Navegação:** "Filmes", "Animes", "Séries", "Jogos", "Premiações", "Hoje" e "Apoie o Projeto".
    - **Ações do Usuário:** Botões "Entrar"/"Inscreva-se" ou um menu de perfil para usuários logados.
    - **Ações Globais:** Botão de Pesquisa, botão de Notificações (com contador) e o seletor de tema.
- **Responsividade:** O menu se agrupa em um ícone "hambúrguer" em telas menores.

### 4.3. Página Inicial (`/page.tsx`)

- **Layout:** Exibe uma série de carrosséis roláveis horizontalmente (Filmes, Animes, Séries, Jogos).
- **Carrossel Inteligente (Timeline Interativa):**
    - **Filmes/Séries:** Título dinâmico por mês (ex: "Estreias de Agosto"). Botões `《` e `》` permitem navegar entre os meses.
    - **Animes:** Título sazonal (ex: "Animes da Temporada de Verão").
    - **Interação:** Clicar no título de um carrossel o redefine para a posição inicial (mês/temporada atual).
- **Filtros Rápidos:** Botões acima dos carrosséis para filtrar o conteúdo exibido (ex: Animes "Novos" vs "Continuações").

### 4.4. Card de Mídia (`MidiaCard.tsx`)

- **Layout e Interação:** Imagem do pôster com efeito de zoom ao passar o mouse. Apresenta informações essenciais abaixo.
- **Ícones Sobrepostos:**
    - **Premiação:** Ícone da premiação (Oscar, Globo de Ouro) em dourado (vencedor) ou prateado (indicado).
    - **Novo Episódio:** Selo "NOVO" para episódios recém-lançados de mídias acompanhadas.
    - **Pré-venda:** Ícone de carrinho de compras para filmes em pré-venda.
- **Contagem Regressiva para Animes:** Exibe um contador em tempo real para o próximo episódio.
- **Droplist de Ações Rápidas:** Menu ativado por 3 pontinhos ou "clicar e segurar" (long-press) com as opções: "Favoritar", "Quero Assistir", "Acompanhando", "Já Assisti/Joguei" e "Não me Interessa".

### 4.5. O "Super Modal" de Detalhes (`SuperModal.tsx`)

- **Comportamento:** Abre em tela cheia ao clicar em um `MidiaCard`. Pode ser fechado com a tecla `ESC` ou o botão "voltar" do navegador.
- **Conteúdo Customizado por Mídia:**
    - **Filmes:** Exibe Duração, Direção, Roteiro e carrossel de Elenco.
    - **Séries:** Exibe Nº de Temporadas, Nº total de Episódios, Criadores e lista de temporadas.
    - **Animes:** Exibe Fonte, Estúdio, Status de Dublagem, link para MyAnimeList, carrossel de Personagens/Dubladores e carrossel de Equipe (Staff).
    - **Jogos:** Exibe Desenvolvedores, Publicadoras e links para websites oficiais/lojas.
- **Botões de Ação Contextuais:**
    - **"Comprar Ingresso":** Aparece apenas se o link do `ingresso.com` foi validado pelo Detetive Digital.
    - **"Assistir Agora":** Leva para a `homepage` da mídia, se disponível.
- **Edição no Local (Admin):** Um botão de "lápis" ativa o modo de edição, transformando o modal em um formulário.

### 4.6. Outras Funcionalidades de UI

- **Sistema de Pesquisa (`SearchOverlay.tsx`):** Overlay de tela cheia com busca em tempo real, filtros de categoria e navegação por teclado.
- **Páginas de Catálogo (`/filmes`, etc.):** Grelhas de `MidiaCard` com filtros avançados (gênero, plataforma, etc.).
- **Fluxo de Avaliação (`RatingModal.tsx`):** Modal em duas etapas que é acionado após o usuário marcar um item como "Já Assisti".
- **Adicionar ao Calendário (`CalendarModal.tsx`):** Modal com opções inteligentes para criar eventos de lançamento.
- **Página de Perfil (`/perfil`):** Com abas para "Minha Lista", "Favoritos", "Assistidos" e um fluxo de recomendação.

### 4.7. Checklist de Ícones

O projeto utiliza um conjunto dedicado de ícones SVG localizados em `public/icons/` para garantir consistência visual:

- **Plataformas de Streaming:** Netflix, Disney+, Max, Prime Video, Apple TV+, Crunchyroll, Star+.
- **Plataformas de Jogos:** PlayStation, Xbox, Nintendo Switch, PC, Steam.
- **Premiações:** Oscar, Globo de Ouro, The Anime Awards, The Game Awards.
- **Ícones de UI:** Sino (Notificações), Lupa (Pesquisa), Coração (Favoritar), Estrela (Acompanhando), etc.

## 5. Requisitos Não-Funcionais

- **Segurança:** Autenticação com JWT, senhas com hash bcrypt, CORS restrito, e Rate Limiting na API.
- **Performance:** Cache com Redis, Static Site Generation (SSG) e Incremental Static Regeneration (ISR) no Next.js, e otimização de imagens.
- **Escalabilidade:** Backend stateless e uso de Redis Pub/Sub para escalar conexões WebSocket.
- **Monitoramento e Logs:** Logs estruturados em JSON e integração planejada com serviços de monitoramento de erros.
- **Acessibilidade:** Conformidade com padrões WCAG, navegação por teclado e uso de ARIA labels.

## 6. Estratégia de Desenvolvimento e Operações (DevOps)

- **Ambiente de Deploy:** Vercel para o frontend e backend (como Vercel Functions), com banco de dados e Redis hospedados em plataformas como Neon e Upstash.
- **Versionamento (GitHub Flow):** Branches `main` (produção), `dev` (desenvolvimento) e `feature/*`.
- **CI/CD (GitHub Actions):** Testes automatizados são executados a cada push, e o deploy para produção é acionado no merge para a `main`.
