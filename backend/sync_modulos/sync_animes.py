import time
import json
import logging
from datetime import datetime

from .db_operations import get_db_connection
from .clients import jikan_client

logger = logging.getLogger("data_sync.sync_animes")

def sync_animes():
    """Sincroniza dados de animes da Jikan API com o banco de dados e retorna a contagem."""
    logger.info("Iniciando sincronização de animes...")
    novos_animes = 0
    animes_atualizados = 0
    try:
        top_animes_data = jikan_client.get_top_animes()
        if not top_animes_data or 'data' not in top_animes_data:
            logger.error("Dados de animes não encontrados ou formato inválido")
            return 0, 0
        conn = get_db_connection()
        if not conn:
            return 0, 0
        cursor = conn.cursor()
        for anime_summary in top_animes_data['data']:
            mal_id = anime_summary['mal_id']
            time.sleep(1)
            full_anime_data = jikan_client.get_anime_details(mal_id)
            if not full_anime_data or 'data' not in full_anime_data:
                logger.warning(f"Não foi possível obter detalhes para o anime MAL ID: {mal_id}")
                continue
            anime = full_anime_data['data']
            time.sleep(1)
            characters_data = jikan_client.get_anime_characters(mal_id)
            characters = []
            if characters_data and 'data' in characters_data:
                for char_entry in characters_data['data']:
                    character_info = {
                        'id': char_entry['character']['mal_id'],
                        'nome': char_entry['character']['name'],
                        'imagem': char_entry['character']['images'].get('jpg', {}).get('image_url'),
                        'dubladores': {}
                    }
                    for voice_actor in char_entry.get('voice_actors', []):
                        if voice_actor['language'] == 'Japanese':
                            character_info['dubladores']['jp'] = {
                                'nome': voice_actor['person']['name'],
                                'foto_url': voice_actor['person'].get('images', {}).get('jpg', {}).get('image_url')
                            }
                        elif voice_actor['language'] == 'Portuguese (BR)':
                            character_info['dubladores']['pt_br'] = {
                                'nome': voice_actor['person']['name'],
                                'foto_url': voice_actor['person'].get('images', {}).get('jpg', {}).get('image_url')
                            }
                    characters.append(character_info)
            time.sleep(1)
            staff_data = jikan_client.get_anime_staff(mal_id)
            staff = []
            if staff_data and 'data' in staff_data:
                for staff_entry in staff_data['data']:
                    staff.append({
                        'id': staff_entry['person']['mal_id'],
                        'nome': staff_entry['person']['name'],
                        'cargo': ', '.join(staff_entry['positions']),
                        'foto_url': staff_entry['person'].get('images', {}).get('jpg', {}).get('image_url')
                    })
            cursor.execute('SELECT id FROM "Anime" WHERE mal_id = %s', (mal_id,))
            existing = cursor.fetchone()
            anime_data = {
                'mal_id': mal_id,
                'titulo_curado': anime['title'],
                'titulo_api': anime.get('title_japanese', anime['title']),
                'sinopse': anime.get('synopsis', ''),
                'poster_url': anime.get('images', {}).get('jpg', {}).get('image_url'),
                'data_lancamento_curada': anime.get('aired', {}).get('from', '').split('T')[0] if anime.get('aired', {}).get('from') else None,
                'data_lancamento_api': anime.get('aired', {}).get('from', '').split('T')[0] if anime.get('aired', {}).get('from') else None,
                'avaliacao': anime.get('score', 0),
                'generos': json.dumps([g['name'] for g in anime.get('genres', [])]),
                'plataformas_curadas': json.dumps([s['name'] for s in anime.get('streaming', [])]),
                'fonte': anime.get('source', ''),
                'estudio': ', '.join([s['name'] for s in anime.get('studios', [])]) if anime.get('studios') else '',
                'status_dublagem': 'Dublado' if any(va['language'] == 'Portuguese (BR)' for char_entry in characters_data.get('data', []) for va in char_entry.get('voice_actors', [])) else 'Legendado',
                'numero_episodios': anime.get('episodes', 0),
                'proximo_episodio': anime.get('broadcast', {}).get('string'),
                'mal_link': anime.get('url'),
                'trailer_url': anime.get('trailer', {}).get('youtube_id'),
                'tags': json.dumps([t['name'] for t in anime.get('themes', []) + anime.get('demographics', []) + anime.get('explicit_genres', []) + anime.get('genres', [])]),
                'staff': json.dumps(staff),
                'personagens': json.dumps(characters),
            }
            if existing:
                update_query = (
                    'UPDATE "Anime" SET '
                    'titulo_curado = %(titulo_curado)s, '
                    'titulo_api = %(titulo_api)s, '
                    'sinopse = %(sinopse)s, '
                    'poster_url = %(poster_url)s, '
                    'data_lancamento_curada = %(data_lancamento_curada)s, '
                    'data_lancamento_api = %(data_lancamento_api)s, '
                    'avaliacao = %(avaliacao)s, '
                    'generos = %(generos)s, '
                    'plataformas_curadas = %(plataformas_curadas)s, '
                    'fonte = %(fonte)s, '
                    'estudio = %(estudio)s, '
                    'status_dublagem = %(status_dublagem)s, '
                    'numero_episodios = %(numero_episodios)s, '
                    'proximo_episodio = %(proximo_episodio)s, '
                    'mal_link = %(mal_link)s, '
                    'trailer_url = %(trailer_url)s, '
                    'tags = %(tags)s, '
                    'staff = %(staff)s, '
                    'personagens = %(personagens)s '
                    'WHERE mal_id = %(mal_id)s'
                )
                cursor.execute(update_query, anime_data)
                animes_atualizados += 1
            else:
                insert_query = (
                    'INSERT INTO "Anime" ( '
                    'mal_id, titulo_curado, titulo_api, sinopse, poster_url, '
                    'data_lancamento_curada, data_lancamento_api, avaliacao, generos, '
                    'plataformas_curadas, fonte, estudio, status_dublagem, '
                    'numero_episodios, proximo_episodio, mal_link, trailer_url, '
                    'tags, staff, personagens '
                    ') VALUES ( '
                    '%(mal_id)s, %(titulo_curado)s, %(titulo_api)s, %(sinopse)s, %(poster_url)s, '
                    '%(data_lancamento_curada)s, %(data_lancamento_api)s, %(avaliacao)s, %(generos)s, '
                    '%(plataformas_curadas)s, %(fonte)s, %(estudio)s, %(status_dublagem)s, '
                    '%(numero_episodios)s, %(proximo_episodio)s, %(mal_link)s, %(trailer_url)s, '
                    '%(tags)s, %(staff)s, %(personagens)s '
                    ')'
                )
                cursor.execute(insert_query, anime_data)
                novos_animes += 1
        conn.commit()
        logger.info(f"Sincronização de animes concluída: {novos_animes} novos, {animes_atualizados} atualizados.")
    except Exception as e:
        logger.error(f"Erro durante a sincronização de animes: {e}")
        return 0, 0
    finally:
        if 'conn' in locals() and conn:
            cursor.close()
            conn.close()
    return novos_animes, animes_atualizados