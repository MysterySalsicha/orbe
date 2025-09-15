# Estratégia de Sincronização de Dados das APIs

Este documento descreve a estratégia de sincronização de dados implementada para o projeto Orbe Nerd, detalhando como os dados são obtidos de APIs externas e sincronizados com o banco de dados Supabase.

## Visão Geral

A sincronização de dados é um processo automatizado que coleta informações atualizadas das seguintes APIs:

- **TMDB (The Movie Database)**: Para filmes e séries
- **IGDB (Internet Game Database)**: Para jogos
- **Jikan (MyAnimeList)**: Para animes

Os dados coletados são armazenados no banco de dados PostgreSQL hospedado no Supabase, mantendo o catálogo da aplicação sempre atualizado.

## Componentes Principais

### 1. Clientes de API (`api_clients.py`)

Implementa classes para interagir com cada API externa:

- `TMDBClient`: Gerencia requisições para a API do TMDB
- `IGDBClient`: Gerencia requisições para a API do IGDB, incluindo autenticação via Twitch
- `JikanClient`: Gerencia requisições para a API do Jikan

### 2. Script de Sincronização (`data_sync.py`)

Implementa a lógica de sincronização, incluindo:

- Funções específicas para cada tipo de mídia (filmes, séries, animes, jogos)
- Lógica para inserir novos itens ou atualizar existentes
- Agendamento de sincronizações periódicas
- Sistema de logging para monitoramento

## Estratégia de Sincronização

### Frequência de Sincronização

- **Sincronização completa**: Diariamente às 03:00
- **Sincronizações individuais**:
  - Filmes: Diariamente às 09:00
  - Séries: Diariamente às 15:00
  - Animes: Diariamente às 21:00
  - Jogos: Diariamente às 00:00

Esta distribuição evita sobrecarga nas APIs e no banco de dados.

### Processo de Sincronização

1. **Coleta de dados**: Obtenção dos itens mais populares/recentes de cada API
2. **Verificação de existência**: Checagem se o item já existe no banco de dados
3. **Atualização/Inserção**: Atualização de itens existentes ou inserção de novos
4. **Logging**: Registro detalhado de todas as operações

### Tratamento de Erros

- Tentativas de reconexão em caso de falhas de rede
- Respeito aos limites de taxa (rate limits) das APIs
- Registro detalhado de erros para diagnóstico
- Continuação da sincronização mesmo após falhas em itens individuais

## Configuração

### Variáveis de Ambiente Necessárias

```
# Credenciais do Supabase
SUPABASE_DB_HOST=seu-host.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=sua-senha

# Chaves de API
TMDB_API_KEY=sua-chave-tmdb
IGDB_CLIENT_ID=seu-client-id-twitch
IGDB_CLIENT_SECRET=seu-client-secret-twitch
```

## Execução

Para iniciar o processo de sincronização:

```bash
python data_sync.py
```

Para execução em produção, recomenda-se configurar como um serviço do sistema ou utilizar um processo gerenciado pelo Render.

## Monitoramento

O script gera logs detalhados em `data_sync.log`, que incluem:

- Início e conclusão de cada processo de sincronização
- Detalhes sobre itens inseridos ou atualizados
- Erros e exceções encontrados

## Limitações e Considerações

- **Rate Limiting**: As APIs têm limites de requisições que devem ser respeitados
- **Disponibilidade**: Dependência da disponibilidade das APIs externas
- **Armazenamento**: Considerar o crescimento do banco de dados ao longo do tempo
- **Custo**: Monitorar o uso do plano gratuito do Supabase

## Extensões Futuras

- Implementação de sincronização sob demanda via API REST
- Adição de mais fontes de dados
- Refinamento da estratégia de cache
- Implementação de sistema de filas para processamento assíncrono