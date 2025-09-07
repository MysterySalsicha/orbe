# Guia de Integração com Backend Python

Este documento detalha como integrar o frontend Next.js com seu backend Python.

## 🔗 Pontos de Integração

### 1. Substituir API Mockada

O arquivo `src/data/mockData.ts` contém todas as funções mockadas que devem ser substituídas por chamadas reais ao seu backend:

```typescript
// ANTES (mockado)
export const mockApi = {
  async getFilmes(): Promise<Filme[]> {
    return mockFilmes;
  }
};

// DEPOIS (integrado)
export const api = {
  async getFilmes(): Promise<Filme[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/filmes`);
    if (!response.ok) throw new Error('Erro ao buscar filmes');
    return response.json();
  }
};
```

### 2. Endpoints Esperados pelo Frontend

Baseado na especificação técnica, o frontend espera os seguintes endpoints:

#### Filmes
- `GET /api/filmes` - Lista filmes
- `GET /api/filmes/{id}` - Detalhes do filme
- `GET /api/filmes/mes/{ano}/{mes}` - Filmes por mês

#### Séries
- `GET /api/series` - Lista séries
- `GET /api/series/{id}` - Detalhes da série
- `GET /api/series/mes/{ano}/{mes}` - Séries por mês

#### Animes
- `GET /api/animes` - Lista animes
- `GET /api/animes/{id}` - Detalhes do anime
- `GET /api/animes/temporada/{temporada}` - Animes por temporada

#### Jogos
- `GET /api/jogos` - Lista jogos
- `GET /api/jogos/{id}` - Detalhes do jogo
- `GET /api/jogos/ano/{ano}` - Jogos por ano

#### Pesquisa
- `GET /api/search?q={query}&tipo={tipo}` - Busca geral

#### Usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/user/profile` - Perfil do usuário
- `POST /api/user/interactions` - Interações do usuário

#### Notificações
- `GET /api/notifications` - Lista notificações
- `PUT /api/notifications/{id}/read` - Marcar como lida

### 3. Estrutura de Dados Esperada

#### Filme
```typescript
interface Filme {
  id: number;
  titulo_curado: string;
  titulo_api: string;
  poster_curado: string;
  poster_url_api: string;
  data_lancamento_curada: string;
  data_lancamento_api: string;
  plataformas_curadas: string[];
  plataformas_api: string[];
  em_prevenda?: boolean;
  premiacoes?: Premiacao[];
}
```

#### Anime
```typescript
interface Anime {
  id: number;
  titulo_curado: string;
  titulo_api: string;
  poster_curado: string;
  poster_url_api: string;
  numero_episodio_atual?: number;
  proximo_episodio?: string;
  plataformas_curadas: string[];
  plataformas_api: string[];
  premiacoes?: Premiacao[];
}
```

### 4. Configuração de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# URL base da sua API Python
NEXT_PUBLIC_API_URL=http://localhost:8000

# Chave de API (se necessário)
NEXT_PUBLIC_API_KEY=sua_chave_aqui

# Configurações de autenticação
NEXT_PUBLIC_JWT_SECRET=seu_jwt_secret
```

### 5. Implementação de Autenticação

#### Frontend (já implementado)
O frontend já possui:
- Store para gerenciar estado de autenticação
- Componentes de login/registro (mockados)
- Interceptação de rotas protegidas

#### Backend (você deve implementar)
```python
# Exemplo com FastAPI
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer

app = FastAPI()
security = HTTPBearer()

@app.post("/api/auth/login")
async def login(credentials: LoginCredentials):
    # Sua lógica de autenticação
    if valid_credentials(credentials):
        token = create_jwt_token(user_id)
        return {"token": token, "user": user_data}
    raise HTTPException(401, "Credenciais inválidas")
```

### 6. CORS Configuration

Configure CORS no seu backend Python para permitir requisições do frontend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 7. Tratamento de Erros

O frontend espera respostas de erro no formato:

```json
{
  "error": "Mensagem de erro",
  "code": "ERROR_CODE",
  "details": {}
}
```

### 8. Upload de Imagens

Se você implementar upload de imagens, adicione os domínios no `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ... domínios existentes
      {
        protocol: 'https',
        hostname: 'seu-cdn.com',
        pathname: '/**',
      },
    ],
  },
};
```

### 9. WebSocket (Opcional)

Para notificações em tempo real, você pode implementar WebSocket:

#### Backend
```python
from fastapi import WebSocket

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await websocket.accept()
    # Lógica de notificações em tempo real
```

#### Frontend
```typescript
// Adicione no AppProvider.tsx
useEffect(() => {
  if (isAuthenticated) {
    const ws = new WebSocket(`ws://localhost:8000/ws/${user.id}`);
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      addNotification(notification);
    };
    return () => ws.close();
  }
}, [isAuthenticated]);
```

### 10. Checklist de Integração

- [ ] Configurar variáveis de ambiente
- [ ] Implementar endpoints da API
- [ ] Configurar CORS
- [ ] Substituir funções mockadas
- [ ] Testar autenticação
- [ ] Testar busca
- [ ] Testar carregamento de dados
- [ ] Testar interações do usuário
- [ ] Configurar notificações
- [ ] Testar responsividade
- [ ] Deploy do backend
- [ ] Deploy do frontend

### 11. Exemplo de Integração Completa

```typescript
// src/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async getFilmes(): Promise<Filme[]> {
    return this.request<Filme[]>('/api/filmes');
  }

  async searchContent(query: string, type?: string): Promise<SearchResult> {
    const params = new URLSearchParams({ q: query });
    if (type) params.append('tipo', type);
    
    return this.request<SearchResult>(`/api/search?${params}`);
  }
}

export const api = new ApiClient();
```

### 12. Monitoramento e Logs

Implemente logs no backend para monitorar as requisições do frontend:

```python
import logging

logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(f"{request.method} {request.url} - {response.status_code} - {process_time:.2f}s")
    return response
```

---

**Após a integração, teste todas as funcionalidades para garantir que o frontend e backend estão se comunicando corretamente.**

