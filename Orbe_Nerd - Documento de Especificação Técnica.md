> **Documento** **de** **Especificação** **Técnica** **-** **Orbe**
> **Nerd** **v1.0**
>
> *1.* *Visão* *Geral* *do* *Projeto*
>
> O Orbe Nerd é um hub que reúne as informações de todos os lançamentos
> do entretenimento da cultura POP, um site pessoal e curado, projetado
> para ser uma central de lançamentos de Filmes, Séries, Animes e Jogos.
> O objetivo é fornecer uma interface elegante, rápida e rica em
> informações, com uma experiência de usuário inspirada nos melhores
> serviços de notícias como Adoro Cinema, Anilist e em muitos outros.
>
> *2.* *Arquitetura* *Geral*
>
> • **Backend:** API construída com **Node.js,** **TypeScript** **e** **Express**.
> A decisão de desviar da especificação original (Python/FastAPI) foi
> tomada para otimizar a integração com o frontend em Next.js e com a
> plataforma de hospedagem Vercel, criando um ecossistema de
> desenvolvimento mais coeso em TypeScript.
>
> • **Backend** **↔️** **APIs** **Externas:**
>
> o **TMDB** **(The** **Movie** **Database):** Será a fonte de dados
> primária e fundamental para 95% das informações de Filmes e Séries,
> incluindo metadados, elenco, e a vasta biblioteca de imagens.
>
> o **IGDB** **(Internet** **Game** **Database):** A fonte de dados
> primária para Jogos.
>
> o **Anilist:** Será a **fonte** **de** **dados** **exclusiva** **e**
> **oficial** para todo o conteúdo de Animes. A sua API, baseada em
> GraphQL, foi escolhida por sua superioridade técnica, riqueza de dados
> e por fornecer de forma nativa funcionalidades críticas para o
> projeto, como a busca por dubladores em múltiplos idiomas.
>
> o **JustWatch:** A fonte de dados para informações de "Onde Assistir"
> = Funcionalidade adiada para a v2.0.
>
> o **Fontes** **Web** **(Wikipédia,** **etc.):** Utilizadas através de
> Web Scraping como fonte de dados primária para informações de
> premiações da indústria.
>
> • **Arquitetura** **de** **Backend** **(Proxy** **e** **Cache):** A
> arquitetura do backend será projetada para ser robusta e escalável,
> atuando como um intermediário seguro e eficiente entre o frontend e as
> APIs externas. Será obrigatória a implementação dos seguintes
> componentes:
>
> • **Proxy** **de** **API:** Todas as chamadas para APIs externas
> (TMDB, IGDB, etc.) serão feitas exclusivamente através do nosso
> backend. Esta abordagem é mandatória para proteger as chaves de API e
> para gerenciar fluxos de autenticação complexos, como o OAuth 2.0 da
> Twitch para a IGDB. O frontend nunca terá acesso direto às chaves.
>
> • **Camada** **de** **Cache** **Agressivo:** Para garantir alta
> performance, uma experiência de usuário fluida e o respeito aos
> limites de uso das APIs, uma camada de cache (ex: com Redis) será
> implementada. Respostas de API para dados que mudam com pouca
> frequência (como detalhes de um jogo ou filme) serão cacheadas no
> servidor, reduzindo drasticamente a latência e o número de chamadas
> externas.
>
> • **Banco** **de** **Dados:** **PostgreSQL** para armazenamento
> persistente dos dados.
>
> • **Frontend:** Aplicação web moderna construída com **Next.js** (App
> Router), **TypeScript** e estilizada com **Tailwind** **CSS**.
>
> • **Controle** **de** **Versão:** O projeto é versionado com **Git** e
> hospedado no **GitHub**.
>
> • **Comunicação** **API:**
>
> o **RESTful:** Será a espinha dorsal da nossa comunicação para todas
> as solicitações de dados iniciadas pelo usuário (carregar páginas,
> abrir modais, pesquisar).
>
> o **WebSocket:** Será implementado especificamente para o **sistema**
> **de** **notificações** **em** **tempo** **real**, permitindo que o
> backend "avise" o frontend instantaneamente quando houver novidades.
>
> o **Diagrama** **de** **Arquitetura** **Simplificado:**
>
> ▪ Frontend (Next.js no Vercel) ↔️ Backend (FastAPI no Render) ↔️ Banco
> de Dados (PostgreSQL) & Cache (Redis)
>
> ▪ Frontend ↕️ Backend via **WebSocket** (para notificações em tempo
> real, com mensagens distribuídas pelo Redis Pub/Sub).
>
> ▪ Backend ↔️ **APIs** **Externas** (TMDB, IGDB, JustWatch, etc.).
>
> ▪ Frontend ↔️ **CDN** **de** **Imagens** (Cloudflare ou a CDN nativa
> da Vercel).
>
> • **Estratégia** **de** **Coleta** **e** **Distribuição** **de**
> **Dados**
>
> o O projeto Orbe Nerd utiliza duas estratégias distintas e
> complementares para a atualização de dados: **Polling** para a
> comunicação com APIs externas e **WebSocket** para a comunicação
> interna entre o nosso backend e o frontend.
>
> • **Coleta** **de** **Dados** **Externos** **(Polling):**
>
> o Para obter dados de fontes que não controlamos (TMDB, IGDB, etc.),
> nosso script de sincronização (sync_data.py) emprega uma estratégia de
> **Polling** **Periódico**.
>
> o Isso significa que o nosso servidor, em intervalos de tempo
> programados, fará requisições a essas APIs para "puxar" (pull)
> quaisquer atualizações ou novos itens.
>
> o Esta abordagem é necessária pois as APIs externas operam em um
> modelo de requisição-resposta e não oferecem um serviço para nos
> "empurrar" (push) as novidades em tempo real.
>
> • **Distribuição** **de** **Notificações** **Internas**
> **(WebSocket):**
>
> o Para a comunicação entre o nosso backend e o frontend do Orbe Nerd,
> utilizaremos
>
> **WebSockets** para notificações em tempo real.
>
> o Quando o nosso sistema de Polling detecta uma novidade e a salva em
> nosso banco de dados, o backend utilizará a conexão WebSocket ativa
> para "empurrar" (push) instantaneamente uma notificação para a
> interface do usuário.
>
> o Isso garante que o usuário receba alertas (como a "bolinha vermelha"
> no ícone de sino ) sem a necessidade de recarregar a página,
> proporcionando uma experiência verdadeiramente dinâmica e moderna.
>
> **Fluxo** **de** **Exemplo** **(Anúncio** **de** **Novo** **Jogo):**
>
> 1\. O script sync_data.py executa sua verificação periódica na API da
> IGDB (Polling).
>
> 2\. Ele descobre um novo jogo recém-anunciado e o salva no banco de
> dados PostgreSQL.
>
> 3\. O nosso backend detecta essa nova entrada e gera uma notificação.
>
> 4\. O backend envia essa notificação via **WebSocket** para todos os
> clientes conectados.
>
> 5\. O frontend, ao receber a mensagem, atualiza a interface do usuário
> em tempo real para exibir o alerta de nova notificação
>
> *3.* *Funcionalidades* *Detalhadas* *do* *Backend*
>
> **3.1.** **Sincronização** **Avançada** **de** **Dados**
> **(sync_data.py)**
>
> O coração do Orbe Nerd. Este script não é apenas um coletor, mas um
> processador de dados.
>
> • **Escopo** **da** **Coleta:**
>
> o A visão de longo prazo é ter uma base de dados completa, com todos
> os itens de todos os anos.
>
> o Para a fase de desenvolvimento e lançamento inicial, o script será
> configurado para buscar todos os dados de Filmes, Séries, Animes e
> Jogos do ano.
>
> • **Lógica** **de** **"Atualizar** **ou** **Criar"** **(Upsert):**
>
> o O script deve implementar uma lógica de *upsert*. Ao buscar dados,
> para cada item, ele deve verificar se o ID já existe no banco.
>
> o **Se** **existe:** Ele deve comparar os dados recém-buscados com os
> dados no banco e **atualizar** qualquer campo que tenha mudado (ex:
> nova data de estreia, mudança de status de dublagem, etc.).
>
> o **Se** **não** **existe:** Ele deve criar um novo registro no banco
> de dados.
>
> • **Paginação** **e** **Controle** **de** **Taxa** **(Regra** **do**
> **"Bom** **Vizinho"):**
>
> o Todas as chamadas para as APIs externas devem ser feitas com
> **paginação**. O script deve buscar os dados em lotes (ex: 20 itens
> por vez) e fazer uma pausa educada entre as requisições para não
> sobrecarregar os servidores externos e evitar bloqueios.
>
> • **Coleta** **de** **Dados** **de** **Premiações:**
>
> o **Coleta** **de** **Dados** **de** **Premiações** **(Estratégia**
> **Definitiva):** A pesquisa aprofundada confirmou que as APIs de mídia
> primárias não fornecem dados estruturados sobre prêmios (vencedores
> vs. indicados). Para garantir a alta qualidade desta feature, o
> projeto adotará uma solução de **Web** **Scraping** **focado** como
> fonte primária.
>
> o Uma sub-rotina no sync_data.py será responsável por acessar fontes
> de alta consistência, como as tabelas da **Wikipédia** e de sites
> oficiais, extraindo as listas de indicados e vencedores para popular o
> campo premiacoes no banco de dados
>
> • **Implementação** **do** **"Detetive** **Digital** **2.0"**
> **(Integração** **ingresso.com):**Esta é uma sub-rotina do
> sync_data.py com gatilhos específicos:
>
> o **Gatilho** **por** **Evento:** Se um filme que vai sair nos cinemas
> é novo ou teve sua data de estreia atualizada, o Detetive tenta gerar
> o link direto para o ingresso.com (baseado no título em português) e
> verifica se a página existe (resposta 200 OK). Uma vez que o link do
> ingresso.com seja validado (retornando status 200 OK), o Detetive
> passará a verificar diariamente, ele deve validar todo dia os filmes
> que vão lançar em um período de 2 meses para ver se a pré-venda já
> está disponível, respeitando a regra da boa vizinhança.
>
> o **Armazenamento:** Se um link direto for validado, ele é salvo no
> campo ingresso_link. A data da verificação é salva em
> ultima_verificacao_ingresso. O detetive valida dentro do ingresso.com
> se esse filme está em pré-venda pelo elemento da página e O status
> em_prevenda é ativado e é adicionado um ícone de pré-venda igual ao do
> ingresso.com, quando a data de lançamento do filme passar, o status é
> automaticamente desativado.
>
> o **Notificação** **de** **Falha:** Se o link direto não for
> encontrado, o Detetive cria uma **notificação** no banco de dados para
> o **administrador** (ex: "Link do Ingresso.com não encontrado para
> \[Nome do Filme\]") o admin pode clicar nessa notificação e ela abre o
> modal de detalhes do filme.
>
> • **Agendamento** **(Produção):**
>
> o Quando o projeto estiver no ar, a rotina de sincronização deve ser
> configurada para rodar automaticamente toda.
>
> o **segunda-feira**. A rotina do Detetive Digital, por sua vez, deve
> rodar uma vez por dia.
>
> • **Implementação** **do** **"Radar** **de** **Eventos"** **(Foco**
> **em** **Jogos):** Para capturar anúncios de jogos feitos em grandes
> eventos, o sync_data.py utilizará a API da IGDB com uma abordagem
> dupla para máxima precisão.
>
> • O script irá tanto monitorar o endpoint /events para buscar listas
> de jogos associados a eventos específicos , quanto monitorar os
> timestamps (created_at, updated_at) para capturar anúncios
> inesperados. Ao identificar um novo anúncio, o jogo será salvo e
> associado automaticamente ao evento correspondente no banco de dados.
>
> • **Associação** **Automática:** Ao identificar um novo anúncio, o
> script salvará o jogo e o associará automaticamente ao evento
> correspondente no banco de dados, garantindo que a fonte do anúncio
> seja registrada sem intervenção manual.
>
> • **Fonte** **de** **Dados:** A principal fonte será a API do IGDB.
>
> • **Lógica** **de** **Automação:** O script irá monitorar a API do
> IGDB durante as datas de eventos pré-configurados, buscando por jogos
> recém-adicionados ou que receberam trailers com títulos como "Reveal"
> ou "Announcement".
>
> • **Associação** **Automática:** Ao identificar um novo anúncio, o
> script salvará o jogo e o associará automaticamente ao evento
> correspondente no banco de dados, garantindo que a fonte do anúncio
> seja registrada sem intervenção manual.
>
> • **Coleta** **de** **Dados** **de** **Premiações** **(Estratégia**
> **Definitiva** **via** **Web** **Scraping):** A pesquisa aprofundada
> confirmou que as APIs de mídia primárias (TMDB, OMDb) não fornecem
> dados estruturados e confiáveis sobre prêmios da indústria (vencedores
> vs. indicados). Para garantir a alta qualidade desta feature, o
> projeto adotará uma solução de **Web** **Scraping** **focado** como
> fonte primária para estes dados.
>
> • **Lógica** **de** **Implementação:** Uma nova sub-rotina será
> desenvolvida no sync_data.py. Essa rotina será responsável por acessar
> fontes de dados de alta autoridade e consistência, como as tabelas de
> premiações da **Wikipédia** e de sites oficiais dos eventos.
>
> • **Processo:** O script irá extrair (scrape) as listas de indicados e
> vencedores de cada categoria relevante, estruturar essa informação em
> formato JSON e preencher o campo premiacoes no banco de dados do Orbe
> Nerd. Esta abordagem garante a precisão e a profundidade necessárias
> para a página /premios e para os ícones nos MidiaCards.
>
> ***3.2**.* *Estrutura* *do* *Banco* *de* *Dados* *e* *Modelos*
> *(models.py)*
>
> A base de dados será composta por tabelas interconectadas para
> armazenar os dados das mídias, as informações dos usuários, suas
> interações e as notificações geradas pelo sistema.
>
> **Tabela** **Base** **de** **Mídia** **(Conceito** **Abstrato)** as
> tabelas filmes, series, animes e jogos compartilharão uma estrutura
> base comum, além de seus campos específicos.
>
> • **Estrutura** **Base** **Comum:**
>
> o id: Integer, Chave Primária (vindo da API externa) (Ou criar o ID
> com GUID).
>
> o titulo_api: String (Título original da API).
>
> o titulo_curado: String (Editável pelo Admin).
>
> o poster_url_api: String (URL do pôster vindo da API).
>
> o poster_curado: String (URL para pôster customizado pelo Admin).
>
> o data_lancamento_api: Date (Data vinda da API).
>
> o data_lancamento_curada: Date (Editável pelo Admin).
>
> o sinopse_api: Text (Sinopse vinda da API).
>
> o sinopse_curada: Text (Editável pelo Admin).
>
> o plataformas_api: Array de Strings (Plataformas vindas da API).
>
> o plataformas_curadas: Array de Strings (Editável pelo Admin).
>
> o trailer_url_api: String (Trailer vindo da API).
>
> o trailer_url_curado: String (Editável pelo Admin).
>
> o generos_api: JSONB (Gêneros vindos da API).
>
> o generos_curados: JSONB (Editável pelo Admin).
>
> o premiacoes: JSONB (Estrutura para armazenar prêmios, indicados e
> vencedores).
>
> • **Campos** **Específicos** **por** **Tabela:**
>
> o **filmes**: Adiciona ingresso_link (String), em_prevenda (Boolean),
> ultima_verificacao_ingresso (DateTime), duracao (Integer), diretor
> (String), escritor (String), elenco (JSONB).
>
> o **series**: Adiciona numero_temporadas (Integer), numero_episodios
> (Integer), criadores (Array de Strings), elenco (JSONB).
>
> o **animes**: Adiciona fonte (String), estudio (String), dublagem_info
> (Boolean), staff (JSONB), personagens (JSONB),
> eventos_recorrentes_calendario (Boolean).
>
> o **jogos**: Adiciona desenvolvedores (Array de Strings), publicadoras
> (Array de Strings).
>
> **Tabela** **de** **Usuários** **(users)** Armazena as informações de
> cada conta registrada.
>
> • id: Integer, Chave Primária, Autoincremento.
>
> • email: String, Único, Não Nulo.
>
> • hashed_password: String, Não Nulo.
>
> • role: String, Não Nulo, Padrão: 'user' (Valores possíveis: 'user',
> 'admin').
>
> • quer_avaliar: Boolean, Não Nulo, Padrão: true (A flag de perfil para
> o modal de avaliação).
>
> • data_criacao: DateTime.
>
> **Tabela** **de** **Preferências** **(preferencias_usuario_midia)**
> Registra cada interação de um usuário com uma mídia.
>
> • id: Integer, Chave Primária, Autoincremento.
>
> • usuario_id: Integer, Chave Estrangeira para users.id.
>
> • midia_id: Integer (ID da mídia, vindo da API externa).
>
> • tipo_midia: String (Valores: 'filme', 'serie', 'anime', 'jogo').
>
> • status: String, Não Nulo (Valores: 'favorito', 'quero_assistir',
> 'acompanhando', 'assistido', 'oculto').
>
> • avaliacao: String (Valores: 'gostei', 'amei', 'nao_gostei').
>
> • data_interacao: DateTime.
>
> **Tabela** **de** **Notificações** **(notificacoes)** Armazena as
> notificações geradas pelo sistema para os usuários.
>
> • id: Integer, Chave Primária, Autoincremento.
>
> • usuario_id: Integer, Chave Estrangeira para users.id (para quem é a
> notificação, pode ser nulo para notificações globais se necessário).
>
> • midia_id: Integer (Opcional, ID da mídia relacionada).
>
> • tipo_midia: String (Opcional, tipo da mídia relacionada).
>
> • titulo: String (O texto da notificação, ex: "Novos indicados ao
> Oscar anunciados!").
>
> • tipo_notificacao: String (Valores: "NOVO_ITEM", "ATUALIZACAO_DATA",
> "DUBLAGEM", "INDICADOS_PREMIO", "VENCEDOR_PREMIO",
> "FALHA_LINK_INGRESSO", "LANCAMENTO_FAVORITO").
>
> • foi_visualizada: Boolean, Não Nulo, Padrão: false.
>
> • data_criacao: DateTime.
>
> • **Tabela** **de** **Eventos** **de** **Anúncio**
> **(eventos_anuncio)**: Uma nova tabela será criada para catalogar os
> eventos da indústria.
>
> o id: Integer, Chave Primária, Autoincremento.
>
> o nome: String (Ex: "The Game Awards 2025").
>
> o data_evento: Date.
>
> • **Adição** **à** **Tabela** **jogos**: Para conectar os jogos aos
> seus eventos de anúncio, a tabela jogos será modificada para incluir:
>
> o evento_anuncio_id: Integer, Chave Estrangeira (opcional) para
> eventos_anuncio.id.
>
> **3.3.** **Lógica** **da** **API** **(main.py,** **crud.py,**
> **schemas.py)**
>
> • **Endpoints** **de** **Mídia:** Listagem , Detalhes (com agregação
> de dados de outras APIs como JustWatch) e Pesquisa.
>
> • **Endpoints** **de** **Autenticação** **e** **Usuários:** Rotas
> protegidas para /login, /register e para gerenciar os dados do perfil.
>
> • **Endpoints** **de** **Curadoria** **(Admin):** Endpoints PUT e
> DELETE (ex: /api/filmes/{id}) protegidos, que só podem ser acessados
> por usuários com a role "admin" para aplicar os "overrides".
>
> • **Endpoints** **de** **Notificação:** Rotas para buscar as
> notificações, verificar o status de "não lidas" e marcá-las como
> lidas.
>
> • **Gerenciamento** **de** **Autenticação** **Externa:** O backend
> incluirá um módulo dedicado para gerenciar os diferentes mecanismos de
> autenticação das APIs externas. Isso inclui a implementação completa
> do fluxo OAuth 2.0 Client Credentials para a Twitch/IGDB, com lógica
> para armazenar, utilizar e renovar automaticamente os tokens de acesso
> de forma segura.
>
> *4.* *Funcionalidades* *e* *Layout* *do* *Frontend*
>
> **4.1.** **Navegação** **Principal** **(Componente** **Header.tsx)**
>
> • **Estrutura** **e** **Estilo:** Deve ser uma barra de navegação
> superior, fixa no topo da página (sticky), com um fundo escuro
> translúcido e efeito de desfoque (backdrop-blur) para um visual
> moderno.
>
> • **Elementos:**
>
> o **Logo** **"Orbe** **Nerd":** Posicionado à esquerda, com estilo de
> gradiente, e deve funcionar como um link para a página inicial (/).
>
> o **Links** **de** **Navegação:** "Filmes", "Animes", "Séries" e
> "Jogos" devem aparecer ao lado da logo.
>
> o **Estado** **Ativo:** O link da página atual (ex: "Filmes" na página
> /filmes) deve ter um estilo visual distinto (cor ou sublinhado) para
> indicar a localização do usuário.
>
> o **Pesquisa** **Global:** Uma barra de pesquisa deve ser integrada ao
> Header, permitindo que o usuário inicie uma busca a partir de qualquer
> página.
>
> o **Ícone** **de** **Notificações:** Um ícone de "sino" será
> posicionado no Header, servindo como ponto de entrada para o sistema
> de notificações.
>
> o **Botão** **de** **Premiações:** Um novo link "Premiações", talvez
> acompanhado de um ícone de "troféu", será adicionado à barra de
> navegação principal. Este link levará o usuário para a nova página
> /premios.
>
> o **Ações** **de** **Usuário:**
>
> ▪ **Para** **usuários** **não** **logados:** Botões "Entrar" e
> "Inscreva-se".
>
> ▪ **Para** **usuários** **logados:** Um ícone de perfil que, ao ser
> clicado, abre um menu com links para "Meu Perfil" e "Sair".
>
> • **Responsividade:** O menu de navegação e as ações de usuário devem
> se agrupar em um ícone "hambúrguer" em telas menores.
>
> **4.2.** **Página** **Inicial** **(/)**
>
> • **Layout:** A página principal deve exibir uma série de carrosséis
> roláveis horizontalmente. O conteúdo dos carrosséis deve focar apenas
> no ano corrente (ex: 2025); mídias de outros anos aparecerão apenas
> nas
>
> páginas de catálogo.
>
> • **Ordem** **dos** **Carrosséis:** A sequência de exibição será: 1.
> Filmes, 2. Animes, 3. Séries, 4. Jogos.
>
> • **Carrossel** **Inteligente** **(Timeline** **Interativa):**
>
> o **Filmes** **e** **Séries:** O título do carrossel mudará
> dinamicamente (ex: "Agosto", "Setembro") conforme o usuário navega no
> tempo. Ele deve iniciar focado no próximo lançamento a partir da data
> atual.
>
> o **Botões** **de** **Navegação:** Adicionaremos os botões 《e 》ao
> lado do título. O botão 》(avançar) pulará para o primeiro lançamento
> do mês seguinte. O botão 《(voltar) pulará para o lançamento mais
> próximo do mês atual, e se voltar para o mês passado ele voltará para
> o primeiro lançamento do mês.
>
> • **Lógica** **de** **Conteúdo** **dos** **Carrosséis:**
>
> o **Uma** **função** **que** **vai** **ter** **em** **todos** **os**
> **carrosséis** **vai** **ser:** Ao clicar no titulo do carrossel não
> importa em qual seja a posição que o usuário esta visualizando a
> mídia, o carrossel vai voltar para o primeiro item que deve ser
> visualizado.
>
> o **Filmes/Séries:** Exibirão os itens do ano corrente, ordenados por
> data futura primeiro.
>
> o **Animes:** O título será "Animes da Temporada de \[Estação
> Atual\]". A ordenação será por proximidade do próximo episódio a ser
> lançado (ex: um anime que lança na quinta-feira aparecerá antes de um
> que lança na segunda-feira seguinte). Animes finalizados devem sair do
> carrossel.
>     - **Filtros de Visualização:** Acima do carrossel de animes, haverá três botões de filtro:
>         - **"Todos":** Exibe todos os animes da temporada (comportamento padrão).
>         - **"Novos":** Filtra a lista para mostrar apenas animes que não são continuações diretas (ou seja, a fonte não é outro anime). Isso inclui animes originais e novas adaptações de mangás, light novels, etc.
>         - **"Continuações":** Filtra a lista para mostrar apenas animes que são novas temporadas ou sequências diretas de outras obras de anime.
>
> o **Jogos:** O título será "Estreias de jogos de \[Ano Atual\]". Os
> jogos já lançados **não** **serão** **removidos** do carrossel para
> manter o catálogo do ano visível, mas o primeiro a ser visualizado vai
> ser o próximo a ser lançado, mas como o carrossel vai poder voltar
> para visualizar os que já foram lançados.
>
> **4.3.** **O** **Card** **de** **Mídia** **(Componente**
> **MidiaCard.tsx)** Este é o componente visual principal para exibir
> cada item nos carrosséis e grades.
>
> • **Layout:**
>
> o Imagem do pôster com um efeito de hover sutil (ex: leve aumento de
> escala).
>
> o Abaixo da imagem, as informações devem ser claras e legíveis, com
> rótulos em negrito: "**Nome:**", "**Lançamento:**" (ou
> "**Episódio:**"), "**Plataformas:**".
>
> • **Ícones** **Sobrepostos** **ao** **Pôster:**
>
> o **Ícones** **de** **Premiação:** Ícone **dourado** para "Vencedor" e
> **prateado** para "Indicado", com o ano do prêmio.
>
> o **Ícone** **de** **Novo** **Episódio:** Para séries e animes que o
> usuário marcou como "Acompanhando", um ícone de **"Novo"** aparecerá
> quando é lançado um novo episódio. O ícone sumirá após o usuário
> clicar no card para ver os detalhes.
>
> o **Ícone** **de** **pré-venda:** Quando o detetive validar que o
> filme está em pré-venda deve aparecer um ícone de pré-venda abaixo do
> pôster
>
> • **Lógica** **Especial** **para** **Animes** **(Contagem**
> **Regressiva):** A API do Anilist fornece os dados de exibição do
> próximo episódio, confirmando a viabilidade desta feature.
>
> o Se a data de lançamento do anime já passou, o rótulo "Lançamento"
> será substituído por:
>
> ▪ **Episódio** **\[Nº\]:**" seguido por um contador de tempo em tempo
> real para a próxima exibição (ex: 1d, 12h e 30m).
>
> • **Droplist** **de** **Ações** **Rápidas** **(ativada** **por** **3**
> **pontinhos** **ou** **"clicar** **e** **segurar"):**
>
> o **Favoritar:** Aciona notificações e a função de calendário.
>
> o **Quero** **Assistir:** Salva na "Minha Lista" do perfil e notifica
> o usuário sobre o lançamento.
>
> o **(Ícone** **de** **estrela)** **Acompanhando:** (Visível apenas
> para animes e séries com lançamento semanal) Notifica sobre novos
> episódios e ativa o ícone "Novo" no card.
>
> o **Já** **Assisti** **/** **Já** **Joguei:** Aciona o fluxo de
> avaliação e move para a lista de "Assistidos" se for um Filme, Serie e
> Anime, se for um Jogo o nome do botão será Já Joguei e o jogo ficara
> salvo na lista Jogados do perfil, uma regra de negócio importante ao
> clicar em já assisti caso a data de estreia seja maior que a data do
> dia, o botão deve ficar desabilitado, e não deve ser possível clicar
> ou se clicar não deve acontecer nada em caso de manipulação via
> inspecionar elemento, outra regra importante, após clicar nesse botão
> irá aparecera um modal Você gostou de Assistir (No caso de filmes,
> series e animes) ou Jogar (No caso de jogos) essa
> filmes/Anime/Serie/Jogo, terá 3 opções, Gostei, Amei, Não gostei, após
> clicar em qualquer botão aparecera um novo modal gostaria de deixar
> sua análise dessa Filmes/Anime/Serie/Jogo, terá duas opções, Avaliar e
> Pular, essa opção de analisar ou pular o usuário poder fazer mas o de
> avaliar com Gostei Amei ou Não Gostei ele
>
> não poderá pular ou ignorar, deve ter uma aba dentro no menu de
> assistidos ou jogados onde o usuário poderá navegar entre os que ele
> gostou, amou ou não gostou.
>
> o **Não** **me** **Interessa:** Oculta o item da home (com opção de
> desfazer).
>
> **4.4.** **Páginas** **de** **Catálogo** **(/filmes,** **/series,**
> **etc.)**
>
> • **Layout:** Cada página de categoria exibirá o Header e, abaixo, um
> título (ex: "Catálogo de Filmes"). O conteúdo principal será uma grade
> responsiva de MidiaCards.
>
> • **Funcionalidade** **de** **Filtros:** No topo da grade, devem
> existir controles de filtro (menus dropdown, checkboxes, etc.) para
> que o usuário possa refinar a lista por gênero, plataforma, tags, e
> outros critérios relevantes para cada categoria deverá ter pré filtros
> rápidos, como lançamentos de \[Mês atual\] entre outros (elaborar
> filtros).
>
> • **Navegação:** Cada card na grade funcionara igual ao midiacard da
> tela inicial, ao clicar nele ele ira abrir um modal de detalhes da
> mídia.
>
> **4.5.** **Sistema** **de** **Pesquisa** **Global** **(Overlay**
> **Interativo** **"Estilo** **Netflix** **da** **TV")**
>
> A funcionalidade de pesquisa será uma feature central e imersiva,
> inspirada nas interfaces de Smart TVs, priorizando a interatividade em
> tempo real e uma experiência de usuário fluida.
>
> **Lógica** **de** **Ativação** **e** **Interface:**
>
> • **Ativação** **por** **Overlay** **de** **Tela** **Cheia:** Ao invés
> de redirecionar para uma nova página, um clique no ícone de "lupa" no
> Header.tsx acionará um **overlay** **de** **tela** **cheia**. Esta
> camada surgirá com uma animação suave sobre o conteúdo atual, mantendo
> o usuário no contexto e eliminando a necessidade de um carregamento de
> página.
>
> • **Interface** **Focada:** O overlay apresentará uma interface limpa,
> com o campo de texto da busca no topo.
>
> **Lógica** **de** **Busca** **e** **Exibição** **de** **Resultados:**
>
> • **Pesquisa** **em** **Tempo** **Real** **("Live** **Search"):** A
> cada letra digitada pelo usuário, o frontend disparará uma chamada
> para o endpoint da API GET /api/pesquisa. A grade de resultados será
> atualizada instantaneamente, sem a necessidade de submeter a busca com
> "Enter".
>
> • **Estado** **Inicial** **(Descoberta):** Antes de o usuário iniciar
> a digitação, a área de resultados exibirá uma grade de "Buscas
> Populares da Semana", incentivando a descoberta de conteúdo.
>
> • **Layout** **dos** **Resultados:** Os resultados serão exibidos em
> uma **grade** **responsiva** **de** **MidiaCards**, ocupando a maior
> parte do overlay. Os itens serão agrupados por categoria, com
> subtítulos claros: "Filmes", "Séries", "Animes", "Jogos".
>
> • **Estado** **Sem** **Resultados:** Se a busca não retornar nenhum
> item, a página exibirá uma mensagem amigável e centralizada: "Nenhum
> resultado encontrado para a sua busca.".
>
> **Fluxo** **de** **Interação** **do** **Usuário:**
>
> 1\. O usuário clica no ícone de busca no Header.
>
> 2\. O overlay de pesquisa surge em tela cheia.
>
> 3\. O usuário começa a digitar. A cada tecla pressionada, a grade de
> resultados abaixo é atualizada em tempo real.
>
> 4\. O usuário pode usar as setas do teclado para navegar entre os
> MidiaCards na grade.
>
> 5\. Ao pressionar "Enter" em um card selecionado, o overlay de
> pesquisa se fecha e o **"Super** **Modal"** **de** **Detalhes**
> daquele item é aberto, concluindo o fluxo de busca de forma rápida e
> intuitiva.
>
> **4.6.** **Página** **"O** **que** **tem** **pra** **hoje"**
> **(/hoje)**
>
> • **Gatilho:** Um novo botão "O que tem pra hoje" será adicionado ao
> Header.tsx, levando o usuário a uma nova página.
>
> • **Layout:** A página /hoje será dividida em abas: "Filmes",
> "Animes", "Séries" e "Jogos".
>
> • **Lógica** **de** **Conteúdo:**
>
> o **Filmes:** A aba "Filmes" terá duas seções:
>
> 1\. **"Bombando** **nos** **Streamings":** Exibirá os filmes com maior
> popularidade atualmente, com base nos dados do TMDB.
>
> 2\. **"Em** **cartaz** **no** **Cinema":** Exibirá os filmes que estão
> em cartaz.
>
> o **Animes,** **Séries,** **Jogos:** Cada aba exibirá uma lista dos
> itens mais populares ("trending") da semana/mês, com base nos dados de
> suas respectivas APIs.
>
> **4.7.** **O** **"Super** **Modal"** **de** **Detalhes**
> **(Componente** **DetailsModal.tsx)**
>
> • **Ativação:** Deve abrir quando um MidiaCard em qualquer página é
> clicado, ou é clicado no card no modal de notificação.
>
> • **Layout** **Geral:** Deve ocupar a tela inteira, com um fundo
> escurecido e um botão "X" proeminente para fechar, pode ser fechado
> com o botão voltar do celular ou do tablet ou com a tecla ESC. O
> conteúdo do modal deve ter scroll vertical independente para acomodar
> a grande quantidade de informações.
>
> • **Funcionalidade** **de** **Admin** **("Edição** **no** **Local"):**
> Um ícone de "lápis" no canto, visível apenas para admins, transformará
> o modal em um formulário de edição completo, com a lógica de
> "override" para salvar as alterações.
>
> • **Layout** **Específico** **para** **Filmes:**
>
> o **Estrutura:** Layout em duas colunas para desktop.
>
> o **Coluna** **Esquerda:** Pôster do filme.
>
> o **Coluna** **Direita:** Título, Título Original, Data de Estreia,
> Gênero(s), Duração, Direção, Roteiro, Plataforma(s) disponíveis.
>
> o **Botões** **de** **Ação:**
>
> ▪ **"Adicionar** **ao** **Calendário":** Acionará o fluxo detalhado de
> criação de eventos.
>
> o **Conteúdo** **Adicional:** Sinopse, Trailer do YouTube embutido e
> um **Carrossel** **de** **Elenco** (CastCarousel.tsx) com foto, nome
> dos ator e nome do personagem.
>
> • **Layout** **Específico** **para** **Séries:**
>
> o **Estrutura:** Similar ao de filmes.
>
> o **Coluna** **Esquerda:** Pôster da série.
>
> o **Coluna** **Direita:** Título, Data de Estreia, Gênero(s), Nº de
> Temporadas, Nº de Episódios em cada temporada, Criador(es),
> Plataforma(s) disponíveis.
>
> o **Botões** **de** **Ação:**
>
> ▪ **"Adicionar** **ao** **Calendário":** Acionará o fluxo de criação
> de evento de lançamento.
>
> o **Conteúdo** **Adicional:** Sinopse e o **Carrossel** **de**
> **Elenco** principal.
>
> • **Lógica** **de** **Exibição** **dos** **Botões** **de** **Ação**
> **(V1)**
>
> o Os botões de ação principais ("Comprar Ingresso", "Assistir",
> "Conferir Jogo") serão exibidos de forma contextual, garantindo que o
> usuário sempre tenha uma ação útil e direta. A regra geral é: se não
> houver um link de destino válido e direto, o botão não será
> renderizado.
>
> o **Para** **Filmes:**
>
> ▪ **Botão** **"Comprar** **Ingresso":** Este botão será exibido
> **apenas** **se** o filme estiver em cartaz e o "Detetive Digital"
> tiver encontrado um link válido para o ingresso.com, que será
> armazenado no campo ingresso_link do banco de dados. Se não houver
> link, o botão não aparece.
>
> ▪ **Botão** **"Assistir":** Este botão será exibido **apenas** **se**
> a API da TMDB fornecer um link direto para a página do filme em uma
> plataforma de streaming reconhecida. O nome do botão será apenas
> "Assistir".
>
> o **Para** **Séries** **e** **Animes:**
>
> ▪ **Botão** **"Assistir":** O botão será exibido **apenas** **se** a
> API (TMDB para séries, Anilist para animes) fornecer um link direto
> para a página do conteúdo em uma plataforma de streaming reconhecida.
>
> o **Para** **Jogos:**
>
> ▪ **Botões** **de** **Plataforma** **("Conferir** **Jogo"):** A
> abordagem para jogos será diferente. Ao invés de um único botão, a
> interface exibirá uma
>
> ▪ **lista** **de** **ícones** **clicáveis** **para** **cada**
> **plataforma** em que o jogo está disponível (ex: Steam, PlayStation
> Store, Xbox, Nintendo eShop).
>
> ▪ Cada ícone funcionará como um botão, redirecionando o usuário
> diretamente para a página de compra do jogo na loja correspondente.
>
> ▪ Esta funcionalidade será implementada **contanto** **que** a
> pesquisa da API da IGDB confirme que é possível obter uma lista
> estruturada com os links para cada uma dessas lojas. Caso contrário,
> um único botão "Conferir Jogo" levará à página oficial do jogo como
> fallback.
>
> o ***Nota*** ***de*** ***Arquitetura:*** *A* *implementação* *desta*
> *lógica* *de* *exibição* *contextual* *depende* *diretamente* *dos*
> *resultados* *da* *pesquisa* *das* *APIs.* *A* *premissa* *para* *a*
> *V1* *é* *que* *as* *APIs* *da* *TMDB,* *Anilist* *e* *IGDB*
> *fornecerão* *os* *links* *diretos* *necessários* *para* *plataformas*
> *de* *streaming* *e* *lojas* *de* *jogos.* *Se* *a* *pesquisa*
> *provar* *o* *contrário,* *a* *lógica* *será* *simplificada*
> *conforme* *a* *necessidade.*
>
> • **Layout** **Específico** **para** **Animes** **(O** **"Super**
> **Modal"):** A pesquisa técnica confirmou a viabilidade de todas as
> features planejadas para este modal, que será a experiência mais rica
> do site.
>
> o **Estrutura:** Layout customizado para a riqueza de detalhes.
>
> o **Seção** **Superior:** Pôster, Nome, Streaming(s) (com links
> diretos, se a API fornecer), Status de **Dublagem?** (Sim/Não), Fonte
> (Mangá/Original), Gênero(s), Estúdio, Estreia, Nº de Episódios e Link
> para o MyAnimeList.
>
> o **Botões** **de** **Ação:** "Assistir" e "Adicionar ao Calendário"
> (com a função de criar **eventos** **recorrentes** para todos os
> episódios).
>
> o **Seção** **de** **Mídia:** Trailer do YouTube embutido.
>
> o **Carrossel** **de** **Personagens** **e** **Dubladores:**
>
> ▪ Exibirá a foto do personagem, seu nome e, abaixo, a foto e nome do
> dublador.
>
> ▪ Deverá conter um **seletor** **(botões** **JP/PT-BR)** para alternar
> a exibição entre os dubladores japoneses e brasileiros. A API do
> Anilist suporta nativamente esta funcionalidade.
>
> o **Carrossel** **de** **Equipe** **(Staff):** Um carrossel dedicado
> para a equipe principal (Diretor, Compositor, etc.).
>
> ***Nota*** ***de*** ***Arquitetura*** ***(Dados*** ***de***
> ***Dublagem):*** *A* *disponibilidade* *de* *dados* *de* *dubladores*
> *em* *português* *do* *Brasil* *depende* *da* *contribuição* *da*
> *comunidade* *na* *plataforma* *Anilist.* *A* *interface* *de*
> *usuário* *será* *projetada* *para* *ter* *uma* *"degradação*
> *graciosa":* *caso* *os* *dados* *de* *dublagem* *em* *PT-BR* *não*
> *existam* *para* *um* *determinado* *personagem,* *a* *opção* *no*
> *seletor* *ou* *a* *seção* *correspondente* *não* *será* *exibida,*
> *garantindo* *uma* *experiência* *de* *usuário* *consistente* *e*
> *sem* *erros.*
>
> • **Layout** **Específico** **para** **Jogos:**
>
> o **Estrutura:** Layout similar ao de filmes.
>
> o **Coluna** **Esquerda:** Pôster do jogo.
>
> o **Coluna** **Direita:** Título, Data de Lançamento, Plataforma(s)
> (com logos), Gênero(s), Desenvolvedor(es), Publicador(es).
>
> o **Conteúdo** **Adicional:** Sinopse e Trailer.
>
> • **Botões** **de** **Plataforma** **("Conferir** **Jogo"):** A
> funcionalidade "Conferir Jogo" será implementada através de uma
> interface rica e intuitiva. Ao invés de um único botão, o modal
> exibirá uma **lista** **de** **ícones** **clicáveis**
> **representando** **cada** **loja** **digital** em que o jogo está
> disponível (ex: Steam, GOG, Epic Games Store, PlayStation Store, Xbox,
> etc.).
>
> • **Ação** **Direta:** Cada ícone funcionará como um botão,
> redirecionando o usuário diretamente para a página de compra do jogo
> na sua respectiva loja.
>
> • **Justificativa** **Técnica:** Esta implementação é possível pois a
> API da IGDB fornece uma lista de links externos categorizados através
> do seu campo websites, permitindo ao nosso backend filtrar e exibir
> dinamicamente os botões para as lojas relevantes.
>
> **4.8.** **Fluxos** **de** **Interação** **Avançada** **(Dentro**
> **do** **Modal)**
>
> • **Adicionar** **ao** **Calendário** **(com** **Inteligência):**
>
> o O botão "Adicionar ao Calendário" terá um comportamento contextual:
>
> o **Se** **for** **um** **Filme** **de** **Cinema:** ao clicar
> apresentará um modal com duas opções:
>
> 1\. **"Adicionar** **Evento** **de** **Lançamento":** Cria um evento
> simples com o título “Estreia do \[nome do filme\]” para a data de
> estreia.
>
> 2\. **"Adicionar** **Evento** **de** **Ingresso":** Abre uma interface
> onde o usuário pode **manualmente** adicionar data, hora e local do
> cinema. Uma **feature** **avançada** **futura** permitirá o upload de
> um print/PDF do ingresso para extração automática dos dados. O evento
> será nomeado "Assistir \[Nome do Filme\] no Cinema".
>
> o **Se** **for** **Anime:** Oferecerá a opção de criar **eventos**
> **recorrentes** para todos os episódios da temporada.
>
> o **Para** **as** **Demais** **Mídias:** Oferecerá a opção "Adicionar
> Evento de Lançamento".
>
> **4.9.** **Sistema** **de** **Contas** **e** **Perfil** **de**
> **Usuário**
>
> • **Criação** **de** **Conta** **e** **Login:** Serão criadas páginas
> dedicadas para /login e /register, permitindo que os usuários criem e
> acessem as suas contas de forma segura.
>
> • **Página** **de** **Perfil** **(/perfil):** Será a central do
> usuário, acessível através de um ícone no Header quando o usuário
> estiver logado. A página será dividida em seções:
>
> o **Minha** **Lista:** Uma galeria com todos os itens que o usuário
> marcou como " **Quero** **Assistir**", separado por abas, ao clicar no
> ícone que fica em cima do midiacard ele abre um modal perguntando se
> gostaria de tirar da minha lista, se ele clicar em sim a mídia some da
> galeria se clicar em não a requisição é cancelada.
>
> o **Favoritos:** Uma galeria com todos os itens marcados com "
> **Favoritar**", separado por abas, ao clicar no ícone que fica em cima
> do midiacard ele abre um modal perguntando se gostaria de tirar da
> galaeria, se ele clicar em sim a mídia some da galeria se clicar em
> não a requisição é cancelada.
>
> o **Assistidos** **/** **Jogados:** Uma galeria com tudo que o usuário
> já consumiu, separada por abas (Filmes, Séries, Animes, Jogos). Cada
> item aqui exibirá a avaliação dada pelo usuário e permitirá que ele a
> altere.
>
> o **Configurações:** Uma área para gerenciar preferências, incluindo a
> *flag* para ativar ou desativar o modal de sugestão de avaliação.
>
> • **Funcionalidade** **de** **Recomendação** **(/perfil/recomende)**:
>
> o **Gatilho:** Dentro da página de perfil, um botão **"Me**
> **Recomende"** levará o usuário ao início do fluxo de recomendação.
>
> o **Passo** **1:** **Seleção** **de** **Categoria:** Ao clicar, o
> sistema apresentará uma tela intermediária perguntando ao usuário para
> qual categoria ele deseja uma recomendação, com quatro opções
>
> claras: **"Filmes"**, **"Séries"**, **"Animes"** e **"Jogos"**.
>
> o **Lógica** **(Recomendação** **v1** **-** **Baseada** **em**
> **Conteúdo):** Após o usuário escolher uma categoria, o backend
> analisará os gêneros, atores, diretores e estúdios das mídias que o
> usuário marcou
>
> como " **Amei**" ou " **Gostei**" *naquela* *categoria* *específica*.
>
> o Com base nesses dados, ele buscará no banco de dados por outros
> itens com alta similaridade que o usuário ainda não interagiu.
>
> o **Interface** **de** **Recomendação:** O sistema apresentará as
> recomendações uma a uma, em uma interface focada:
>
> ▪ Pôster da mídia recomendada.
>
> ▪ Nome da mídia.
>
> o **Botões** **de** **Ação** **Contextuais:**
>
> ▪ Se a categoria for Filmes, Séries ou Animes, os botões serão: "
> **Vou** **Assistir**", " **Já** **Assisti**", " **Não** **quero**
> **Assistir**".
>
> ▪ Se a categoria for Jogos, os botões serão: " **Vou** **Jogar**", "
> **Já** **Joguei**", " **Não** **quero** **Jogar**".
>
> o Clicar no pôster abrirá o **"Super** **Modal"** **de** **Detalhes**
> daquela mídia.
>
> • **Papéis** **de** **Usuário:** O sistema terá dois níveis de
> permissão:
>
> o **Usuário** **Padrão:** Pode usar todas as funções de interação
> (favoritar, avaliar, etc.).
>
> o **Administrador:** Tem acesso a todas as funções de usuário, mais a
> capacidade de edição e curadoria do conteúdo.
>
> **4.10.** **Sistema** **de** **Notificações**
>
> • **Gatilho:** Uma bolinha vermelha aparece no ícone de sino no Header
> quando há novidades não lidas.
>
> • **Modal** **de** **Notificações:**
>
> o Ao clicar no sino, um modal se abre com uma lista de novidades.
>
> o **Tipos** **de** **Notificação:** "Item Novo", "Atualização de
> Data", "Dublagem Adicionada", "Indicados ao \[Prêmio\]", "Vencedores
> do \[Prêmio\]", etc.
>
> o Cada notificação mostra o pôster, o nome e o status.
>
> • **Lógica:** A bolinha some após a visualização. As notificações são
> geradas pelo sync_data.py.
>
> **4.11.** **Polimento** **Final** **e** **Animações**
>
> • **Animações** **de** **Entrada:** Adicionar animações sutis de
> fade-in para os carrosséis e grades de catálogo quando a página
> carregar.
>
> • **Transições** **de** **Página:** Implementar transições suaves
> entre as páginas (ex: da home para um catálogo) usando framer-motion.
>
> • **Micro-interações:** Adicionar feedback visual a botões e links,
> como pequenas animações de clique.
>
> • **Revisão** **Geral** **de** **UI/UX:** Fazer uma última revisão
> completa em todo o site, ajustando espaçamentos, tamanhos de fonte e
> cores para garantir consistência e perfeição visual.
>
> **4.12.** **Interface** **de** **Anúncios** **de** **Jogos**
> **(/jogos/anuncios)**
>
> • **Gatilho** **de** **Acesso:** Um novo botão ou banner de destaque
> será adicionado ao Header.tsx e/ou à seção de Jogos da página inicial
> durante as épocas de grandes eventos, levando o usuário para a nova
> interface de anúncios.
>
> • **Layout** **da** **Página:** A página /jogos/anuncios será dedicada
> a exibir os anúncios mais recentes. O layout será estruturado da
> seguinte forma:
>
> o **Agrupamento** **por** **Evento:** Os jogos anunciados serão
> agrupados sob títulos claros que identificam o evento onde foram
> revelados (ex: "Revelações da Summer Game Fest 2025").
>
> o **Card** **de** **Anúncio:** Cada jogo será apresentado em um card
> especial, projetado para esta interface, que exibirá:
>
> ▪ Pôster do jogo.
>
> ▪ Nome do jogo e plataformas anunciadas.
>
> ▪ Um player de vídeo embutido para exibir o trailer oficial de anúncio
> diretamente na página.
>
> **4.13.** **Página** **de** **Premiações** **(/premios)**
>
> • **Objetivo:** Criar uma central dedicada à descoberta de conteúdo
> premiado, permitindo que os usuários explorem os principais prêmios da
>
> indústria de filmes e jogos.
>
> • **Layout** **e** **Estrutura:** A página /premios será organizada de
> forma clara e intuitiva:
>
> o **Seleção** **de** **Eventos:** O topo da página apresentará uma
> seleção dos principais eventos cobertos pelo Orbe Nerd (ex: "Oscar",
> "The Game Awards", "Globo de Ouro").
>
> o **Navegação** **por** **Ano:** Ao selecionar um evento, o usuário
> poderá navegar pelas diferentes edições anuais.
>
> o **Exibição** **de** **Resultados:** Para cada edição, a página
> exibirá os resultados de forma categorizada (ex: "Melhor Filme",
> "Melhor Jogo do Ano").
>
> o **Destaque** **Visual:** Os itens **vencedores** terão um destaque
> visual claro (ex: um fundo dourado ou um selo de "Vencedor"), enquanto
> os **indicados** serão listados normalmente. Cada item será
> representado por um MidiaCard, permitindo que o usuário clique para
> abrir o "Super Modal" de detalhes.
>
> • **Lógica** **do** **Backend:** Para suportar esta página, um novo
> endpoint na API (ex: GET /api/premios) será criado para buscar e
> retornar todos os dados de premiações de forma organizada.
>
> 5\. Requisitos Não-Funcionais
>
> **5.1.** **Segurança**
>
> o **Autenticação:** O sistema utilizará tokens **JWT** **(JSON**
> **Web** **Tokens)**, incluindo *refresh* *tokens* para manter o
> usuário logado de forma segura.
>
> o **Senhas:** As senhas dos usuários serão armazenadas no banco de
> dados usando o algoritmo de hash **bcrypt** **com** **salt**.
>
> o **CORS:** A política de Cross-Origin Resource Sharing será restrita
> para permitir requisições apenas do domínio oficial do frontend.
>
> o **Rate** **Limiting:** A API implementará um limite de requisições
> (ex: 100 requisições por minuto por IP) para prevenir abuso e ataques
> de negação de serviço.
>
> o **Controle** **de** **Acesso** **(Roles):** As permissões de user e
> admin serão incluídas no token JWT e verificadas em cada rota
> protegida do backend.
>
> **5.2.** **Performance**
>
> o **Cache** **de** **APIs** **Externas:** Será implementado um cache
> com **Redis** (com TTL de 12 horas) para as respostas das APIs
> externas (TMDB, IGDB). Isso reduzirá a latência e a dependência de
> serviços de terceiros.
>
> o **Estratégia** **de** **Renderização:** O frontend usará **Static**
> **Site** **Generation** **(SSG)** ou **Incremental** **Static**
> **Regeneration** **(ISR)** do Next.js sempre que possível para páginas
> de catálogo, garantindo carregamento ultrarrápido.
>
> o **Paginação:** Todas as respostas da API que retornam listas serão
> paginadas, com um padrão de 20 itens por página.
>
> o **CDN** **de** **Imagens:** As imagens e pôsteres serão servidos
> através de uma CDN (como a da Vercel ou Cloudflare) para otimizar a
> entrega global.
>
> **5.3.** **Escalabilidade**
>
> o **Backend** **Stateless:** A API será construída de forma
> *stateless* (sem guardar estado de sessão em memória), permitindo a
> escalabilidade horizontal (adicionar mais instâncias do servidor) sem
> problemas.
>
> o **WebSocket** **Escalável:** O sistema de WebSocket utilizará o
> padrão **Redis** **Pub/Sub** para distribuir as mensagens de
> notificação entre múltiplas instâncias do backend, garantindo que
> todos os usuários conectados recebam as atualizações.
>
> **5.4.** **Monitoramento** **e** **Logs**
>
> o **Logs** **Estruturados:** O backend gerará logs em formato
> **JSON**, com níveis claros (INFO, WARN, ERROR), para facilitar a
> análise e a depuração.
>
> o **Monitoramento** **de** **Erros:** O projeto será integrado com o
> **Sentry** para capturar e reportar exceções críticas tanto no
> frontend quanto no backend.
>
> o **Monitoramento** **de** **Uptime:** Um serviço externo como o
> **UptimeRobot** será usado para monitorar a disponibilidade da
> aplicação 24/7.
>
> **5.5.** **Acessibilidade**
>
> o **Padrões** **WCAG:** A interface seguirá os padrões WCAG AA,
> garantindo um bom contraste de cores.
>
> o **Navegação** **por** **Teclado:** Todos os elementos interativos,
> especialmente os modais, serão totalmente navegáveis e operáveis via
> teclado (ex: Tab para navegar, ESC para fechar).
>
> o **ARIA** **Labels:** Serão utilizadas ARIA labels em ícones e botões
> para fornecer contexto a leitores de tela.
>
> **5.6.** **Internacionalização** **(i18n)**
>
> o **Versão** **1.0:** O projeto será lançado exclusivamente em
> Português do Brasil (PT-BR).
>
> **Versão** **Futura** **(v2.0):** A estrutura do código será preparada
> para facilitar a adição de outros idiomas (EN, ES) no futuro,
> utilizando as capacidades de i18n do Next.js.
>
> **5.7.** **Estratégia** **de** **Monetização** **(Planejamento**
> **Futuro)**
>
> • **Abordagem** **"Planejar** **Agora,** **Implementar** **Depois":**
> A versão 1.0 do Orbe Nerd será lançada sem anúncios publicitários para
> focar na experiência do usuário e no crescimento da base de usuários.
> No entanto, a arquitetura do frontend será desenvolvida prevendo a
> integração futura de um sistema de monetização (ex: Google AdSense,
> banners de afiliados).
>
> • **Espaços** **Designados** **para** **Anúncios:** Durante o
> desenvolvimento dos componentes de layout, espaços estratégicos serão
> designados para a eventual inclusão de anúncios, de forma que sua
> futura implementação não exija uma refatoração visual significativa.
> Possíveis locais incluem:
>
> o Um banner horizontal discreto entre os carrosséis da Página Inicial.
>
> o Um espaço para um anúncio vertical (skyscraper) na barra lateral das
> Páginas de Catálogo.
>
> o Um banner posicionado dentro do "Super Modal" de Detalhes.
>
> 6\. Estratégia de Desenvolvimento e Operações (DevOps)
>
> **6.1.** **Ambiente** **de** **Deploy**
>
> o **Frontend:** **Vercel**, aproveitando a integração nativa com
> Next.js e o deploy contínuo.
>
> o **Backend:** **Render** ou **Railway**, pela facilidade de
> integração com FastAPI e PostgreSQL.
>
> o **Banco** **de** **Dados:** Um serviço de **PostgreSQL**
> **gerenciado** (oferecido pelo Render, Railway, ou Supabase).
>
> **6.2.** **Versionamento** **e** **CI/CD**
>
> o **Versionamento:** O projeto seguirá o **GitHub** **Flow**:
>
> ▪ main: Branch de produção, sempre estável.
>
> ▪ dev: Branch de desenvolvimento e homologação.
>
> ▪ feature/\*: Branches para cada nova funcionalidade.
>
> o **CI/CD:** Será configurado um pipeline no **GitHub** **Actions**. A
> cada push para a branch dev, os testes automatizados serão executados.
> A cada merge para a main, o deploy para produção será acionado
> automaticamente.
>
> **6.3.** **QA** **/** **Testes**
>
> o **Testes** **Unitários:** pytest no backend e Jest + React Testing
> Library no frontend.
>
> o **Testes** **de** **Integração:** pytest + httpx para testar os
> endpoints da API do backend.
>
> o **Testes** **End-to-End** **(E2E):** **Playwright** para simular as
> principais jornadas do usuário no frontend.
>
> o **Checklist** **de** **QA:** Cada nova funcionalidade terá um
> checklist de critérios de aceite para validação manual.
