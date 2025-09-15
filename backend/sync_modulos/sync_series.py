import time
import json
import logging
from datetime import datetime

from .db_operations import get_db_connection
from .clients import tmdb_client

logger = logging.getLogger("data_sync.sync_series")

def sync_series():
    """Sincroniza dados de séries da TMDB API com o banco de dados e retorna a contagem."""
    logger.info("Iniciando sincronização de séries...")
    novas_series = 0
    series_atualizadas = 0
    try:
        series_data = tmdb_client.get_popular_tv_shows()
        if not series_data or 'results' not in series_data:
            logger.error("Dados de séries não encontrados ou formato inválido")
            return 0, 0
        conn = get_db_connection()
        if not conn:
            return 0, 0
        cursor = conn.cursor()
        for serie in series_data['results']:
            cursor.execute('SELECT id FROM "Serie" WHERE tmdb_id = %s', (serie['id'],))
            existing = cursor.fetchone()
            serie_data = {
                'tmdb_id': serie['id'],
                'titulo': serie['name'],
                'descricao': serie['overview'],
                'poster_url': f"https://image.tmdb.org/t/p/w500{serie['poster_path']}" if serie['poster_path'] else None,
                'backdrop_url': f"https://image.tmdb.org/t/p/original{serie['backdrop_path']}" if serie['backdrop_path'] else None,
                'data_lancamento': serie.get('first_air_date'),
                'popularidade': serie['popularity'],
                'nota_media': serie['vote_average'],
                'generos': json.dumps([g for g in serie.get('genre_ids', [])]),
                'atualizado_em': datetime.now().isoformat()
            }
            if existing:
                update_query = (
                    'UPDATE "Serie" SET '
                    'titulo = %(titulo)s, '
                    'descricao = %(descricao)s, '
                    'poster_url = %(poster_url)s, '
                    'backdrop_url = %(backdrop_url)s, '
                    'data_lancamento = %(data_lancamento)s, '
                    'popularidade = %(popularidade)s, '
                    'nota_media = %(nota_media)s, '
                    'generos = %(generos)s, '
                    'atualizado_em = %(atualizado_em)s '
                    'WHERE tmdb_id = %(tmdb_id)s'
                )
                cursor.execute(update_query, serie_data)
                series_atualizadas += 1
            else:
                insert_query = (
                    'INSERT INTO "Serie" ( '
                    'tmdb_id, titulo, descricao, poster_url, backdrop_url, '
                    'data_lancamento, popularidade, nota_media, generos, atualizado_em '
                    ') VALUES ( '
                    '%(tmdb_id)s, %(titulo)s, %(descricao)s, %(poster_url)s, %(backdrop_url)s, '
                    '%(data_lancamento)s, %(popularidade)s, %(nota_media)s, %(generos)s, %(atualizado_em)s '
                    ')'
                )
                cursor.execute(insert_query, serie_data)
                novas_series += 1
        conn.commit()
        logger.info(f"Sincronização de séries concluída: {novas_series} novas, {series_atualizadas} atualizadas.")
    except Exception as e:
        logger.error(f"Erro durante a sincronização de séries: {e}")
        return 0, 0
    finally:
        if 'conn' in locals() and conn:
            cursor.close()
            conn.close()
    return novas_series, series_atualizadas
