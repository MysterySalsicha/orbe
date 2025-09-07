# Guia de Integração com Backend - Orbe Nerd

## Visão Geral

Este documento descreve como integrar o frontend do Orbe Nerd com seu backend Python. O frontend foi desenvolvido com dados mockados e está preparado para integração com APIs reais.

## Estrutura de Dados Esperada

### Endpoints Principais

#### 1. Autenticação
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/me
```

#### 2. Mídia
```
GET /api/filmes
GET /api/series
GET /api/animes
GET /api/jogos
GET /api/midia/{id}
```

#### 3. Pesquisa
```
GET /api/search?q={query}&type={tipo}&page={page}
GET /api/trending
GET /api/popular
```

#### 4. Usuário
```
GET /api/user/profile
PUT /api/user/profile
GET /api/user/interactions
POST /api/user/interactions
GET /api/user/notifications
```

## Configuração da API

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Cliente HTTP

O projeto usa um cliente HTTP centralizado em `src/lib/api.ts`. Atualize as URLs:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },
  
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  // ... outros métodos
};
```

## Substituição dos Dados Mockados

### 1. Arquivo Principal: `src/data/mockData.ts`

Substitua as funções mockadas por chamadas reais à API:

```typescript
// ANTES (mockado)
export const mockApi = {
  getFilmes: async (): Promise<Filme[]> => {
    return mockFilmes;
  },
  // ...
};

// DEPOIS (API real)
export const api = {
  getFilmes: async (): Promise<Filme[]> => {
    return apiClient.get('/filmes');
  },
  // ...
};
```

### 2. Componentes que Precisam de Atualização

#### SearchOverlay (`src/components/modals/SearchOverlay.tsx`)
- Linha ~45: `mockApi.search()` → `api.search()`
- Linha ~50: `mockApi.getTrending()` → `api.getTrending()`

#### SuperModal (`src/components/modals/SuperModal.tsx`)
- Linha ~53: `mockApi.getElenco()` → `api.getElenco()`
- Linha ~57: `mockApi.getStaff()` → `api.getStaff()`

#### Páginas de Catálogo
- `src/app/filmes/page.tsx` - Linha ~35
- `src/app/series/page.tsx` - Linha ~35
- `src/app/animes/page.tsx` - Linha ~35
- `src/app/jogos/page.tsx` - Linha ~35

## Autenticação

### 1. Token Management

O sistema de autenticação usa JWT tokens. Implemente em `src/lib/auth.ts`:

```typescript
export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getToken: () => localStorage.getItem('token'),
  getUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
};
```

### 2. Store de Autenticação

O Zustand store (`src/stores/appStore.ts`) já está configurado para autenticação. Atualize os métodos:

```typescript
login: (user: Usuario) => {
  set({ user, isAuthenticated: true });
  // Salvar no localStorage se necessário
},

logout: () => {
  authService.logout();
  set({ user: null, isAuthenticated: false });
},
```

## Tratamento de Erros

### 1. Interceptador de Respostas

Adicione tratamento de erros global:

```typescript
const handleApiError = (error: any) => {
  if (error.status === 401) {
    // Token expirado - redirecionar para login
    authService.logout();
    window.location.href = '/login';
  } else if (error.status === 500) {
    // Erro do servidor
    console.error('Erro interno do servidor');
  }
  throw error;
};
```

### 2. Estados de Loading

Todos os componentes já implementam estados de loading. Mantenha a consistência:

```typescript
const [isLoading, setIsLoading] = useState(false);

const loadData = async () => {
  setIsLoading(true);
  try {
    const data = await api.getData();
    setData(data);
  } catch (error) {
    handleApiError(error);
  } finally {
    setIsLoading(false);
  }
};
```

## Uploads de Arquivos

Para uploads de imagens (avatares, etc.), implemente:

```typescript
export const uploadService = {
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await fetch(`${API_BASE_URL}/user/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
      body: formData,
    });
    
    return response.json();
  },
};
```

## WebSockets (Notificações em Tempo Real)

Para notificações em tempo real, implemente WebSocket:

```typescript
export const websocketService = {
  connect: (userId: number) => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);
    
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      // Atualizar store de notificações
      useAppStore.getState().addNotification(notification);
    };
    
    return ws;
  },
};
```

## Testes da Integração

### 1. Checklist de Verificação

- [ ] Login/logout funcionando
- [ ] Carregamento de dados de mídia
- [ ] Pesquisa funcionando
- [ ] Super Modal carregando dados adicionais
- [ ] Notificações sendo recebidas
- [ ] Upload de avatar funcionando
- [ ] Tratamento de erros implementado

### 2. Comandos de Teste

```bash
# Testar conexão com API
curl -X GET http://localhost:8000/api/filmes

# Testar autenticação
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## Considerações de Performance

### 1. Cache de Dados

Implemente cache para dados que não mudam frequentemente:

```typescript
const cache = new Map();

export const cachedApi = {
  get: async (endpoint: string, ttl = 300000) => { // 5 min TTL
    const cacheKey = endpoint;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    
    const data = await apiClient.get(endpoint);
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  },
};
```

### 2. Paginação

Implemente paginação para listas grandes:

```typescript
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  const newData = await api.getFilmes({ page: page + 1 });
  if (newData.length === 0) {
    setHasMore(false);
  } else {
    setFilmes(prev => [...prev, ...newData]);
    setPage(prev => prev + 1);
  }
};
```

## Próximos Passos

1. **Configure as variáveis de ambiente**
2. **Substitua os dados mockados pelas chamadas de API**
3. **Teste cada funcionalidade individualmente**
4. **Implemente tratamento de erros robusto**
5. **Adicione cache e otimizações de performance**
6. **Configure WebSockets para notificações em tempo real**

## Suporte

Para dúvidas sobre a integração, consulte:
- Documentação da API do backend
- Logs do console do navegador
- Network tab das ferramentas de desenvolvedor

O frontend está totalmente preparado para integração e seguindo as melhores práticas de desenvolvimento React/Next.js.

