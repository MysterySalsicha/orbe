# Guia de Implantação do Backend no Render

## Pré-requisitos

1. Conta no [Render](https://render.com/)
2. Repositório Git com o código do backend

## Passos para Implantação

### 1. Criar um novo Web Service no Render

1. Faça login na sua conta do Render
2. Clique em "New" e selecione "Web Service"
3. Conecte seu repositório Git
4. Configure o serviço:
   - Nome: `orbe-nerd-api`
   - Ambiente: `Python`
   - Região: Escolha a mais próxima do Brasil (geralmente `Ohio (US East)`)
   - Branch: `main` (ou a branch que contém o código de produção)
   - Comando de Build: `pip install -r requirements.txt`
   - Comando de Start: `gunicorn app:app`
   - Plano: Free (gratuito)

### 2. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente no Render:

- `DATABASE_URL`: URL de conexão do Supabase (já configurado no .env)
- `DIRECT_URL`: URL direta de conexão do Supabase (já configurado no .env)
- `TMDB_API_KEY`: Chave da API do TMDB
- `TMDB_READ_ACCESS_TOKEN`: Token de acesso do TMDB
- `ANILIST_CLIENT_ID`: ID do cliente do Anilist
- `ANILIST_CLIENT_SECRET`: Segredo do cliente do Anilist
- `TWITCH_CLIENT_ID`: ID do cliente do Twitch
- `TWITCH_CLIENT_SECRET`: Segredo do cliente do Twitch
- `FLASK_APP_ENV`: `production`

### 3. Configurar CORS para o Frontend na Vercel

No arquivo `app.py`, atualize a configuração CORS para incluir o domínio da Vercel:

```python
CORS(app, origins=["http://localhost:3000", "https://orbe-nerd.vercel.app"])
```

### 4. Limitações do Plano Gratuito do Render

- O serviço gratuito do Render entra em modo de hibernação após 15 minutos de inatividade
- Quando uma nova solicitação chega, o serviço acorda, mas isso pode levar alguns segundos
- Há um limite de 750 horas de uso por mês

### 5. Monitoramento

- O Render fornece logs em tempo real que podem ser acessados no painel de controle
- Configure alertas para ser notificado sobre problemas com o serviço

## Sincronização de Dados das APIs

Para evitar bloqueios das APIs, configure o script `data_sync.py` para sincronizar dados em lotes:

1. Modifique o script para buscar apenas dados de setembro de 2025 em diante
2. Configure um job no Render para executar o script periodicamente (uma vez por dia ou semana)
3. Implemente limites de taxa para evitar exceder as cotas das APIs