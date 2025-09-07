import os
from datetime import datetime
from app import app, db, Filme, Serie, Anime, Jogo
from api_clients import tmdb_client, anilist_client, twitch_client

def sync_movies_from_tmdb():
    """Sincroniza filmes do TMDB com o banco de dados"""
    print("Sincronizando filmes do TMDB...")
    
    # Busca filmes populares
    popular_movies = tmdb_client.get_popular_movies()
    now_playing = tmdb_client.get_now_playing_movies()
    upcoming = tmdb_client.get_upcoming_movies()
    
    all_movies = []
    all_movies.extend(popular_movies.get('results', []))
    all_movies.extend(now_playing.get('results', []))
    all_movies.extend(upcoming.get('results', []))
    
    # Remove duplicatas baseado no ID
    unique_movies = {movie['id']: movie for movie in all_movies}
    
    for movie_data in unique_movies.values():
        # Verifica se o filme já existe
        existing_movie = Filme.query.filter_by(id=movie_data['id']).first()
        
        if not existing_movie:
            # Busca detalhes completos do filme
            details = tmdb_client.get_movie_details(movie_data['id'])
            
            # Extrai gêneros
            genres = [genre['name'] for genre in details.get('genres', [])]
            
            # Extrai direção e roteiro
            crew = details.get('credits', {}).get('crew', [])
            directors = [person['name'] for person in crew if person['job'] == 'Director']
            writers = [person['name'] for person in crew if person['job'] in ['Writer', 'Screenplay']]
            
            # Cria novo filme
            new_movie = Filme(
                id=movie_data['id'],
                titulo_curado=movie_data.get('title', ''),
                titulo_api=movie_data.get('title', ''),
                sinopse=movie_data.get('overview', ''),
                poster_curado=f"{tmdb_client.image_base_url}{movie_data.get('poster_path', '')}" if movie_data.get('poster_path') else None,
                poster_url_api=f"{tmdb_client.image_base_url}{movie_data.get('poster_path', '')}" if movie_data.get('poster_path') else None,
                data_lancamento_curada=movie_data.get('release_date', ''),
                data_lancamento_api=movie_data.get('release_date', ''),
                avaliacao=movie_data.get('vote_average', 0),
                generos=genres,
                plataformas_curadas=[],
                em_cartaz=movie_data['id'] in [m['id'] for m in now_playing.get('results', [])],
                em_prevenda=movie_data['id'] in [m['id'] for m in upcoming.get('results', [])],
                duracao=f"{details.get('runtime', 0)} min" if details.get('runtime') else None,
                direcao=', '.join(directors) if directors else None,
                roteiro=', '.join(writers) if writers else None
            )
            
            db.session.add(new_movie)
    
    db.session.commit()
    print(f"Sincronizados {len(unique_movies)} filmes do TMDB")

def sync_series_from_tmdb():
    """Sincroniza séries do TMDB com o banco de dados"""
    print("Sincronizando séries do TMDB...")
    
    # Busca séries populares
    popular_series = tmdb_client.get_popular_tv_shows()
    
    for series_data in popular_series.get('results', []):
        # Verifica se a série já existe
        existing_series = Serie.query.filter_by(id=series_data['id']).first()
        
        if not existing_series:
            # Busca detalhes completos da série
            details = tmdb_client.get_tv_show_details(series_data['id'])
            
            # Extrai gêneros
            genres = [genre['name'] for genre in details.get('genres', [])]
            
            # Extrai criadores
            creators = [creator['name'] for creator in details.get('created_by', [])]
            
            # Cria nova série
            new_series = Serie(
                id=series_data['id'],
                titulo_curado=series_data.get('name', ''),
                titulo_api=series_data.get('name', ''),
                sinopse=series_data.get('overview', ''),
                poster_curado=f"{tmdb_client.image_base_url}{series_data.get('poster_path', '')}" if series_data.get('poster_path') else None,
                poster_url_api=f"{tmdb_client.image_base_url}{series_data.get('poster_path', '')}" if series_data.get('poster_path') else None,
                data_lancamento_curada=series_data.get('first_air_date', ''),
                data_lancamento_api=series_data.get('first_air_date', ''),
                avaliacao=series_data.get('vote_average', 0),
                generos=genres,
                plataformas_curadas=[],
                numero_temporadas=details.get('number_of_seasons', 0),
                numero_episodios=details.get('number_of_episodes', 0),
                criadores=creators,
                status=details.get('status', '')
            )
            
            db.session.add(new_series)
    
    db.session.commit()
    print(f"Sincronizadas {len(popular_series.get('results', []))} séries do TMDB")

def sync_anime_from_anilist():
    """Sincroniza animes do Anilist com o banco de dados"""
    print("Sincronizando animes do Anilist...")
    
    # Busca animes populares e em alta
    trending_anime = anilist_client.get_trending_anime()
    popular_anime = anilist_client.get_popular_anime()
    
    all_anime = []
    all_anime.extend(trending_anime.get('data', {}).get('Page', {}).get('media', []))
    all_anime.extend(popular_anime.get('data', {}).get('Page', {}).get('media', []))
    
    # Remove duplicatas baseado no ID
    unique_anime = {anime['id']: anime for anime in all_anime}
    
    for anime_data in unique_anime.values():
        # Verifica se o anime já existe
        existing_anime = Anime.query.filter_by(id=anime_data['id']).first()
        
        if not existing_anime:
            # Extrai título preferencial
            title = anime_data.get('title', {})
            titulo = title.get('romaji') or title.get('english') or title.get('native', '')
            
            # Extrai data de lançamento
            start_date = anime_data.get('startDate', {})
            data_lancamento = None
            if start_date and start_date.get('year'):
                year = start_date.get('year')
                month = start_date.get('month', 1)
                day = start_date.get('day', 1)
                data_lancamento = f"{year}-{month:02d}-{day:02d}"
            
            # Extrai estúdios
            studios = anime_data.get('studios', {}).get('nodes', [])
            estudio = studios[0]['name'] if studios else None
            
            # Cria novo anime
            new_anime = Anime(
                id=anime_data['id'],
                titulo_curado=titulo,
                titulo_api=titulo,
                sinopse=anime_data.get('description', ''),
                poster_curado=anime_data.get('coverImage', {}).get('large'),
                poster_url_api=anime_data.get('coverImage', {}).get('large'),
                data_lancamento_curada=data_lancamento,
                data_lancamento_api=data_lancamento,
                avaliacao=anime_data.get('averageScore', 0) / 10 if anime_data.get('averageScore') else 0,
                generos=anime_data.get('genres', []),
                plataformas_curadas=[],
                fonte=anime_data.get('source', ''),
                estudio=estudio,
                status_dublagem='Legendado',  # Padrão
                numero_episodios=anime_data.get('episodes', 0),
                proximo_episodio=None
            )
            
            db.session.add(new_anime)
    
    db.session.commit()
    print(f"Sincronizados {len(unique_anime)} animes do Anilist")

def sync_games_from_twitch():
    """Sincroniza jogos do Twitch/IGDB com o banco de dados"""
    print("Sincronizando jogos do Twitch/IGDB...")
    
    try:
        # Busca jogos populares
        popular_games = twitch_client.get_popular_games()
        upcoming_games = twitch_client.get_upcoming_games()
        
        all_games = []
        all_games.extend(popular_games)
        all_games.extend(upcoming_games)
        
        # Remove duplicatas baseado no ID
        unique_games = {game['id']: game for game in all_games}
        
        for game_data in unique_games.values():
            # Verifica se o jogo já existe
            existing_game = Jogo.query.filter_by(id=game_data['id']).first()
            
            if not existing_game:
                # Extrai gêneros
                genres = [genre['name'] for genre in game_data.get('genres', [])]
                
                # Extrai plataformas
                platforms = [platform['name'] for platform in game_data.get('platforms', [])]
                
                # Extrai empresas
                companies = game_data.get('involved_companies', [])
                developers = []
                publishers = []
                
                for company_data in companies:
                    company_name = company_data.get('company', {}).get('name', '')
                    if company_data.get('developer'):
                        developers.append(company_name)
                    if company_data.get('publisher'):
                        publishers.append(company_name)
                
                # Converte timestamp para data
                release_date = None
                if game_data.get('first_release_date'):
                    release_date = datetime.fromtimestamp(game_data['first_release_date']).strftime('%Y-%m-%d')
                
                # Extrai URL da capa
                cover_url = None
                if game_data.get('cover'):
                    cover_url = f"https:{game_data['cover']['url']}"
                
                # Cria novo jogo
                new_game = Jogo(
                    id=game_data['id'],
                    titulo_curado=game_data.get('name', ''),
                    titulo_api=game_data.get('name', ''),
                    sinopse=game_data.get('summary', ''),
                    poster_curado=cover_url,
                    poster_url_api=cover_url,
                    data_lancamento_curada=release_date,
                    data_lancamento_api=release_date,
                    avaliacao=game_data.get('rating', 0) / 10 if game_data.get('rating') else 0,
                    generos=genres,
                    plataformas_curadas=platforms,
                    desenvolvedores=developers,
                    publicadoras=publishers,
                    lojas_digitais={}
                )
                
                db.session.add(new_game)
        
        db.session.commit()
        print(f"Sincronizados {len(unique_games)} jogos do Twitch/IGDB")
        
    except Exception as e:
        print(f"Erro ao sincronizar jogos: {e}")

def sync_all_data():
    """Sincroniza todos os dados das APIs"""
    print("Iniciando sincronização completa...")
    
    with app.app_context():
        try:
            sync_movies_from_tmdb()
            sync_series_from_tmdb()
            sync_anime_from_anilist()
            sync_games_from_twitch()
            print("Sincronização completa finalizada!")
        except Exception as e:
            print(f"Erro durante a sincronização: {e}")
            db.session.rollback()

if __name__ == "__main__":
    sync_all_data()

