import { Filme, Serie, Anime, Jogo, Notification, User } from '@/types';

// Dados mockados para filmes
export const mockFilmes: Filme[] = [
  {
    id: 1,
    titulo_curado: "Duna: Parte Dois",
    titulo_api: "Dune: Part Two",
    poster_url_api: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    data_lancamento_api: "2024-03-01",
    sinopse_api: "Paul Atreides une-se a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família.",
    plataformas_api: [{ nome: "Max" }, { nome: "Prime Video" }],
    generos_api: [
      { id: 1, name: "Ficção Científica" },
      { id: 2, name: "Aventura" }
    ],
    duracao: 166,
    diretor: "Denis Villeneuve",
    escritor: "Jon Spaihts, Denis Villeneuve, Eric Roth",
    elenco: [
      { id: 1, nome: "Timothée Chalamet", personagem: "Paul Atreides", foto_url: "https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upDEBJa.jpg" },
      { id: 2, nome: "Zendaya", personagem: "Chani", foto_url: "https://image.tmdb.org/t/p/w185/kg8vZNlGJQyOqWKuyOqYEWuCQYo.jpg" }
    ],
    em_prevenda: false,
    premiacoes: [
      { id: 1, nome: "Oscar", categoria: "Melhor Cinematografia", ano: 2024, status: "vencedor" }
    ]
  },
  {
    id: 2,
    titulo_curado: "Oppenheimer",
    titulo_api: "Oppenheimer",
    poster_url_api: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    data_lancamento_api: "2023-07-21",
    sinopse_api: "A história de J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.",
    plataformas_api: [{ nome: "Prime Video" }, { nome: "Apple TV" }],
    generos_api: [
      { id: 3, name: "Drama" },
      { id: 4, name: "História" }
    ],
    duracao: 180,
    diretor: "Christopher Nolan",
    escritor: "Christopher Nolan",
    elenco: [
      { id: 3, nome: "Cillian Murphy", personagem: "J. Robert Oppenheimer", foto_url: "https://image.tmdb.org/t/p/w185/dm6V24NjjvjMiCtbMkc8Y2WPm2e.jpg" },
      { id: 4, nome: "Emily Blunt", personagem: "Katherine Oppenheimer", foto_url: "https://image.tmdb.org/t/p/w185/nPJXaRMvu1vh3COG16GzmdsBySQ.jpg" }
    ],
    em_prevenda: false,
    premiacoes: [
      { id: 2, nome: "Oscar", categoria: "Melhor Filme", ano: 2024, status: "vencedor" },
      { id: 3, nome: "Oscar", categoria: "Melhor Ator", ano: 2024, status: "vencedor" }
    ]
  }
];

// Dados mockados para séries
export const mockSeries: Serie[] = [
  {
    id: 1,
    titulo_curado: "House of the Dragon",
    titulo_api: "House of the Dragon",
    poster_url_api: "https://image.tmdb.org/t/p/w500/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg",
    data_lancamento_api: "2022-08-21",
    sinopse_api: "A guerra civil Targaryen conhecida como a Dança dos Dragões.",
    plataformas_api: [{ nome: "Max" }],
    generos_api: [
      { id: 5, name: "Drama" },
      { id: 6, name: "Fantasia" }
    ],
    numero_temporadas: 2,
    numero_episodios: 18,
    criadores: ["Ryan J. Condal", "George R. R. Martin"],
    elenco: [
      { id: 5, nome: "Paddy Considine", personagem: "Viserys I Targaryen", foto_url: "https://image.tmdb.org/t/p/w185/4MCKNAc6AbgftWEn1tRgRdi2ZaD.jpg" },
      { id: 6, nome: "Emma D'Arcy", personagem: "Rhaenyra Targaryen", foto_url: "https://image.tmdb.org/t/p/w185/xDEhXyGOGWpeaKZgBmPZRJzbnBc.jpg" }
    ]
  },
  {
    id: 2,
    titulo_curado: "The Last of Us",
    titulo_api: "The Last of Us",
    poster_url_api: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    data_lancamento_api: "2023-01-15",
    sinopse_api: "Joel e Ellie navegam por um mundo pós-apocalíptico devastado por uma infecção fúngica.",
    plataformas_api: [{ nome: "Max" }],
    generos_api: [
      { id: 7, name: "Drama" },
      { id: 8, name: "Terror" }
    ],
    numero_temporadas: 1,
    numero_episodios: 9,
    criadores: ["Craig Mazin", "Neil Druckmann"],
    elenco: [
      { id: 7, nome: "Pedro Pascal", personagem: "Joel Miller", foto_url: "https://image.tmdb.org/t/p/w185/9VYK7oxcqhjd5LAH6ZFJ3XzOlID.jpg" },
      { id: 8, nome: "Bella Ramsey", personagem: "Ellie Williams", foto_url: "https://image.tmdb.org/t/p/w185/4q2hz2m8hsWeBHPiO5KWr1Kgzgm.jpg" }
    ]
  }
];

// Dados mockados para animes
export const mockAnimes: Anime[] = [
  {
    id: 1,
    titulo_curado: "Demon Slayer: Kimetsu no Yaiba",
    titulo_api: "Kimetsu no Yaiba",
    poster_url_api: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-PEn1CTc93blC.jpg",
    data_lancamento_api: "2019-04-06",
    sinopse_api: "Tanjiro Kamado se torna um caçador de demônios para salvar sua irmã transformada em demônio.",
    plataformas_api: [{ nome: "Crunchyroll" }, { nome: "Funimation" }],
    generos_api: [
      { id: 9, name: "Ação" },
      { id: 10, name: "Sobrenatural" }
    ],
    fonte: "Mangá",
    estudio: "Ufotable",
    dublagem_info: true,
    staff: [
      { id: 1, nome: "Haruo Sotozaki", cargo: "Diretor" },
      { id: 2, nome: "Yuki Kajiura", cargo: "Compositor" }
    ],
    personagens: [
      {
        id: 1,
        nome: "Tanjiro Kamado",
        foto_url: "https://s4.anilist.co/file/anilistcdn/character/large/b146156-RhiBIhpN5sNB.jpg",
        dubladores: {
          jp: { nome: "Natsuki Hanae" },
          ptBR: { nome: "Guilherme Briggs" }
        }
      },
      {
        id: 2,
        nome: "Nezuko Kamado",
        foto_url: "https://s4.anilist.co/file/anilistcdn/character/large/b146157-qwbWOVoNM1Tv.jpg",
        dubladores: {
          jp: { nome: "Satomi Sato" },
          ptBR: { nome: "Fernanda Baronne" }
        }
      }
    ],
    proximo_episodio: "2024-09-10T15:00:00Z",
    numero_episodio_atual: 12,
    eventos_recorrentes_calendario: true,
    numero_temporadas: 4,
    numero_episodios: 55,
    criadores: ["Koyoharu Gotouge"],
    elenco: [
      { id: 101, nome: "Natsuki Hanae", personagem: "Tanjiro Kamado", foto_url: "https://example.com/tanjiro.jpg" },
      { id: 102, nome: "Akari Kito", personagem: "Nezuko Kamado", foto_url: "https://example.com/nezuko.jpg" }
    ]
  },
  {
    id: 2,
    titulo_curado: "Attack on Titan",
    titulo_api: "Shingeki no Kyojin",
    poster_url_api: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-73IhOXpJZiMF.jpg",
    data_lancamento_api: "2013-04-07",
    sinopse_api: "A humanidade luta pela sobrevivência contra titãs gigantes.",
    plataformas_api: [{ nome: "Crunchyroll" }, { nome: "Funimation" }],
    generos_api: [
      { id: 9, name: "Ação" },
      { id: 11, name: "Drama" }
    ],
    fonte: "Mangá",
    estudio: "Mappa",
    dublagem_info: true,
    staff: [
      { id: 3, nome: "Tetsuro Araki", cargo: "Diretor" },
      { id: 4, nome: "Hiroyuki Sawano", cargo: "Compositor" }
    ],
    personagens: [
      {
        id: 3,
        nome: "Eren Yeager",
        foto_url: "https://s4.anilist.co/file/anilistcdn/character/large/b40882-dsj7IP943WFF.jpg",
        dubladores: {
          jp: { nome: "Yuki Kaji" },
          ptBR: { nome: "Manolo Rey" }
        }
      }
    ],
    eventos_recorrentes_calendario: false,
    numero_temporadas: 4,
    numero_episodios: 88,
    criadores: ["Hajime Isayama"],
    elenco: [
      { id: 103, nome: "Yuki Kaji", personagem: "Eren Yeager", foto_url: "https://example.com/eren.jpg" },
      { id: 104, nome: "Yui Ishikawa", personagem: "Mikasa Ackerman", foto_url: "https://example.com/mikasa.jpg" }
    ]
  }
];

// Dados mockados para jogos
export const mockJogos: Jogo[] = [
  {
    id: 1,
    titulo_curado: "The Legend of Zelda: Tears of the Kingdom",
    titulo_api: "The Legend of Zelda: Tears of the Kingdom",
    poster_url_api: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.webp",
    data_lancamento_api: "2023-05-12",
    sinopse_api: "Link deve encontrar a Princesa Zelda e descobrir o segredo por trás da catástrofe que assola Hyrule.",
    plataformas_api: [{ nome: "Nintendo Switch" }],
    generos_api: [
      { id: 12, name: "Aventura" },
      { id: 13, name: "RPG" }
    ],
    desenvolvedores: ["Nintendo EPD"],
    publicadoras: ["Nintendo"],
    plataformas_jogo: [
      {
        id: 1,
        nome: "Nintendo Switch",
        logo_url: "https://logos-world.net/wp-content/uploads/2021/03/Nintendo-Switch-Logo.png",
        store_url: "https://www.nintendo.com/us/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/"
      }
    ]
  },
  {
    id: 2,
    titulo_curado: "Baldur's Gate 3",
    titulo_api: "Baldur's Gate 3",
    poster_url_api: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.webp",
    data_lancamento_api: "2023-08-03",
    sinopse_api: "Um RPG épico baseado em Dungeons & Dragons onde suas escolhas moldam a história.",
    plataformas_api: [{ nome: "PC" }, { nome: "PlayStation 5" }, { nome: "Xbox Series X/S" }],
    generos_api: [
      { id: 13, name: "RPG" },
      { id: 14, name: "Estratégia" }
    ],
    desenvolvedores: ["Larian Studios"],
    publicadoras: ["Larian Studios"],
    plataformas_jogo: [
      {
        id: 2,
        nome: "Steam",
        logo_url: "https://store.steampowered.com/favicon.ico",
        store_url: "https://store.steampowered.com/app/1086940/Baldurs_Gate_3/"
      },
      {
        id: 3,
        nome: "PlayStation Store",
        logo_url: "https://www.playstation.com/favicon.ico",
        store_url: "https://store.playstation.com/en-us/product/UP3526-PPSA06683_00-BALDURSGATE30000"
      }
    ],
    premiacoes: [
      { id: 4, nome: "The Game Awards", categoria: "Game of the Year", ano: 2023, status: "vencedor" }
    ]
  }
];

// Dados mockados para notificações
export const mockNotifications: Notification[] = [
  {
    id: 1,
    titulo: "Novo episódio de Demon Slayer disponível!",
    tipo_notificacao: "NOVO_ITEM",
    foi_visualizada: false,
    data_criacao: "2024-09-03T10:00:00Z",
    midia_id: 1,
    tipo_midia: "anime"
  },
  {
    id: 2,
    titulo: "Data de lançamento de Duna 3 atualizada",
    tipo_notificacao: "ATUALIZACAO_DATA",
    foi_visualizada: false,
    data_criacao: "2024-09-02T15:30:00Z",
    midia_id: 1,
    tipo_midia: "filme"
  },
  {
    id: 3,
    titulo: "Dublagem em português adicionada para Attack on Titan",
    tipo_notificacao: "DUBLAGEM",
    foi_visualizada: true,
    data_criacao: "2024-09-01T09:15:00Z",
    midia_id: 2,
    tipo_midia: "anime"
  },
  {
    id: 4,
    titulo: "Vencedores do Oscar 2024 anunciados!",
    tipo_notificacao: "VENCEDOR_PREMIO",
    foi_visualizada: true,
    data_criacao: "2024-03-11T02:00:00Z"
  }
];

// Dados mockados para usuário
export const mockUser: User = {
  id: 1,
  email: "usuario@exemplo.com",
  role: "user",
  quer_avaliar: true,
  data_criacao: "2024-01-15T10:00:00Z"
};

// Dados mockados para buscas populares
export const mockPopularSearches = [
  "Duna",
  "Attack on Titan",
  "The Last of Us",
  "Baldur's Gate 3",
  "House of the Dragon",
  "Demon Slayer",
  "Oppenheimer",
  "Zelda"
];

// Função para simular delay de API
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Funções para simular chamadas de API
export const mockApi = {
  // Buscar filmes
  getFilmes: async (): Promise<Filme[]> => {
    await delay(500);
    return mockFilmes;
  },

  // Buscar séries
  getSeries: async (): Promise<Serie[]> => {
    await delay(500);
    return mockSeries;
  },

  // Buscar animes
  getAnimes: async (): Promise<Anime[]> => {
    await delay(500);
    return mockAnimes;
  },

  // Buscar jogos
  getJogos: async (): Promise<Jogo[]> => {
    await delay(500);
    return mockJogos;
  },

  // Buscar notificações
  getNotifications: async (): Promise<Notification[]> => {
    await delay(300);
    return mockNotifications;
  },

  // Busca global
  search: async (query: string) => {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    
    const filmes = mockFilmes.filter(f => 
      f.titulo_curado.toLowerCase().includes(lowerQuery) ||
      f.titulo_api.toLowerCase().includes(lowerQuery)
    );
    
    const series = mockSeries.filter(s => 
      s.titulo_curado.toLowerCase().includes(lowerQuery) ||
      s.titulo_api.toLowerCase().includes(lowerQuery)
    );
    
    const animes = mockAnimes.filter(a => 
      a.titulo_curado.toLowerCase().includes(lowerQuery) ||
      a.titulo_api.toLowerCase().includes(lowerQuery)
    );
    
    const jogos = mockJogos.filter(j => 
      j.titulo_curado.toLowerCase().includes(lowerQuery) ||
      j.titulo_api.toLowerCase().includes(lowerQuery)
    );

    return {
      filmes,
      series,
      animes,
      jogos,
      total: filmes.length + series.length + animes.length + jogos.length
    };
  },

  // Marcar notificação como lida
  markNotificationAsRead: async (id: number): Promise<void> => {
    await delay(200);
    const notification = mockNotifications.find(n => n.id === id);
    if (notification) {
      notification.foi_visualizada = true;
    }
  }
};

