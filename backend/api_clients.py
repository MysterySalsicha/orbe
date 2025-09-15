import os
import time
import json
import logging
import requests
from dotenv import load_dotenv

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("api_clients")

# Carregar variáveis de ambiente
load_dotenv()

class TMDBClient:
    """Cliente para a API do The Movie Database (TMDB)"""
    
    def __init__(self):
        self.api_key = os.getenv("TMDB_API_KEY")
        self.base_url = "https://api.themoviedb.org/3"
        self.language = "pt-BR"
        
        if not self.api_key:
            logger.warning("TMDB_API_KEY não encontrada nas variáveis de ambiente")
    
    def _make_request(self, endpoint, params=None):
        """Realiza uma requisição para a API do TMDB"""
        if not self.api_key:
            logger.error("API key não configurada para TMDB")
            return None
            
        url = f"{self.base_url}{endpoint}"
        default_params = {
            "api_key": self.api_key,
            "language": self.language
        }
        
        if params:
            default_params.update(params)
        
        try:
            response = requests.get(url, params=default_params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Erro na requisição para TMDB: {e}")
            return None
    
    def get_popular_movies(self, page=1):
        """Obtém filmes populares"""
        return self._make_request(
            "/movie/popular",
            {"page": page}
        )
    
    def get_popular_tv_shows(self, page=1):
        """Obtém séries populares"""
        return self._make_request(
            "/tv/popular",
            {"page": page}
        )
    
    def get_movie_details(self, movie_id):
        """Obtém detalhes de um filme específico"""
        return self._make_request(f"/movie/{movie_id}")
    
    def get_tv_show_details(self, tv_id):
        """Obtém detalhes de uma série específica"""
        return self._make_request(f"/tv/{tv_id}")

class IGDBClient:
    """Cliente para a API do Internet Game Database (IGDB)"""
    
    def __init__(self):
        self.client_id = os.getenv("IGDB_CLIENT_ID")
        self.client_secret = os.getenv("IGDB_CLIENT_SECRET")
        self.base_url = "https://api.igdb.com/v4"
        self.auth_url = "https://id.twitch.tv/oauth2/token"
        self.access_token = None
        self.token_expires = 0
        
        if not self.client_id or not self.client_secret:
            logger.warning("IGDB_CLIENT_ID ou IGDB_CLIENT_SECRET não encontrados nas variáveis de ambiente")
        else:
            self._authenticate()
    
    def _authenticate(self):
        """Autentica com a API do IGDB via Twitch"""
        if time.time() < self.token_expires:
            return
            
        try:
            response = requests.post(self.auth_url, params={
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "grant_type": "client_credentials"
            })
            response.raise_for_status()
            data = response.json()
            
            self.access_token = data.get("access_token")
            expires_in = data.get("expires_in", 0)
            self.token_expires = time.time() + expires_in - 100  # Renovar 100 segundos antes de expirar
            
            logger.info("Autenticação com IGDB realizada com sucesso")
        except requests.exceptions.RequestException as e:
            logger.error(f"Erro na autenticação com IGDB: {e}")
    
    def _make_request(self, endpoint, body):
        """Realiza uma requisição para a API do IGDB"""
        if not self.access_token:
            self._authenticate()
            if not self.access_token:
                logger.error("Falha na autenticação com IGDB")
                return None
        
        url = f"{self.base_url}{endpoint}"
        headers = {
            "Client-ID": self.client_id,
            "Authorization": f"Bearer {self.access_token}",
            "Accept": "application/json"
        }
        
        try:
            response = requests.post(url, headers=headers, data=body)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Erro na requisição para IGDB: {e}")
            if response.status_code == 401:
                # Token expirado, forçar renovação
                self.token_expires = 0
                self._authenticate()
            return None
    
    def get_popular_games(self, limit=50):
        """Obtém jogos populares"""
        body = f"fields name,summary,cover.image_id,first_release_date,rating,aggregated_rating,genres.name,platforms.name,involved_companies.company.name; sort rating desc; limit {limit};"
        return self._make_request("/games", body)
    
    def get_game_details(self, game_id):
        """Obtém detalhes de um jogo específico"""
        body = f"fields name,summary,storyline,cover.image_id,first_release_date,rating,aggregated_rating,genres.name,platforms.name,involved_companies.company.name,screenshots.image_id,videos.*; where id = {game_id};"
        result = self._make_request("/games", body)
        return result[0] if result else None

class JikanClient:
    """Cliente para a API do Jikan (MyAnimeList)"""
    
    def __init__(self):
        self.base_url = "https://api.jikan.moe/v4/"
        self.last_request = 0
        self.rate_limit = 1  # Segundos entre requisições para evitar rate limiting
    
    def _make_request(self, endpoint, params=None):
        """Realiza uma requisição para a API do Jikan"""
        # Respeitar rate limiting
        time_since_last = time.time() - self.last_request
        if time_since_last < self.rate_limit:
            time.sleep(self.rate_limit - time_since_last)
        
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = requests.get(url, params=params)
            self.last_request = time.time()
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Erro na requisição para Jikan: {e}")
            return None
    
    def get_top_animes(self, page=1, limit=25):
        """Obtém animes populares"""
        return self._make_request(
            "top/anime",
            {"page": page, "limit": limit}
        )
    
    def get_anime_details(self, anime_id):
        """Obtém detalhes de um anime específico"""
        return self._make_request(f"anime/{anime_id}/full")
    
    def search_animes(self, query, page=1, limit=25):
        """Pesquisa animes por termo"""
        return self._make_request(
            "/anime",
            {"q": query, "page": page, "limit": limit}
        )
    
    def get_anime_characters(self, mal_id):
        """Obtém personagens de um anime específico"""
        return self._make_request(f"anime/{mal_id}/characters")

    def get_anime_staff(self, mal_id):
        """Obtém staff de um anime específico"""
        return self._make_request(f"anime/{mal_id}/staff")