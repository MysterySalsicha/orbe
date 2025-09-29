import orbeNerdApi from '@/lib/api';
import type { Filme, Serie, Anime, Jogo, SearchResultItem } from '@/types';

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



// API real substituindo os dados mockados
export const realApi = {
  // Helper para construir a URL da imagem
  getImageUrl: (path: string | null) => {
    if (!path) return '/placeholder.svg';
    return `https://image.tmdb.org/t/p/w500${path}`;
  },

  // Filmes
  getFilmes: async (params: { filtro?: string; genero?: string; page?: number; ano?: string; status?: string }): Promise<{ results: Filme[]; total_pages: number; total_results: number }> => {
    try {
      const response = await orbeNerdApi.getFilmes(params);
      
      const mappedResults = response.results.map((filme: Filme) => ({
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

  getFilmeFilters: orbeNerdApi.getFilmeFilters,

  // Series
  getSeries: async (params: { filtro?: string; genero?: string; page?: number; ano?: string; status?: string }): Promise<{ results: Serie[]; total_pages: number; total_results: number }> => {
    try {
      const response = await orbeNerdApi.getSeries(params);
      
      const mappedResults = response.results.map((serie: Serie) => ({
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

  getSerieFilters: orbeNerdApi.getSerieFilters,

  // Animes
  getAnimes: async (params: { filtro?: string; genero?: string; page?: number; ano?: string; formato?: string; fonte?: string; status?: string }): Promise<{ results: Anime[]; total_pages: number; total_results: number }> => {
    try {
      const response = await orbeNerdApi.getAnimes(params);
      
      const mappedResults = response.results.map((anime: Anime) => ({
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

  getAnimeFilters: orbeNerdApi.getAnimeFilters,

  // Jogos
  getJogos: async (params: { filtro?: string; genero?: string; page?: number; plataforma?: string; modo?: string; ano?: string }): Promise<{ results: Jogo[]; total_pages: number; total_results: number }> => {
    try {
      const response = await orbeNerdApi.getJogos(params);
      
      const mappedResults = response.results.map((jogo: Jogo) => ({
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

  getJogoFilters: orbeNerdApi.getJogoFilters,

  // Manter os outros métodos como estão, pois não foram reportados erros neles
  getFilmeDetails: orbeNerdApi.getFilmeDetails,
  getSerieDetails: orbeNerdApi.getSerieDetails,
  getAnimeDetails: orbeNerdApi.getAnimeDetails,
  getAnimeNextEpisode: orbeNerdApi.getAnimeNextEpisode,
  getJogoDetails: orbeNerdApi.getJogoDetails,
  updateFilme: orbeNerdApi.updateFilme,
  updateSerie: orbeNerdApi.updateSerie,
  updateAnime: orbeNerdApi.updateAnime,
  updateJogo: orbeNerdApi.updateJogo,
  search: async (query: string, category?: string, page: number = 1) => {
    try {
      const response = await orbeNerdApi.search(query, category, page);
      
      if (!response || !Array.isArray(response.results)) {
        return { filmes: [], series: [], animes: [], jogos: [], total: 0 };
      }

      // A lógica de mapeamento aqui pode ser complexa, vamos simplificar por agora
      // garantindo que o formato de retorno esteja correto.
      const mappedResults = response.results.map((item: SearchResultItem) => item);

      return {
        filmes: mappedResults.filter((item: SearchResultItem) => item.type === 'filme'),
        series: mappedResults.filter((item: SearchResultItem) => item.type === 'serie'),
        animes: mappedResults.filter((item: SearchResultItem) => item.type === 'anime'),
        jogos: mappedResults.filter((item: SearchResultItem) => item.type === 'jogo'),
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
  login: orbeNerdApi.login,
  getInteractions: orbeNerdApi.getInteractions,
  upsertInteraction: orbeNerdApi.upsertInteraction,
  getAwards: orbeNerdApi.getAwards,
};

export default realApi;