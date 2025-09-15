#!/bin/bash

# Script para iniciar o serviço de sincronização de dados no ambiente de produção

echo "Iniciando serviço de sincronização de dados..."

# Verificar se as variáveis de ambiente necessárias estão configuradas
required_vars=("SUPABASE_DB_HOST" "SUPABASE_DB_PORT" "SUPABASE_DB_NAME" "SUPABASE_DB_USER" "SUPABASE_DB_PASSWORD" "TMDB_API_KEY" "IGDB_CLIENT_ID" "IGDB_CLIENT_SECRET")

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Erro: Variável de ambiente $var não está configurada."
    exit 1
  fi
done

# Iniciar o processo de sincronização em background
python data_sync.py &

# Armazenar o PID do processo
echo $! > sync_service.pid

echo "Serviço de sincronização iniciado com PID $(cat sync_service.pid)"