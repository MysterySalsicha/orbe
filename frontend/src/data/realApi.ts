import orbeNerdApi from '@/lib/api';
import type { Filme, Serie, Anime, Jogo, Notification } from '@/types';

type ApiResponseItem = {
  id: number;
  titulo: string;
  poster: string;
  data_lancamento: string;
  sinopse: string;
  plataformas: string[];
  generos: string[];
  duracao?: string;
  direcao?: string;
  roteiro?: string;
  em_prevenda?: boolean;
  numero_temporadas?: number;
  numero_episodios?: number;
  criadores?: string[];
  fonte?: string;
  estudio?: string;
  status_dublagem?: string;
  proximo_episodio?: string;
  desenvolvedores?: string[];
  publicadoras?: string[];
  tipo?: string;
};

type ApiNotification = {
  id: number;
  titulo: string;
  tipo: string;
  lida: boolean;
  data_criacao: string;
  midia_id: number;
  tipo_midia: string;
};

// API real substituindo os dados mockados
export const realApi = {
  // Filmes
  getFilmes: async (filtro?: string, genero?: string, page: number = 1): Promise<{ results: Filme[]; total_pages: number; total_results: number }> => {
    try {
      const response = await orbeNerdApi.getFilmes({ page, filtro, genero });
      
      // Mapear dados do backend para o formato esperado pelo frontend
      const mappedResults = response.results.map((filme: ApiResponseItem) => ({
        id: filme.id,
        titulo_curado: filme.titulo,
        titulo_api: filme.titulo,
        poster_url_api: filme.poster,
        data_lancamento_api: filme.data_lancamento,
        sinopse_api: filme.sinopse,
        plataformas_api: filme.plataformas || [],
        generos_api: filme.generos?.map((g: string, index: number) => ({ id: index + 1, name: g })) || [],
        duracao: filme.duracao ? parseInt(filme.duracao.replace(' min', '')) : 0,
        diretor: filme.direcao,
        escritor: filme.roteiro,
        elenco: [],
        em_prevenda: filme.em_prevenda || false,
        premiacoes: []
      }));

      return {
        results: mappedResults,
        total_pages: response.total_pages || 1,
        total_results: response.total_results || mappedResults.length
      };
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      return { results: [], total_pages: 0, total_results: 0 };
    }
  },

  getFilmeDetails: async (id: number): Promise<Filme | null> => {
    try {
      const filme = await orbeNerdApi.getFilmeDetails(id);
      if (!filme) return null;

      return {
        id: filme.id,
        titulo_curado: filme.titulo,
        titulo_api: filme.titulo,
        poster_url_api: filme.poster,
        data_lancamento_api: filme.data_lancamento,
        sinopse_api: filme.sinopse,
        plataformas_api: filme.plataformas || [],
        generos_api: filme.generos?.map((g: string, index: number) => ({ id: index + 1, name: g })) || [],
        duracao: filme.duracao ? parseInt(filme.duracao.replace(' min', '')) : 0,
        diretor: filme.direcao,
        escritor: filme.roteiro,
        elenco: [],
        em_prevenda: filme.em_prevenda || false,
        premiacoes: []
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
      return null;
    }
  },

  // Séries
  getSeries: async (genero?: string, page: number = 1): Promise<{ results: Serie[]; total_pages: number; total_results: number }> => {
    try {
      const response = await orbeNerdApi.getSeries({ page, genero });
      
      const mappedResults = response.results.map((serie: ApiResponseItem) => ({
        id: serie.id,
        titulo_curado: serie.titulo,
        titulo_api: serie.titulo,
        poster_url_api: serie.poster,
        data_lancamento_api: serie.data_lancamento,
        sinopse_api: serie.sinopse,
        plataformas_api: serie.plataformas || [],
        generos_api: serie.generos?.map((g: string, index: number) => ({ id: index + 1, name: g })) || [],
        numero_temporadas: serie.numero_temporadas || 0,
        numero_episodios: serie.numero_episodios || 0,
        criadores: serie.criadores || [],
        elenco: []
      }));

      return {
        results: mappedResults,
        total_pages: response.total_pages || 1,
        total_results: response.total_results || mappedResults.length
      };
    } catch (error) {
      console.error('Erro ao buscar séries:', error);
      return { results: [], total_pages: 0, total_results: 0 };
    }
  },

  getSerieDetails: async (id: number): Promise<Serie | null> => {
    try {
      const serie = await orbeNerdApi.getSerieDetails(id);
      if (!serie) return null;

      return {
        id: serie.id,
        titulo_curado: serie.titulo,
        titulo_api: serie.titulo,
        poster_url_api: serie.poster,
        data_lancamento_api: serie.data_lancamento,
        sinopse_api: serie.sinopse,
        plataformas_api: serie.plataformas || [],
        generos_api: serie.generos?.map((g: string, index: number) => ({ id: index + 1, name: g })) || [],
        numero_temporadas: serie.numero_temporadas || 0,
        numero_episodios: serie.numero_episodios || 0,
        criadores: serie.criadores || [],
        elenco: []
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes da série:', error);
      return null;
    }
  },

  // Animes
  getAnimes: async (genero?: string, page: number = 1): Promise<{ results: Anime[]; total_pages: number; total_results: number }> => {
    try {
      const response = await orbeNerdApi.getAnimes({ page, genero });
      
      const mappedResults = response.results.map((anime: ApiResponseItem) => ({
        id: anime.id,
        titulo_curado: anime.titulo,
        titulo_api: anime.titulo,
        poster_url_api: anime.poster,
        data_lancamento_api: anime.data_lancamento,
        sinopse_api: anime.sinopse,
        plataformas_api: anime.plataformas || [],
        generos_api: anime.generos?.map((g: string, index: number) => ({ id: index + 1, name: g })) || [],
        fonte: anime.fonte || 'Manga',
        estudio: anime.estudio || '',
        dublagem_info: anime.status_dublagem === 'Dublado/Legendado',
        staff: [],
        personagens: [],
        proximo_episodio: anime.proximo_episodio,
        numero_episodio_atual: anime.numero_episodios || 0,
        eventos_recorrentes_calendario: false
      }));

      return {
        results: mappedResults,
        total_pages: response.total_pages || 1,
        total_results: response.total_results || mappedResults.length
      };
    } catch (error) {
      console.error('Erro ao buscar animes:', error);
      return { results: [], total_pages: 0, total_results: 0 };
    }
  },

  getAnimeDetails: async (id: number): Promise<Anime | null> => {
    try {
      const anime = await orbeNerdApi.getAnimeDetails(id);
      if (!anime) return null;

      return {
        id: anime.id,
        titulo_curado: anime.titulo,
        titulo_api: anime.titulo,
        poster_url_api: anime.poster,
        data_lancamento_api: anime.data_lancamento,
        sinopse_api: anime.sinopse,
        plataformas_api: anime.plataformas || [],
        generos_api: anime.generos?.map((g: string, index: number) => ({ id: index + 1, name: g })) || [],
        fonte: anime.fonte || 'Manga',
        estudio: anime.estudio || '',
        dublagem_info: anime.status_dublagem === 'Dublado/Legendado',
        staff: [],
        personagens: [],
        proximo_episodio: anime.proximo_episodio,
        numero_episodio_atual: anime.numero_episodios || 0,
        eventos_recorrentes_calendario: false
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes do anime:', error);
      return null;
    }
  },

  // Jogos
  getJogos: async (genero?: string, page: number = 1): Promise<{ results: Jogo[]; total_pages: number; total_results: number }> => {
    try {
      const response = await orbeNerdApi.getJogos({ page, genero });
      
      const mappedResults = response.results.map((jogo: ApiResponseItem) => ({
        id: jogo.id,
        titulo_curado: jogo.titulo,
        titulo_api: jogo.titulo,
        poster_url_api: jogo.poster,
        data_lancamento_api: jogo.data_lancamento,
        sinopse_api: jogo.sinopse,
        plataformas_api: jogo.plataformas || [],
        generos_api: jogo.generos?.map((g: string, index: number) => ({ id: index + 1, name: g })) || [],
        desenvolvedores: jogo.desenvolvedores || [],
        publicadoras: jogo.publicadoras || [],
        plataformas_jogo: jogo.plataformas?.map((p: string, index: number) => ({
          id: index + 1,
          nome: p,
          logo_url: '',
          store_url: ''
        })) || [],
        premiacoes: []
      }));

      return {
        results: mappedResults,
        total_pages: response.total_pages || 1,
        total_results: response.total_results || mappedResults.length
      };
    } catch (error) {
      console.error('Erro ao buscar jogos:', error);
      return { results: [], total_pages: 0, total_results: 0 };
    }
  },

  getJogoDetails: async (id: number): Promise<Jogo | null> => {
    try {
      const jogo = await orbeNerdApi.getJogoDetails(id);
      if (!jogo) return null;

      return {
        id: jogo.id,
        titulo_curado: jogo.titulo,
        titulo_api: jogo.titulo,
        poster_url_api: jogo.poster,
        data_lancamento_api: jogo.data_lancamento,
        sinopse_api: jogo.sinopse,
        plataformas_api: jogo.plataformas || [],
        generos_api: jogo.generos?.map((g: string, index: number) => ({ id: index + 1, name: g })) || [],
        desenvolvedores: jogo.desenvolvedores || [],
        publicadoras: jogo.publicadoras || [],
        plataformas_jogo: jogo.plataformas?.map((p: string, index: number) => ({
          id: index + 1,
          nome: p,
          logo_url: '',
          store_url: ''
        })) || [],
        premiacoes: []
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes do jogo:', error);
      return null;
    }
  },

  // Pesquisa
  search: async (query: string, type?: string, page: number = 1): Promise<{ filmes: Filme[]; series: Serie[]; animes: Anime[]; jogos: Jogo[]; total: number; }> => {
    try {
      const response = await orbeNerdApi.search(query, type, page);
      
      // Mapear resultados para o formato esperado
      const mappedResults = response.results.map((item: ApiResponseItem) => {
        const baseItem = {
          id: item.id,
          titulo_curado: item.titulo,
          titulo_api: item.titulo,
          poster_url_api: item.poster,
          data_lancamento_api: item.data_lancamento,
          sinopse_api: item.sinopse,
          plataformas_api: item.plataformas || [],
          generos_api: item.generos?.map((g: string, index: number) => ({ id: index + 1, name: g })) || []
        };

        // Adicionar campos específicos baseado no tipo
        if (item.tipo === 'filme') {
          return {
            ...baseItem,
            duracao: item.duracao ? parseInt(item.duracao.replace(' min', '')) : 0,
            diretor: item.direcao,
            escritor: item.roteiro,
            elenco: [],
            em_prevenda: item.em_prevenda || false,
            premiacoes: []
          };
        } else if (item.tipo === 'serie') {
          return {
            ...baseItem,
            numero_temporadas: item.numero_temporadas || 0,
            numero_episodios: item.numero_episodios || 0,
            criadores: item.criadores || [],
            elenco: []
          };
        } else if (item.tipo === 'anime') {
          return {
            ...baseItem,
            fonte: item.fonte || 'Manga',
            estudio: item.estudio || '',
            dublagem_info: item.status_dublagem === 'Dublado/Legendado',
            staff: [],
            personagens: [],
            proximo_episodio: item.proximo_episodio,
            numero_episodio_atual: item.numero_episodios || 0,
            eventos_recorrentes_calendario: false
          };
        } else if (item.tipo === 'jogo') {
          return {
            ...baseItem,
            desenvolvedores: item.desenvolvedores || [],
            publicadoras: item.publicadoras || [],
            plataformas_jogo: item.plataformas?.map((p: string, index: number) => ({
              id: index + 1,
              nome: p,
              logo_url: '',
              store_url: ''
            })) || [],
            premiacoes: []
          };
        }

        return baseItem;
      });

      return {
        filmes: mappedResults.filter((item: Filme) => item.duracao !== undefined),
        series: mappedResults.filter((item: Serie) => item.numero_temporadas !== undefined),
        animes: mappedResults.filter((item: Anime) => item.fonte !== undefined),
        jogos: mappedResults.filter((item: Jogo) => item.desenvolvedores !== undefined),
        total: response.total_results || mappedResults.length
      };
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      return { filmes: [], series: [], animes: [], jogos: [], total: 0 };
    }
  },

  // Conteúdo em alta
  getTrending: async (type?: string, limit: number = 10) => {
    try {
      const response = await orbeNerdApi.getTrending(type, limit);
      
      // Mapear resultados para o formato esperado
      return response.results.map((item: ApiResponseItem) => {
        const baseItem = {
          id: item.id,
          titulo_curado: item.titulo,
          titulo_api: item.titulo,
          poster_url_api: item.poster,
          data_lancamento_api: item.data_lancamento,
          sinopse_api: item.sinopse,
          plataformas_api: item.plataformas || [],
          generos_api: item.generos?.map((g: string, index: number) => ({ id: index + 1, name: g })) || []
        };

        // Adicionar campos específicos baseado no tipo
        if (item.tipo === 'filme') {
          return {
            ...baseItem,
            duracao: item.duracao ? parseInt(item.duracao.replace(' min', '')) : 0,
            diretor: item.direcao,
            escritor: item.roteiro,
            elenco: [],
            em_prevenda: item.em_prevenda || false,
            premiacoes: []
          };
        } else if (item.tipo === 'serie') {
          return {
            ...baseItem,
            numero_temporadas: item.numero_temporadas || 0,
            numero_episodios: item.numero_episodios || 0,
            criadores: item.criadores || [],
            elenco: []
          };
        } else if (item.tipo === 'anime') {
          return {
            ...baseItem,
            fonte: item.fonte || 'Manga',
            estudio: item.estudio || '',
            dublagem_info: item.status_dublagem === 'Dublado/Legendado',
            staff: [],
            personagens: [],
            proximo_episodio: item.proximo_episodio,
            numero_episodio_atual: item.numero_episodios || 0,
            eventos_recorrentes_calendario: false
          };
        } else if (item.tipo === 'jogo') {
          return {
            ...baseItem,
            desenvolvedores: item.desenvolvedores || [],
            publicadoras: item.publicadoras || [],
            plataformas_jogo: item.plataformas?.map((p: string, index: number) => ({
              id: index + 1,
              nome: p,
              logo_url: '',
              store_url: ''
            })) || [],
            premiacoes: []
          };
        }

        return baseItem;
      });
    } catch (error) {
      console.error('Erro ao buscar conteúdo em alta:', error);
      return [];
    }
  },

  // Notificações
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const notifications = await orbeNerdApi.getNotifications();
      
      return notifications.map((notif: ApiNotification) => ({
        id: notif.id,
        titulo: notif.titulo,
        tipo_notificacao: notif.tipo?.toUpperCase() || 'NOVO_ITEM',
        foi_visualizada: notif.lida || false,
        data_criacao: notif.data_criacao,
        midia_id: notif.midia_id,
        tipo_midia: notif.tipo_midia
      }));
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return [];
    }
  },

  // Marcar notificação como lida
  markNotificationAsRead: async (id: number): Promise<void> => {
    try {
      // Implementar quando o backend tiver essa funcionalidade
      console.log('Marcando notificação como lida:', id);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  },

  // Login
  login: async (email: string, password: string): Promise<{ token: string; user: User } | null> => {
    try {
      const response = await orbeNerdApi.post('/auth/login', { email, password });
      return response;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return null;
    }
  }
};

export default realApi;