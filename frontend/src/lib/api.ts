const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
  getFilmes: async (params?: { page?: number; filtro?: string; genero?: string }) => {
    return apiClient.get('/filmes', params);
  },

  getFilmeDetails: async (id: number) => {
    return apiClient.get(`/filmes/${id}`);
  },

  // Séries
  getSeries: async (params?: { page?: number; genero?: string }) => {
    return apiClient.get('/series', params);
  },

  getSerieDetails: async (id: number) => {
    return apiClient.get(`/series/${id}`);
  },

  // Animes
  getAnimes: async (params?: { page?: number; genero?: string }) => {
    return apiClient.get('/animes', params);
  },

  getAnimeDetails: async (id: number) => {
    return apiClient.get(`/animes/${id}`);
  },

  // Jogos
  getJogos: async (params?: { page?: number; genero?: string }) => {
    return apiClient.get('/jogos', params);
  },

  getJogoDetails: async (id: number) => {
    return apiClient.get(`/jogos/${id}`);
  },

  // Pesquisa
  search: async (query: string, type?: string, page?: number) => {
    return apiClient.get('/search', { q: query, type, page });
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

  // Notificações
  getNotifications: async () => {
    return apiClient.get('/notifications');
  },
};

export default orbeNerdApi;

