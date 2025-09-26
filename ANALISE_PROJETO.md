# Análise de Projeto: Especificação vs. Implementação

Este documento compara as funcionalidades especificadas no "Documento de Especificação Técnica v1.0" com o que está atualmente implementado no código do projeto.

## Legenda
-   **✅ Feito:** A funcionalidade está implementada conforme especificado.
-   **⚠️ Parcialmente Feito:** A funcionalidade está implementada, mas com algumas diferenças ou partes faltando.
-   **❌ Não Feito:** A funcionalidade não foi encontrada no código.
-   **🔵 Desvio:** A funcionalidade foi implementada, mas com uma abordagem técnica diferente da especificada.

---

## Seção 2: Arquitetura Geral

| Componente | Especificação | Implementação Atual | Status | Observações |
| --- | --- | --- | --- | --- |
| **Backend Stack** | Python, FastAPI | **Node.js, TypeScript, Express** | 🔵 **Desvio** | A stack do backend é diferente da planejada. Isso impacta a nomenclatura de arquivos (ex: `sync.ts` em vez de `sync_data.py`). |
| **Banco de Dados** | PostgreSQL | PostgreSQL (via Prisma) | ✅ **Feito** | A escolha do banco de dados foi seguida. |
| **Frontend Stack** | Next.js, TypeScript, Tailwind | Next.js, TypeScript, Tailwind | ✅ **Feito** | A stack do frontend está 100% alinhada com a especificação. |
| **Fontes de Dados** | TMDB, IGDB, Anilist | TMDB, IGDB, Anilist são usadas nos scripts de sincronização. | ✅ **Feito** | As fontes de dados principais estão corretas. |
| **Proxy de API** | Backend atua como proxy | Sim, o frontend se comunica com a API do projeto, que por sua vez busca os dados. | ✅ **Feito** | O padrão de arquitetura de proxy está implementado. |
| **Cache (Redis)** | Cache agressivo com Redis | A camada de cache com Redis foi implementada, incluindo o middleware e a lógica de expiração. | ✅ **Feito** | O cache foi aplicado às rotas de listagem e detalhes, com uma exceção para o cronômetro de animes. |
| **Comunicação API** | RESTful para dados, WebSocket para notificações | A API usa rotas RESTful e um servidor WebSocket funcional. O frontend agora se conecta e recebe mensagens. | ✅ **Feito** | O sistema de comunicação em tempo real está completo. |
| **Estratégia de Coleta** | Polling periódico e inteligente (Changes/Webhooks) | A estratégia híbrida foi implementada: Polling otimizado para TMDB, Webhook para IGDB e Polling tradicional para Anilist. | ✅ **Feito** | A coleta de dados agora é muito mais eficiente e inteligente. |

---

## Seção 3: Funcionalidades Detalhadas do Backend

### 3.1 Sincronização Avançada de Dados

| Funcionalidade | Especificação | Implementação Atual | Status | Observações |
| --- | --- | --- | --- | --- |
| **Escopo da Coleta** | Buscar todos os dados do ano corrente. | Os scripts buscam em um intervalo de datas fixo e limitado (ex: 3 meses). | ⚠️ **Parcialmente Feito** | A funcionalidade existe, mas não cobre o escopo de tempo definido. |
| **Lógica de "Upsert"** | Atualizar ou criar itens para evitar duplicatas. | Os scripts de sincronização utilizam `prisma.upsert`. | ✅ **Feito** | A lógica de Upsert está implementada corretamente. |
| **Paginação e Rate Limit** | Buscar em lotes e fazer pausas entre requisições. | As funções de busca implementam um loop com paginação e `delay`. | ✅ **Feito** | O sistema respeita os limites das APIs externas. |
| **Coleta de Premiações** | Web Scraping de fontes como a Wikipédia. | A lógica de web scraping para coletar dados de premiações (Oscar, Globo de Ouro, The Game Awards) foi implementada em um script dedicado (`scrapeAwards.ts`). | ⚠️ **Parcialmente Feito** | A coleta de dados de premiações está funcional para alguns prêmios. Falta expandir para outros prêmios e tipos de mídia. |
| **"Detetive Digital"** | Validar links e status de pré-venda no `ingresso.com`. | A lógica completa para validação de links e verificação diária de pré-venda foi implementada em scripts dedicados. | ✅ **Feito** | A funcionalidade do Detetive Digital está completa. |
| **"Radar de Eventos"** | Monitorar a API do IGDB para anúncios de jogos em eventos. | A lógica de backend para buscar eventos, associar jogos a eles e sincronizá-los foi implementada, priorizando datas de lançamento brasileiras. | ✅ **Feito** | A funcionalidade de backend do Radar de Eventos está completa. |

### 3.2 Estrutura do Banco de Dados

| Componente | Especificação | Implementação Atual | Status | Observações |
| --- | --- | --- | --- | --- |
| **Estrutura de Curadoria** | Campos duplicados para dados da API e dados curados (ex: `titulo_api` vs. `titulo_curado`). | O schema do Prisma possui campos únicos para cada atributo (ex: `title`). | 🔵 **Desvio** | Esta é uma grande divergência arquitetural. O sistema de curadoria (edição pelo admin) não pode ser implementado como especificado. |
| **Tabelas Principais** | `users`, `preferencias_usuario_midia`, `notificacoes`. | Os modelos `User`, `preferencias_usuario_midia` e `Notification` existem. | ⚠️ **Parcialmente Feito** | As tabelas existem, mas os nomes dos campos e algumas estruturas divergem da especificação. |
| **Tabela de Eventos** | Tabela `eventos_anuncio` para catalogar eventos da indústria. | O modelo `eventos_anuncio` não existe no `schema.prisma`. | ❌ **Não Feito** | Funcionalidade ausente. |

### 3.3 Lógica da API

| Funcionalidade | Especificação | Implementação Atual | Status | Observações |
| --- | --- | --- | --- | --- |
| **Endpoints de Mídia** | Listagem, Detalhes e Pesquisa. | Endpoints de Listagem, Detalhes e Pesquisa (`/pesquisa`) implementados. | ✅ **Feito** | A API agora suporta busca global em todas as mídias. |
| **Sistema de Pesquisa Global** | Conexão Frontend-Backend | O frontend foi conectado ao endpoint `/pesquisa` do backend. | ✅ **Feito** | A busca de dados está funcional, mas a UI ainda tem pontos a melhorar. |
| **Autenticação de Usuário** | Rotas para `/login`, `/register` com JWT. | Os endpoints e a lógica com `jsonwebtoken` existem em `index.ts`. | ✅ **Feito** | O sistema de login e registro está implementado. |
| **Auth Externa (IGDB)** | Fluxo OAuth 2.0 para a API da Twitch/IGDB. | O `clients.ts` contém a URL para gerar o token de acesso da Twitch. | ✅ **Feito** | A base para autenticação com o IGDB está implementada. |
| **Endpoints de Curadoria** | Rotas de Admin (PUT/DELETE) para editar conteúdo. | As rotas `PUT` para edição de todas as mídias foram criadas e protegidas por middleware de admin. | ✅ **Feito** | O backend está pronto para a curadoria. A UI do frontend é a parte pendente. |
| **Endpoints de Notificação** | Rotas para buscar e marcar notificações como lidas. | Nenhuma rota relacionada a `/notificacoes` foi encontrada. | ❌ **Não Feito** | Funcionalidade ausente. |

---

## Seção 4: Funcionalidades e Layout do Frontend

### 4.1 Navegação Principal (Header.tsx)

| Funcionalidade | Especificação | Implementação Atual | Status | Observações |
| --- | --- | --- | --- | --- |
| **Layout e Estilo** | Header fixo com fundo translúcido e blur. | O componente usa a classe `header-fixed`, que aplica o estilo. | ✅ **Feito** | O estilo visual corresponde ao especificado. |
| **Logo e Links** | Logo, links de navegação (Filmes, Animes, etc.), link de Premiações e Hoje. | Todos os links, incluindo Premiações e Hoje, estão presentes e funcionais. | ✅ **Feito** | A navegação principal está completa. |
| **Estado Ativo** | Link da página atual deve ter um estilo diferente. | O link ativo recebe uma classe que aplica uma borda inferior. | ✅ **Feito** | A indicação da página atual funciona. |
| **Ações do Usuário** | Pesquisa, Notificações, Tema, Login/Registro ou Perfil/Sair. | Todos os botões de ação estão implementados, incluindo a lógica condicional para usuário logado/deslogado. | ✅ **Feito** | O gerenciamento de ações e estado do usuário no header está completo. |
| **Responsividade** | Menu "hambúrguer" em telas menores. | O header se adapta a telas menores e exibe um menu mobile funcional. | ✅ **Feito** | O componente é totalmente responsivo. |

### 4.2 Página Inicial (/)

| Funcionalidade | Especificação | Implementação Atual | Status | Observações |
| --- | --- | --- | --- | --- |
| **Layout de Carrosséis** | Carrosséis horizontais para cada tipo de mídia. | A página renderiza 4 carrosséis (Filmes, Animes, Séries, Jogos). | ✅ **Feito** | A estrutura principal da home está correta. |
| **Carrossel Inteligente** | Títulos dinâmicos por mês/temporada e navegação temporal. | A lógica para agrupar por mês/temporada e navegar entre eles está implementada em `page.tsx`. | ✅ **Feito** | A funcionalidade de timeline interativa funciona como especificado. |
| **Ordenação de Conteúdo** | Itens futuros devem aparecer primeiro. | A função `getTitleAndItems` ordena os itens, priorizando lançamentos futuros. | ✅ **Feito** | A lógica de ordenação está correta. |
| **Resetar Carrossel** | Clicar no título do carrossel deve voltar ao início. | A função `handle...TitleClick` reseta a posição do scroll. | ✅ **Feito** | Funcionalidade implementada. |
| **Filtros de Animes** | Botões "Novos" e "Continuações" para filtrar o carrossel de animes. | A lógica de filtro foi implementada e os botões são funcionais. | ✅ **Feito** | O carrossel de animes agora pode ser filtrado. |

### 4.3 O Card de Mídia (MidiaCard.tsx)

| Funcionalidade | Especificação | Implementação Atual | Status | Observações |
| --- | --- | --- | --- | --- |
| **Layout Básico** | Pôster com efeito de hover e informações abaixo. | O componente `MidiaCard` possui a estrutura e os efeitos visuais descritos. | ✅ **Feito** | O design básico do card está correto. |
| **Ícones Sobrepostos** | Premiação, Novo Episódio, Pré-venda. | O código renderiza condicionalmente todos os ícones especificados. | ✅ **Feito** | A exibição de status visuais no pôster está completa. |
| **Contagem Regressiva** | Para o próximo episódio de animes. | O card agora busca dados em tempo real e exibe a contagem regressiva corretamente. | ✅ **Feito** | Funcionalidade corrigida e implementada. |
| **Menu de Ações (3 pontos)** | Dropdown com opções (Favoritar, etc.) que salvam o estado do usuário. | O menu de ações agora está totalmente funcional, com o estado sendo salvo no banco de dados e refletido globalmente na UI. | ✅ **Feito** | A funcionalidade de interação do usuário no card está completa. |
| **Fluxo de Avaliação** | Ao clicar em "Já Assisti", iniciar um fluxo de avaliação em múltiplos passos. | O clique em "Já Assisti" chama a função `openRatingModal`. | ⚠️ **Parcialmente Feito** | O gatilho para o fluxo existe, mas a implementação completa dentro do modal de avaliação precisa ser verificada. |

---

### 4.4 Páginas de Catálogo

| Funcionalidade | Especificação | Implementação Atual | Status | Observações |
| --- | --- | --- | --- | --- |
| **Layout** | Grade responsiva de `MidiaCard`s. | A página `/filmes` (e outras) renderiza uma grade de cards. | ✅ **Feito** | A estrutura visual básica está correta. |
| **Filtros** | Menus dropdown, checkboxes para gênero, plataforma, etc. | Todas as páginas de catálogo (`/filmes`, `/series`, `/animes`, `/jogos`) agora possuem filtros dinâmicos e funcionais. | ✅ **Feito** | A funcionalidade de filtros dinâmicos foi completada para todas as seções. |

### 4.5 Sistema de Pesquisa Global

| Funcionalidade | Especificação | Implementação Atual | Status | Observações |
| --- | --- | --- | --- | --- |
| **Ativação e UI** | Overlay de tela cheia com campo de busca. | O componente `SearchOverlay.tsx` funciona como um overlay de tela cheia. | ✅ **Feito** | A ativação e o layout geral estão corretos. |
| **Pesquisa em Tempo Real** | Resultados atualizam a cada letra digitada. | O componente usa um `useEffect` com debounce para pesquisar enquanto o usuário digita. | ✅ **Feito** | A "Live Search" está funcional. |
| **Estado Inicial** | Mostrar "Buscas Populares da Semana". | O componente busca e exibe conteúdo "Em Alta" e também possui uma lista fixa de buscas populares. | ✅ **Feito** | O estado inicial de descoberta está implementado. |
| **Agrupamento de Resultados** | Agrupar resultados por categoria (Filmes, Séries, etc.). | Os resultados agora são renderizados em seções separadas por tipo de mídia. | ✅ **Feito** | A exibição dos resultados está agora alinhada com a especificação. |
| **Navegação por Teclado** | Usar setas do teclado para navegar entre os resultados. | A navegação por setas e a seleção com Enter foram implementadas. | ✅ **Feito** | A navegação por teclado na busca está funcional. |

### 4.7 O "Super Modal" de Detalhes

| Funcionalidade | Especificação | Implementação Atual | Status | Observações |
| --- | --- | --- | --- | --- |
| **Layout Geral** | Modal de tela cheia, fecha com ESC e botão 'X'. | O componente `SuperModal.tsx` segue o layout geral especificado. | ✅ **Feito** | A estrutura e comportamento básicos do modal estão corretos. |
| **Edição de Admin** | Ícone de "lápis" que ativa um modo de edição. | A interface de edição agora está funcional para todos os tipos de mídia (Filmes, Séries, Animes e Jogos). | ✅ **Feito** | A funcionalidade de curadoria de conteúdo está completa. |

---

### 4.10 Sistema de Notificações

| Funcionalidade | Especificação | Implementação Atual | Status | Observações |
| --- | --- | --- | --- | --- |
| **Notificação em Tempo Real** | Backend envia e frontend recebe notificações via WebSocket. | O sistema de ponta a ponta está funcional. O modal de notificações foi implementado com "arrastar para apagar". | ✅ **Feito** | A base do sistema de notificações está completa. Faltam apenas os gatilhos mais complexos no backend. |
| **Layouts Específicos** | Layouts customizados por tipo de mídia (filmes, animes, etc.). | O modal usa componentes filhos (`FilmeModalContent`, etc.), mas faltam exibir muitos campos já analisados. | ⚠️ **Parcialmente Feito** | A estrutura existe, mas está incompleta em termos de dados exibidos. |
| **Botões de Ação Contextuais** | Lógica complexa para exibir "Comprar Ingresso" ou "Assistir" apenas se houver link válido. | A lógica para exibir os botões de ação de forma contextual e com os ícones corretos foi implementada para todos os tipos de mídia. | ✅ **Feito** | A funcionalidade está completa, aguardando apenas a implementação de features de backend de suporte (ex: Detetive Digital). |

