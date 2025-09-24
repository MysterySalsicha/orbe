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
  // Helper para construir a URL da imagem
  getImageUrl: (path: string | null) => {
    if (!path) return '/placeholder.svg';
    return `https://image.tmdb.org/t/p/w500${path}`;
  },

  // Filmes
  getFilmes: async (params: { filtro?: string; genero?: string; page?: number }): Promise<{ results: Filme[]; total_pages: number; total_results: number }> => {
    try {
      const response = await orbeNerdApi.getFilmes(params);
      
      const mappedResults = response.results.map((filme: any) => ({
        id: filme.id,
        titulo_api: filme.titulo_api,
        titulo_curado: filme.titulo_curado,
        poster_url_api: filme.poster_url_api,
        poster_curado: filme.poster_curado,
        data_lancamento_api: filme.data_lancamento_api,
        data_lancamento_curada: filme.data_lancamento_curada,
        sinopse_api: filme.sinopse_api,
        ...filme 
      }));

      return {
        results: mappedResults,
        total_pages: Math.ceil(response.total / 20),
        total_results: response.total
      };
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      return { results: [], total_pages: 0, total_results: 0 };
    }
  },

  // Series
  getSeries: async (params: { genero?: string; page?: number }): Promise<{ results: Serie[]; total_pages: number; total_results: number }> => {
    try {
      const response = await orbeNerdApi.getSeries(params);
      
      const mappedResults = response.results.map((serie: any) => ({
        id: serie.id,
        titulo_api: serie.titulo_api,
        titulo_curado: serie.titulo_curado,
        poster_url_api: serie.poster_url_api,
        poster_curado: serie.poster_curado,
        data_lancamento_api: serie.data_lancamento_api,
        data_lancamento_curada: serie.data_lancamento_curada,
        sinopse_api: serie.sinopse_api,
        ...serie
      }));

      return {
        results: mappedResults,
        total_pages: Math.ceil(response.total / 20),
        total_results: response.total
      };
    } catch (error) {
      console.error('Erro ao buscar séries:', error);
      return { results: [], total_pages: 0, total_results: 0 };
    }
  },

  // Animes
  getAnimes: async (params: { genero?: string; page?: number }): Promise<{ results: Anime[]; total_pages: number; total_results: number }> => {
    try {
      const response = await orbeNerdApi.getAnimes(params);
      
      const mappedResults = response.results.map((anime: any) => ({
        id: anime.id,
        titulo_api: anime.titulo_api,
        titulo_curado: anime.titulo_curado,
        poster_url_api: anime.poster_url_api,
        poster_curado: anime.poster_curado,
        data_lancamento_api: anime.data_lancamento_api,
        data_lancamento_curada: anime.data_lancamento_curada,
        sinopse_api: anime.sinopse_api,
        ...anime
      }));

      return {
        results: mappedResults,
        total_pages: Math.ceil(response.total / 20),
        total_results: response.total
      };
    } catch (error) {
      console.error('Erro ao buscar animes:', error);
      return { results: [], total_pages: 0, total_results: 0 };
    }
  },

  // Jogos
  getJogos: async (params: { genero?: string; page?: number }): Promise<{ results: Jogo[]; total_pages: number; total_results: number }> => {
    try {
      const response = await orbeNerdApi.getJogos(params);
      
      const mappedResults = response.results.map((jogo: any) => ({
          id: jogo.id,
          titulo_api: jogo.titulo_api,
          titulo_curado: jogo.titulo_curado,
          poster_url_api: jogo.poster_url_api,
          poster_curado: jogo.poster_curado,
          data_lancamento_api: jogo.data_lancamento_api,
          data_lancamento_curada: jogo.data_lancamento_curada,
          sinopse_api: jogo.sinopse_api,
          ...jogo
      }));

      return {
        results: mappedResults,
        total_pages: Math.ceil(response.total / 20),
        total_results: response.total
      };
    } catch (error) {
      console.error('Erro ao buscar jogos:', error);
      return { results: [], total_pages: 0, total_results: 0 };
    }
  },

  // Manter os outros métodos como estão, pois não foram reportados erros neles
  getFilmeDetails: orbeNerdApi.getFilmeDetails,
  getSerieDetails: orbeNerdApi.getSerieDetails,
  getAnimeDetails: orbeNerdApi.getAnimeDetails,
  getJogoDetails: orbeNerdApi.getJogoDetails,
  search: async (query: string, type?: string, page: number = 1) => {
    try {
      const response = await orbeNerdApi.search(query, type, page);
      
      if (!response || !Array.isArray(response.results)) {
        return { filmes: [], series: [], animes: [], jogos: [], total: 0 };
      }

      // A lógica de mapeamento aqui pode ser complexa, vamos simplificar por agora
      // garantindo que o formato de retorno esteja correto.
      const mappedResults = response.results.map((item: any) => item);

      return {
        filmes: mappedResults.filter((item: any) => item.tipo === 'filme'),
        series: mappedResults.filter((item: any) => item.tipo === 'serie'),
        animes: mappedResults.filter((item: any) => item.tipo === 'anime'),
        jogos: mappedResults.filter((item: any) => item.tipo === 'jogo'),
        total: response.total_results || mappedResults.length
      };
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      return { filmes: [], series: [], animes: [], jogos: [], total: 0 };
    }
  },
  getTrending: async (type?: string, limit: number = 10) => {
    try {
      const response = await orbeNerdApi.getTrending(type, limit);
      if (!response || !response.results) {
        return [];
      }
      // Mapear resultados para o formato esperado (mesmo que seja um mapeamento 1:1 por enquanto)
      return response.results.map((item: ApiResponseItem) => {
        return item;
      });
    } catch (error) {
      console.error('Erro ao buscar conteúdo em alta:', error);
      return [];
    }
  },
  getNotifications: orbeNerdApi.getNotifications,
  markNotificationAsRead: orbeNerdApi.markNotificationAsRead,
  login: orbeNerdApi.login
};

export default realApi;