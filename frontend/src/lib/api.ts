const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Função para obter o token do localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Função para salvar o token no localStorage
export const saveToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Função para remover o token do localStorage
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Cliente HTTP centralizado
export const apiClient = {
  get: async (endpoint: string, params?: Record<string, string | number | boolean | undefined | null>) => {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key].toString());
        }
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  post: async (endpoint: string, data: Record<string, unknown>) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  put: async (endpoint: string, data: Record<string, unknown>) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  delete: async (endpoint: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

// API específica para o Orbe Nerd
export const orbeNerdApi = {
  // Filmes
  getFilmes: async (params?: { page?: number; filtro?: string; genero?: string; ano?: string; status?: string }) => {
    return apiClient.get('/filmes', params);
  },

  getFilmeDetails: async (id: number) => {
    return apiClient.get(`/filmes/${id}`);
  },

  getFilmeFilters: async () => {
    return apiClient.get('/filmes/filtros');
  },

  // Séries
  getSeries: async (params?: { page?: number; genero?: string; ano?: string; status?: string }) => {
    return apiClient.get('/series', params);
  },

  getSerieDetails: async (id: number) => {
    return apiClient.get(`/series/${id}`);
  },

  getSerieFilters: async () => {
    return apiClient.get('/series/filtros');
  },

  // Animes
  getAnimes: async (params?: { page?: number; genero?: string; ano?: string; formato?: string; fonte?: string; status?: string }) => {
    return apiClient.get('/animes', params);
  },

  getAnimeDetails: async (id: number) => {
    return apiClient.get(`/animes/${id}`);
  },

  getAnimeFilters: async () => {
    return apiClient.get('/animes/filtros');
  },

  getAnimeNextEpisode: async (id: number) => {
    return apiClient.get(`/animes/${id}/next-episode`);
  },

  // Jogos
  getJogos: async (params?: { page?: number; genero?: string; plataforma?: string; modo?: string; ano?: string }) => {
    return apiClient.get('/jogos', params);
  },

  getJogoDetails: async (id: number) => {
    return apiClient.get(`/jogos/${id}`);
  },

  getJogoFilters: async () => {
    return apiClient.get('/jogos/filtros');
  },

  // Updates (Admin)
  updateFilme: async (id: number, data: Filme) => {
    return apiClient.put(`/filmes/${id}`, data);
  },
  updateSerie: async (id: number, data: Serie) => {
    return apiClient.put(`/series/${id}`, data);
  },
  updateAnime: async (id: number, data: Anime) => {
    return apiClient.put(`/animes/${id}`, data);
  },
  updateJogo: async (id: number, data: Jogo) => {
    return apiClient.put(`/jogos/${id}`, data);
  },

  // Premiações
  getAwards: async (params?: { awardName?: string; year?: number }) => {
    return apiClient.get('/premios', params);
  },

  // Pesquisa
  search: async (query: string, category?: string, page?: number) => {
    return apiClient.get('/pesquisa', { q: query, category, page });
  },

  // Conteúdo em alta
  getTrending: async (type?: string, limit?: number) => {
    return apiClient.get('/trending', { type, limit });
  },

  // Autenticação
  register: async (userData: { nome: string; email: string; password: string }) => {
    return apiClient.post('/auth/register', userData);
  },

  login: async (credentials: { email: string; password: string }) => {
    return apiClient.post('/auth/login', credentials);
  },

  getCurrentUser: async () => {
    return apiClient.get('/auth/me');
  },

  // Interações do Usuário
  getInteractions: async () => {
    return apiClient.get('/me/interactions');
  },

  upsertInteraction: async (data: { midia_id: number; tipo_midia: string; status: string }) => {
    return apiClient.post('/me/interactions', data);
  },

  // Notificações
  getNotifications: async () => {
    return apiClient.get('/notifications');
  },
};

export default orbeNerdApi;

