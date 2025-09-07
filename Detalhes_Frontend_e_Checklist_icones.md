so para revisar como quero o frontend:



Paleta de Cores: a. Tema escuro moderno (preto/azul com acentos coloridos) b. Tema claro elegante (branco/dourado) quero que o site siga o tema de onde ele esta sendo rodado por exemplo se for em um celular que o tema escuro estiver habilitado quero que o tema escuro (opção a) fique, se for o contrario e o celular estiver no tema claro quero que o tema claro (opção b) se sobre saia deve ter um botão que permita alterar também sem ligar para o tema do dispositivo, mas por padrão ele vem igual com o tema do dispositivo



1. A Estrutura Principal: Componentes Globais

Toda a experiência do utilizador no Orbe Nerd é sustentada por dois componentes que aparecem em todo o site, garantindo consistência e funcionalidade.



O Header (Barra de Navegação):

A navegação principal é uma barra superior que permanece fixa no topo da página (sticky).





À Esquerda: O logo "Orbe Nerd" com o seu estilo de gradiente serve como link para a página inicial. Ao seu lado, os links de navegação principais: 



"Filmes", "Animes", "Séries", "Jogos", e os links para as páginas de descoberta, "Premiações" e "O que tem pra hoje". O link da página atual é visualmente destacado para orientar o utilizador.







À Direita: Ficam as ferramentas de interação: uma Barra de Pesquisa Global, um ícone de sino para notificações e as ações de utilizador. Para visitantes, são exibidos os botões 



"Entrar" e "Inscreva-se". Para utilizadores logados, estes são substituídos por um 



ícone de perfil que abre um menu para "Meu Perfil" e "Sair".





Responsividade: Em ecrãs menores, todos os links e ações agrupam-se num único ícone de "hambúrguer", exeto o sino e o botão de entrar.



O MidiaCard (O Componente Central):

Este é o "átomo" visual do nosso site, representando cada item nos carrosséis e grelhas.





Visual: É composto pelo pôster da mídia, que tem um subtil efeito de zoom ao passar o rato por cima. Abaixo do pôster, informações essenciais são apresentadas com rótulos a negrito: 



"Nome:", "Lançamento:" e "Plataformas:".





Ícones Inteligentes (Sobrepostos): Ícones contextuais podem aparecer sobre o pôster: um ícone dourado para "Vencedor" e prateado para "Indicado" a um prémio ; um ícone de 



pré-venda para filmes de cinema ; e um ícone 



"Novo" para episódios recém-lançados de séries que o utilizador acompanha.





Contador para Animes: Para animes em exibição, o campo "Lançamento" transforma-se em "Episódio [Nº]:" seguido por um contador em tempo real para o próximo episódio (ex: 1d, 12h e 30m).







Ações Rápidas: Uma droplist (ativada por 3 pontinhos) dá acesso a um menu de ações: ❤️ Favoritar, 🔖 Quero Assistir, ⭐ Acompanhando, ✔️ Já Assisti/Joguei e 👁️ Não me Interessa .



2. As Telas Principais

A Página Inicial (/):

A vitrine do Orbe Nerd, focada nos lançamentos do ano corrente.





Layout e Carrosséis: A página exibe uma série de carrosséis arrastáveis horizontalmente com fluidez tanto pelos dedos arrastando um midiacard quanto pelo clique e o arrastar do mouse, a ordem: Filmes, Animes, Séries e Jogos.





Títulos Inteligentes: Cada carrossel tem um título descritivo e dinâmico:





Filmes/Séries: O título funciona como uma timeline, como "Filmes que estreiam em Setembro", e atualiza para o mês seguinte conforme o utilizador navega. Botões de atalho (



《 e 》) permitem pular entre os meses .





Animes: O título é sazonal: "Animes da Temporada de [Estação Atual]".





Jogos: O título cobre o ano: "Estreias de jogos de [Ano Atual]".





Funcionalidade "Reset": Clicar no título de qualquer carrossel faz com que a visualização volte instantaneamente para o item mais relevante (o próximo lançamento a partir de hoje).



A Experiência de Pesquisa (Overlay Interativo):

Uma funcionalidade central e imersiva, inspirada nas interfaces de pesquisas da Netflix de Smart TVs soque sem o teclado de baixo da barra de pesquisa apenas alguns filtros como filmes, animes, series, jogos e títulos mais pesquisados, e a direita os midiacards, posso utilizar a pesquisa por nome da mídia, original ou em inglês ou em português, nome de atores, nome de dubladores ou por tags.





Fluxo: Ao clicar na lupa do Header, em vez de mudar de página, um overlay de ecrã inteiro surge suavemente sobre o conteúdo atual.





Layout: A interface apresenta um campo de busca no topo e um teclado virtual interativo (A-Z, 0-9) abaixo.





Busca em Tempo Real: A cada letra digitada, a grelha de resultados na parte inferior é atualizada instantaneamente com MidiaCards, sem a necessidade de submeter a busca . Os resultados são agrupados por categoria ("Filmes", "Séries", etc.)caso não tenha sido filtrado nenhuma categoria especifica. Antes da digitação, são exibidas "Buscas Populares da Semana". Ao selecionar um card, o overlay fecha e o "Super Modal" de detalhes abre.









As Páginas de Catálogo (/filmes, /series, etc.):

Para exploração completa do acervo.





Layout: Cada página de categoria (ex: /filmes) exibe uma grelha responsiva de MidiaCards.





Filtros Avançados: No topo da grelha, haverá um conjunto completo de controlos (menus, checkboxes) para que o utilizador possa filtrar a lista por género, plataforma, tags e outros critérios relevantes, incluindo filtros rápidos como "Lançamentos deste mês" entre outros tipos de filtros relevantes.



O "Super Modal" de Detalhes:

A experiência mais rica e detalhada do site, que se abre sobre qualquer tela ao clicar num 



MidiaCard.



Estrutura Geral: Ocupa o ecrã inteiro, com fundo escurecido e scroll vertical. Pode ser fechado com o botão "X", a tecla ESC ou o botão "voltar" do telemóvel . Para administradores, um ícone de "lápis" ativa o modo de edição.





Conteúdo Customizado: O layout e as informações mudam completamente para cada tipo de mídia, exibindo dados específicos e carrosséis para:





Filmes: Duração, Direção, Roteiro e um carrossel de Elenco.







Séries: Nº de Temporadas, Nº de Episódios e Criadores.





Jogos: Desenvolvedores e Publicadoras.





Animes (O "Super Modal"): A versão mais completa, com detalhes como Fonte, Estúdio, Status de Dublagem, um carrossel para a Equipa de Produção (Staff) e o famoso Carrossel de Personagens com seletor de dubladores JP/PT-BR .





Botões de Ação Inteligentes: Os botões são contextuais e só aparecem se tiverem uma ação válida.





"Comprar Ingresso" aparece para filmes em cartaz com link do ingresso.com.





"Assistir" aparece para mídias em streaming com link direto para a plataforma.





Para 



Jogos, em vez de um botão, são exibidos ícones clicáveis de cada loja digital (Steam, PlayStation Store, etc.) .





Adicionar ao Calendário: Um botão que abre um segundo modal com opções inteligentes, como criar eventos recorrentes para todos os episódios de um anime ou um evento detalhado para uma sessão de cinema .



3. As Telas de Descoberta e Utilizador

Página "O que tem pra hoje" (/hoje):

Uma página com abas (Filmes, Animes, Séries, Jogos) que mostra o que está a "bombar" nos streamings e o que está "em cartaz no cinema" .



Página de Premiações (/premios):

Uma central para explorar conteúdo premiado, onde o utilizador pode filtrar por evento (Oscar, The Game Awards) e navegar pelas edições anuais, com os vencedores claramente destacados .



Página de Anúncios de Jogos (/jogos/anuncios):

Ativada durante grandes eventos, agrupa os jogos anunciados por evento e apresenta um card especial com o trailer de revelação embutido .



Páginas de Conta e Perfil (/login, /register, /perfil):

O ecossistema do utilizador.





Página de Perfil: Dividida em abas para gerir as listas pessoais: "Minha Lista" (quero assistir), "Favoritos" e "Assistidos/Jogados" .





Recomendações: Dentro do perfil, um botão "Me Recomende" inicia um fluxo que, com base nas avaliações positivas do utilizador, sugere um novo item de cada vez para ele descobrir .



Modal de Notificações:

Ativado pelo ícone de sino no Header (que exibe uma bolinha vermelha), um modal surge com a lista de todas as novidades relevantes para o utilizador, como "Atualização de Data", "Dublagem Adicionada", "Vencedores do [Prémio]", etc. .


🎨 Funcionalidades Implementadas



✅ Header Responsivo



• Logo com gradiente "Orbe Nerd" quando tiver no tema claro vai ser um gradiente dourado, quando tiver no escuro vai ser um gradiente no azul



• Navegação completa (Filmes, Animes, Séries, Jogos, Premiações, "Hoje" [Vou mudar o nome da função oque tem pra hoje por somente hoje])



• Botão que troca o tema (Claro/Escuro) por padrão o tema do site é o mesmo do sistema 



• Botão de pesquisa



• Botão que abre o modal de notificações



• foto do usuário em um circulo (quando logado)



• Menu mobile responsivo



✅ Sistema de Pesquisa



• Overlay fullscreen com blur de fundo



• Campo de busca com placeholder personalizado



• Sem Teclado virtual funcional



• Filtros por categoria (Todos, Filmes, Séries, Animes, Jogos)



• Buscas populares da semana, quando começar a pesquisar ele vai trocar para as sugestões doque o usuário pode estar querendo pesquisar



• Resultados organizados por tipo de mídia



• Busca em tempo real (debounced)



✅ Carrosséis de Mídia



• Títulos dinâmicos baseados no mês/temporada seguindo a cor dos temas



• Navegação temporal (《 》) para filmes e séries e sazonal para animes



• Scroll horizontal suave



• Suporte a drag/swipe



• Indicadores visuais de scroll



• Responsivo para mobile e desktop



✅ Cards de Mídia



• Imagens otimizadas com Next.js Image



• Informações detalhadas (título, data, plataformas)



• Menu de ações (Favoritar, Quero Assistir, etc.)



• Indicadores visuais (prêmios ou indicado [usar o icone da premiação que a midia for indicada ou vitoriosa], pré-venda, novos episódios)



• Countdown para próximos episódios de animes



• Estados de interação do usuário



• Hover effects e animações



✅ Sistema de Temas



• Tema claro (Branco/Dourado)



• Tema escuro (Preto/Azul com acentos coloridos)



• Tema automático (segue o sistema)



• Transições suaves entre temas



• Persistência da preferência



✅ Gerenciamento de Estado



• Store global com Zustand



• Persistência de dados importantes



• Estados de loading e modais



• Gerenciamento de notificações



no pesquisa global veio um teclado virtual sendo que eu solicitei que a barra de pesquisa ficasse a esquerda e nao centralizada, de baixo da barra de pesquisa ficaria os botoes para escolher oque quer pesquisar e debaixo dos botoes ficaria filtros rapidos como o filtro buscas populares da semana, na direita ficaria os midiacards, e o filtro seria dinamico apareceria conforme voce fosse pesquisando e recomendaria titulos parecidos com oque voce pesquisa, e ja teria algumas midiascards assim que voce abrise como os titulos em alta os dados de em alta puxaria das apis,

Lista de Ícones para o Projeto Orbe Nerd
1. Ícones de Plataformas de Mídia (Streaming)
Estes serão usados nos MidiaCards e no "Super Modal". Recomendo buscar versões em SVG, se possível, para a melhor qualidade.

[ ] Netflix

[ ] Disney+

[ ] Max (antigo HBO Max)

[ ] Prime Video

[ ] Apple TV+

[ ] Crunchyroll

[ ] Star+

2. Ícones de Plataformas de Jogos
[ ] PlayStation (o logo moderno)

[ ] Xbox (o logo moderno)

[ ] Nintendo Switch

[ ] PC / Windows

[ ] Steam

3. Ícones de Premiações
Para cada prêmio, você precisará de duas versões: uma dourada (para vencedores) e uma prateada (para indicados).

[ ] Ícone do Oscar (Estatueta) - Versão Dourada

[ ] Ícone do Oscar (Estatueta) - Versão Prateada

[ ] Ícone do Globo de Ouro - Versão Dourada

[ ] Ícone do Globo de Ouro - Versão Prateada

[ ] Ícone do The Anime Awards - Versão Dourada

[ ] Ícone do The Anime Awards - Versão Prateada

[ ] Ícone do The Game Awards - Versão Dourada

[ ] Ícone do The Game Awards - Versão Prateada

4. Ícones de Interface (UI)
Estes são os ícones que usaremos para as ações e navegação no site.

[ ] Sino (Notificações): Para o Header.

[ ] Lupa (Pesquisa): Para a barra de pesquisa no Header.

[ ] Perfil de Usuário: Ícone genérico de pessoa/avatar para o Header.

[ ] Menu Hambúrguer: O ícone de três linhas para a navegação mobile.

[ ] "X" (Fechar): Para fechar os modais.

[ ] Lápis (Editar): Para o botão de edição do admin no "Super Modal".

[ ] Coração (Favoritar): Para a droplist de ações.

[ ] Marcador/Fita (Quero Assistir): Para a droplist de ações.

[ ] Estrela (Acompanhando): Para a droplist de ações de séries/animes.

[ ] Check (✔️ - Já Assisti): Para a droplist de ações.

[ ] Olho Cruzado (👁️ - Não me Interessa): Para a droplist de ações.

[ ] Setas de Navegação (《 e 》): Para os botões da Timeline Interativa dos carrosséis .

[ ] Calendário: Para o botão "Adicionar ao Calendário" no modal .



[ ] Ícone de Pré-venda: Para ser exibido no MidiaCard de filmes.

[ ] Ícone "Novo": Para indicar novos episódios de mídias que o usuário está "Acompanhando" .

[ ] Placeholder de Imagem: Um ícone ou imagem genérica para ser usada quando um pôster de filme/jogo/etc. não puder ser carregado.

Com esta lista em mãos, você tem um checklist completo para reunir todos os assets visuais que o Orbe Nerd precisará.

