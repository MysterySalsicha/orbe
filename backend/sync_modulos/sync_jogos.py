import time
import json
import logging
from datetime import datetime

from .db_operations import get_db_connection
from .clients import igdb_client

logger = logging.getLogger("data_sync.sync_jogos")

def sync_jogos():
    """Sincroniza dados de jogos da IGDB API com o banco de dados e retorna a contagem."""
    logger.info("Iniciando sincronização de jogos...")
    novos_jogos = 0
    jogos_atualizados = 0
    try:
        jogos_data = igdb_client.get_popular_games()
        if not jogos_data:
            logger.error("Dados de jogos não encontrados ou formato inválido")
            return 0, 0
        conn = get_db_connection()
        if not conn:
            return 0, 0
        cursor = conn.cursor()
        for jogo in jogos_data:
            cursor.execute('SELECT id FROM "Jogo" WHERE igdb_id = %s', (jogo['id'],))
            existing = cursor.fetchone()
            release_date = None
            if jogo.get('first_release_date'):
                release_date = datetime.fromtimestamp(jogo['first_release_date']).strftime('%Y-%m-%d')
            jogo_data = {
                'igdb_id': jogo['id'],
                'titulo': jogo['name'],
                'descricao': jogo.get('summary', ''),
                'poster_url': f"https://images.igdb.com/igdb/image/upload/t_cover_big/{jogo.get('cover', {}).get('image_id')}.jpg" if jogo.get('cover', {}).get('image_id') else None,
                'data_lancamento': release_date,
                'popularidade': jogo.get('rating', 0),
                'nota_media': jogo.get('aggregated_rating', 0) / 10 if jogo.get('aggregated_rating') else 0,
                'generos': json.dumps([g['name'] for g in jogo.get('genres', [])]),
                'plataformas': json.dumps([p['name'] for p in jogo.get('platforms', [])]),
                'desenvolvedora': jogo.get('involved_companies', [{}])[0].get('company', {}).get('name') if jogo.get('involved_companies') else None,
                'atualizado_em': datetime.now().isoformat()
            }
            if existing:
                update_query = (
                    'UPDATE "Jogo" SET '
                    'titulo = %(titulo)s, '
                    'descricao = %(descricao)s, '
                    'poster_url = %(poster_url)s, '
                    'data_lancamento = %(data_lancamento)s, '
                    'popularidade = %(popularidade)s, '
                    'nota_media = %(nota_media)s, '
                    'generos = %(generos)s, '
                    'plataformas = %(plataformas)s, '
                    'desenvolvedora = %(desenvolvedora)s, '
                    'atualizado_em = %(atualizado_em)s '
                    'WHERE igdb_id = %(igdb_id)s'
                )
                cursor.execute(update_query, jogo_data)
                jogos_atualizados += 1
            else:
                insert_query = (
                    'INSERT INTO "Jogo" ( '
                    'igdb_id, titulo, descricao, poster_url, data_lancamento, '
                    'popularidade, nota_media, generos, plataformas, desenvolvedora, atualizado_em '
                    ') VALUES ( '
                    '%(igdb_id)s, %(titulo)s, %(descricao)s, %(poster_url)s, %(data_lancamento)s, '
                    '%(popularidade)s, %(nota_media)s, %(generos)s, %(plataformas)s, %(desenvolvedora)s, %(atualizado_em)s '
                    ')'
                )
                cursor.execute(insert_query, jogo_data)
                novos_jogos += 1
        conn.commit()
        logger.info(f"Sincronização de jogos concluída: {novos_jogos} novos, {jogos_atualizados} atualizados.")
    except Exception as e:
        logger.error(f"Erro durante a sincronização de jogos: {e}")
        return 0, 0
    finally:
        if 'conn' in locals() and conn:
            cursor.close()
            conn.close()
    return novos_jogos, jogos_atualizados