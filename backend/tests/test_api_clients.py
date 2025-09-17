import pytest
from unittest.mock import patch, Mock
from api_clients import TMDBClient, IGDBClient, JikanClient

@pytest.fixture
def tmdb_client(monkeypatch):
    monkeypatch.setenv("TMDB_API_KEY", "test_key")
    return TMDBClient()

@patch('api_clients.requests.get')
def test_tmdb_get_popular_movies(mock_get, tmdb_client):
    mock_response = Mock()
    mock_response.json.return_value = {"results": ["movie1", "movie2"]}
    mock_response.raise_for_status.return_value = None
    mock_get.return_value = mock_response

    result = tmdb_client.get_popular_movies()

    assert result == {"results": ["movie1", "movie2"]}
    mock_get.assert_called_once_with(
        "https://api.themoviedb.org/3/movie/popular",
        params={"api_key": tmdb_client.api_key, "language": "pt-BR", "page": 1}
    )

@patch('api_clients.requests.get')
def test_tmdb_get_popular_tv_shows(mock_get, tmdb_client):
    mock_response = Mock()
    mock_response.json.return_value = {"results": ["show1", "show2"]}
    mock_response.raise_for_status.return_value = None
    mock_get.return_value = mock_response

    result = tmdb_client.get_popular_tv_shows()

    assert result == {"results": ["show1", "show2"]}
    mock_get.assert_called_once_with(
        "https://api.themoviedb.org/3/tv/popular",
        params={"api_key": tmdb_client.api_key, "language": "pt-BR", "page": 1}
    )

@patch('api_clients.requests.get')
def test_tmdb_get_movie_details(mock_get, tmdb_client):
    mock_response = Mock()
    mock_response.json.return_value = {"id": 123, "title": "Test Movie"}
    mock_response.raise_for_status.return_value = None
    mock_get.return_value = mock_response

    result = tmdb_client.get_movie_details(123)

    assert result == {"id": 123, "title": "Test Movie"}
    mock_get.assert_called_once_with(
        "https://api.themoviedb.org/3/movie/123",
        params={"api_key": tmdb_client.api_key, "language": "pt-BR"}
    )

@patch('api_clients.requests.get')
def test_tmdb_get_tv_show_details(mock_get, tmdb_client):
    mock_response = Mock()
    mock_response.json.return_value = {"id": 456, "name": "Test Show"}
    mock_response.raise_for_status.return_value = None
    mock_get.return_value = mock_response

    result = tmdb_client.get_tv_show_details(456)

    assert result == {"id": 456, "name": "Test Show"}
    mock_get.assert_called_once_with(
        "https://api.themoviedb.org/3/tv/456",
        params={"api_key": tmdb_client.api_key, "language": "pt-BR"}
    )

@pytest.fixture
def igdb_client(monkeypatch):
    monkeypatch.setenv("IGDB_CLIENT_ID", "test_id")
    monkeypatch.setenv("IGDB_CLIENT_SECRET", "test_secret")
    return IGDBClient()

@patch('api_clients.requests.post')
def test_igdb_authentication(mock_post, igdb_client):
    mock_auth_response = Mock()
    mock_auth_response.json.return_value = {"access_token": "test_token", "expires_in": 3600}
    mock_auth_response.raise_for_status.return_value = None
    mock_post.return_value = mock_auth_response

    igdb_client._authenticate()

    assert igdb_client.access_token == "test_token"

@patch('api_clients.requests.post')
def test_igdb_get_popular_games(mock_post, igdb_client):
    mock_auth_response = Mock()
    mock_auth_response.json.return_value = {"access_token": "test_token", "expires_in": 3600}
    mock_auth_response.raise_for_status.return_value = None

    mock_games_response = Mock()
    mock_games_response.json.return_value = [{"id": 1, "name": "Test Game"}]
    mock_games_response.raise_for_status.return_value = None

    mock_post.side_effect = [mock_auth_response, mock_games_response]
    result = igdb_client.get_popular_games()

    assert result == [{"id": 1, "name": "Test Game"}]

@pytest.fixture
def jikan_client():
    return JikanClient()

@patch('api_clients.requests.get')
@patch('api_clients.time.sleep')
def test_jikan_rate_limiting(mock_sleep, mock_get, jikan_client):
    mock_response = Mock()
    mock_response.json.return_value = {"data": []}
    mock_response.raise_for_status.return_value = None
    mock_get.return_value = mock_response

    jikan_client.get_top_animes()
    jikan_client.get_top_animes()

    mock_sleep.assert_called_once()

@patch('api_clients.requests.get')
def test_jikan_get_top_animes(mock_get, jikan_client):
    mock_response = Mock()
    mock_response.json.return_value = {"data": ["anime1", "anime2"]}
    mock_response.raise_for_status.return_value = None
    mock_get.return_value = mock_response

    result = jikan_client.get_top_animes()

    assert result == {"data": ["anime1", "anime2"]}

def test_tmdb_no_api_key(monkeypatch):
    monkeypatch.delenv("TMDB_API_KEY", raising=False)
    client = TMDBClient()
    assert client.get_popular_movies() is None

import requests

@patch('api_clients.requests.post')
def test_igdb_auth_fails(mock_post, monkeypatch):
    monkeypatch.setenv("IGDB_CLIENT_ID", "test_id")
    monkeypatch.setenv("IGDB_CLIENT_SECRET", "test_secret")
    mock_post.side_effect = requests.exceptions.RequestException("Auth error")
    client = IGDBClient()
    assert client.access_token is None

@patch('api_clients.requests.get')
def test_jikan_request_fails(mock_get, jikan_client):
    mock_get.side_effect = requests.exceptions.RequestException("Request error")
    result = jikan_client.get_top_animes()
    assert result is None
