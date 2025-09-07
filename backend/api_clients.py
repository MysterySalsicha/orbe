import os
import requests
from datetime import datetime
from typing import List, Dict, Any, Optional

class TMDBClient:
    def __init__(self):
        self.api_key = os.getenv("TMDB_API_KEY")
        self.read_access_token = os.getenv("TMDB_READ_ACCESS_TOKEN")
        self.base_url = "https://api.themoviedb.org/3"
        self.image_base_url = "https://image.tmdb.org/t/p/w500"
        
        self.headers = {
            "Authorization": f"Bearer {self.read_access_token}",
            "Content-Type": "application/json"
        }
    
    def get_popular_movies(self, page: int = 1) -> Dict[str, Any]:
        """Busca filmes populares"""
        url = f"{self.base_url}/movie/popular"
        params = {"page": page, "language": "pt-BR"}
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()
    
    def get_now_playing_movies(self, page: int = 1) -> Dict[str, Any]:
        """Busca filmes em cartaz"""
        url = f"{self.base_url}/movie/now_playing"
        params = {"page": page, "language": "pt-BR"}
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()
    
    def get_upcoming_movies(self, page: int = 1) -> Dict[str, Any]:
        """Busca filmes em breve"""
        url = f"{self.base_url}/movie/upcoming"
        params = {"page": page, "language": "pt-BR"}
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()
    
    def get_movie_details(self, movie_id: int) -> Dict[str, Any]:
        """Busca detalhes de um filme específico"""
        url = f"{self.base_url}/movie/{movie_id}"
        params = {"language": "pt-BR", "append_to_response": "credits,videos"}
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()
    
    def get_popular_tv_shows(self, page: int = 1) -> Dict[str, Any]:
        """Busca séries populares"""
        url = f"{self.base_url}/tv/popular"
        params = {"page": page, "language": "pt-BR"}
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()
    
    def get_tv_show_details(self, tv_id: int) -> Dict[str, Any]:
        """Busca detalhes de uma série específica"""
        url = f"{self.base_url}/tv/{tv_id}"
        params = {"language": "pt-BR", "append_to_response": "credits,videos"}
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()
    
    def search_multi(self, query: str, page: int = 1) -> Dict[str, Any]:
        """Busca geral (filmes, séries, pessoas)"""
        url = f"{self.base_url}/search/multi"
        params = {"query": query, "page": page, "language": "pt-BR"}
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()
    
    def get_trending(self, media_type: str = "all", time_window: str = "day") -> Dict[str, Any]:
        """Busca conteúdo em alta"""
        url = f"{self.base_url}/trending/{media_type}/{time_window}"
        params = {"language": "pt-BR"}
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()

class AnilistClient:
    def __init__(self):
        self.client_id = os.getenv("ANILIST_CLIENT_ID")
        self.client_secret = os.getenv("ANILIST_CLIENT_SECRET")
        self.base_url = "https://graphql.anilist.co"
        
    def get_access_token(self) -> str:
        """Obtém token de acesso (se necessário para operações autenticadas)"""
        # Para consultas públicas, não é necessário token
        return ""
    
    def execute_query(self, query: str, variables: Dict = None) -> Dict[str, Any]:
        """Executa uma query GraphQL"""
        payload = {"query": query}
        if variables:
            payload["variables"] = variables
            
        response = requests.post(self.base_url, json=payload)
        return response.json()
    
    def get_trending_anime(self, page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """Busca animes em alta"""
        query = """
        query ($page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                }
                media(type: ANIME, sort: TRENDING_DESC) {
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    description
                    coverImage {
                        large
                        medium
                    }
                    bannerImage
                    startDate {
                        year
                        month
                        day
                    }
                    endDate {
                        year
                        month
                        day
                    }
                    season
                    seasonYear
                    episodes
                    duration
                    status
                    genres
                    averageScore
                    popularity
                    studios {
                        nodes {
                            name
                        }
                    }
                    source
                }
            }
        }
        """
        variables = {"page": page, "perPage": per_page}
        return self.execute_query(query, variables)
    
    def get_popular_anime(self, page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """Busca animes populares"""
        query = """
        query ($page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                }
                media(type: ANIME, sort: POPULARITY_DESC) {
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    description
                    coverImage {
                        large
                        medium
                    }
                    bannerImage
                    startDate {
                        year
                        month
                        day
                    }
                    endDate {
                        year
                        month
                        day
                    }
                    season
                    seasonYear
                    episodes
                    duration
                    status
                    genres
                    averageScore
                    popularity
                    studios {
                        nodes {
                            name
                        }
                    }
                    source
                }
            }
        }
        """
        variables = {"page": page, "perPage": per_page}
        return self.execute_query(query, variables)
    
    def get_anime_details(self, anime_id: int) -> Dict[str, Any]:
        """Busca detalhes de um anime específico"""
        query = """
        query ($id: Int) {
            Media(id: $id, type: ANIME) {
                id
                title {
                    romaji
                    english
                    native
                }
                description
                coverImage {
                    large
                    medium
                }
                bannerImage
                startDate {
                    year
                    month
                    day
                }
                endDate {
                    year
                    month
                    day
                }
                season
                seasonYear
                episodes
                duration
                status
                genres
                averageScore
                popularity
                studios {
                    nodes {
                        name
                    }
                }
                source
                characters {
                    nodes {
                        id
                        name {
                            full
                        }
                        image {
                            large
                            medium
                        }
                    }
                }
                staff {
                    nodes {
                        id
                        name {
                            full
                        }
                        image {
                            large
                            medium
                        }
                    }
                }
            }
        }
        """
        variables = {"id": anime_id}
        return self.execute_query(query, variables)
    
    def search_anime(self, query: str, page: int = 1, per_page: int = 20) -> Dict[str, Any]:
        """Busca animes por termo"""
        search_query = """
        query ($search: String, $page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                }
                media(search: $search, type: ANIME) {
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    description
                    coverImage {
                        large
                        medium
                    }
                    bannerImage
                    startDate {
                        year
                        month
                        day
                    }
                    season
                    seasonYear
                    episodes
                    duration
                    status
                    genres
                    averageScore
                    popularity
                    studios {
                        nodes {
                            name
                        }
                    }
                    source
                }
            }
        }
        """
        variables = {"search": query, "page": page, "perPage": per_page}
        return self.execute_query(search_query, variables)

class TwitchClient:
    def __init__(self):
        self.client_id = os.getenv("TWITCH_CLIENT_ID")
        self.client_secret = os.getenv("TWITCH_CLIENT_SECRET")
        self.base_url = "https://api.igdb.com/v4"
        self.access_token = None
        
    def get_access_token(self) -> str:
        """Obtém token de acesso OAuth2"""
        if self.access_token:
            return self.access_token
            
        url = "https://id.twitch.tv/oauth2/token"
        data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "grant_type": "client_credentials"
        }
        
        response = requests.post(url, data=data)
        if response.status_code == 200:
            token_data = response.json()
            self.access_token = token_data["access_token"]
            return self.access_token
        else:
            raise Exception(f"Erro ao obter token: {response.status_code}")
    
    def make_request(self, endpoint: str, query: str) -> List[Dict[str, Any]]:
        """Faz requisição para a API IGDB"""
        token = self.get_access_token()
        headers = {
            "Client-ID": self.client_id,
            "Authorization": f"Bearer {token}",
            "Content-Type": "text/plain"
        }
        
        url = f"{self.base_url}/{endpoint}"
        response = requests.post(url, headers=headers, data=query)
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Erro na requisição: {response.status_code} - {response.text}")
    
    def get_popular_games(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Busca jogos populares"""
        query = f"""
        fields name, summary, cover.url, first_release_date, rating, genres.name, 
               platforms.name, involved_companies.company.name, screenshots.url;
        where rating > 80 & first_release_date != null;
        sort rating desc;
        limit {limit};
        """
        return self.make_request("games", query)
    
    def get_upcoming_games(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Busca jogos em breve"""
        current_timestamp = int(datetime.now().timestamp())
        query = f"""
        fields name, summary, cover.url, first_release_date, rating, genres.name, 
               platforms.name, involved_companies.company.name, screenshots.url;
        where first_release_date > {current_timestamp};
        sort first_release_date asc;
        limit {limit};
        """
        return self.make_request("games", query)
    
    def get_game_details(self, game_id: int) -> List[Dict[str, Any]]:
        """Busca detalhes de um jogo específico"""
        query = f"""
        fields name, summary, storyline, cover.url, first_release_date, rating, 
               genres.name, platforms.name, involved_companies.company.name, 
               screenshots.url, videos.video_id, websites.url;
        where id = {game_id};
        """
        return self.make_request("games", query)
    
    def search_games(self, search_term: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Busca jogos por termo"""
        query = f"""
        search "{search_term}";
        fields name, summary, cover.url, first_release_date, rating, genres.name, 
               platforms.name, involved_companies.company.name;
        limit {limit};
        """
        return self.make_request("games", query)

# Instâncias globais dos clientes
tmdb_client = TMDBClient()
anilist_client = AnilistClient()
twitch_client = TwitchClient()

