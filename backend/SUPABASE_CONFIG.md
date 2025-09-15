# Configuração do Supabase para o Orbe Nerd

## Visão Geral

Este documento descreve como configurar e utilizar o Supabase como banco de dados para o projeto Orbe Nerd.

## Pré-requisitos

1. Conta no [Supabase](https://supabase.com/)
2. Projeto criado no Supabase

## Configuração Inicial

### 1. Obter Credenciais de Conexão

1. Acesse o painel do Supabase e selecione seu projeto
2. Vá para "Settings" > "Database"
3. Role até a seção "Connection Pooling"
4. Copie a string de conexão "Connection string" e substitua `[YOUR-PASSWORD]` pela senha do seu banco

### 2. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis ao arquivo `.env` do backend:

```
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

- `DATABASE_URL`: URL para connection pooling (usar em produção)
- `DIRECT_URL`: URL direta para o banco (usar para migrações e sincronização)

## Inicialização do Banco de Dados

Execute o script de inicialização para criar as tabelas necessárias:

```bash
python init_supabase_db.py
```

## Sincronização de Dados

Para sincronizar dados das APIs externas com o Supabase:

1. Configure o script `data_sync.py` para usar a conexão do Supabase
2. Execute o script para popular o banco com dados iniciais

```bash
python data_sync.py --start-date 2025-09-01
```

## Limitações do Plano Gratuito do Supabase

- 500 MB de armazenamento de banco de dados
- 2 GB de transferência de dados por mês
- 50.000 linhas de banco de dados
- 50 MB de armazenamento de arquivos

## Monitoramento

- Acesse o painel do Supabase para monitorar o uso do banco de dados
- Configure alertas para ser notificado quando estiver próximo dos limites

## Backup e Restauração

- O Supabase realiza backups automáticos diários no plano gratuito
- Para restaurar um backup, entre em contato com o suporte do Supabase