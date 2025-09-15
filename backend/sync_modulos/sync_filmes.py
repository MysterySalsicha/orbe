import time
import json
import logging
from datetime import datetime

from .db_operations import get_db_connection
from .clients import tmdb_client

logger = logging.getLogger("data_sync.sync_filmes")

def sync_filmes():
    """Sincroniza dados de filmes da TMDB API com o banco de dados e retorna a contagem."""
    logger.info("Iniciando sincronização de filmes...")
    novos_filmes = 0
    filmes_atualizados = 0
    try:
        filmes_data = tmdb_client.get_popular_movies()
        if not filmes_data or 'results' not in filmes_data:
            logger.error("Dados de filmes não encontrados ou formato inválido")
            return 0, 0
        conn = get_db_connection()
        if not conn:
            return 0, 0
        cursor = conn.cursor()
        for filme in filmes_data['results']:
            cursor.execute('SELECT id FROM "Filme" WHERE tmdb_id = %s', (filme['id'],))
            existing = cursor.fetchone()
            filme_data = {
                'tmdb_id': filme['id'],
                'titulo': filme['title'],
                'descricao': filme['overview'],
                'poster_url': f"https://image.tmdb.org/t/p/w500{filme['poster_path']}" if filme['poster_path'] else None,
                'backdrop_url': f"https://image.tmdb.org/t/p/original{filme['backdrop_path']}" if filme['backdrop_path'] else None,
                'data_lancamento': filme['release_date'],
                'popularidade': filme['popularity'],
                'nota_media': filme['vote_average'],
                'generos': json.dumps([g for g in filme.get('genre_ids', [])]),
                'atualizado_em': datetime.now().isoformat()
            }
            if existing:
                update_query = (
                    'UPDATE "Filme" SET '
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
                cursor.execute(update_query, filme_data)
                filmes_atualizados += 1
            else:
                insert_query = (
                    'INSERT INTO "Filme" ( '
                    'tmdb_id, titulo, descricao, poster_url, backdrop_url, '
                    'data_lancamento, popularidade, nota_media, generos, atualizado_em '
                    ') VALUES ( '
                    '%(tmdb_id)s, %(titulo)s, %(descricao)s, %(poster_url)s, %(backdrop_url)s, '
                    '%(data_lancamento)s, %(popularidade)s, %(nota_media)s, %(generos)s, %(atualizado_em)s '
                    ')'
                )
                cursor.execute(insert_query, filme_data)
                novos_filmes += 1
        conn.commit()
        logger.info(f"Sincronização de filmes concluída: {novos_filmes} novos, {filmes_atualizados} atualizados.")
    except Exception as e:
        logger.error(f"Erro durante a sincronização de filmes: {e}")
        return 0, 0
    finally:
        if 'conn' in locals() and conn:
            cursor.close()
            conn.close()
    return novos_filmes, filmes_atualizados