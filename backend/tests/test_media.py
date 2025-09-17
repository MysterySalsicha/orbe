import pytest
from models import Filme, Serie, Anime, Jogo
from extensions import db

@pytest.fixture
def sample_filme(app):
    with app.app_context():
        filme = Filme(titulo_curado="Test Film", sinopse="A great film.")
        db.session.add(filme)
        db.session.commit()
        return filme.id

@pytest.fixture
def sample_serie(app):
    with app.app_context():
        serie = Serie(titulo_curado="Test Serie", sinopse="A great serie.")
        db.session.add(serie)
        db.session.commit()
        return serie.id

@pytest.fixture
def sample_anime(app):
    with app.app_context():
        anime = Anime(titulo_curado="Test Anime", sinopse="A great anime.")
        db.session.add(anime)
        db.session.commit()
        return anime.id

@pytest.fixture
def sample_jogo(app):
    with app.app_context():
        jogo = Jogo(titulo_curado="Test Jogo", sinopse="A great jogo.")
        db.session.add(jogo)
        db.session.commit()
        return jogo.id

def test_get_filmes_with_data(client, sample_filme):
    response = client.get("/api/filmes")
    assert response.status_code == 200
    json_data = response.get_json()
    assert len(json_data["results"]) == 1
    assert json_data["results"][0]["titulo"] == "Test Film"

def test_get_series_with_data(client, sample_serie):
    response = client.get("/api/series")
    assert response.status_code == 200
    json_data = response.get_json()
    assert len(json_data["results"]) == 1
    assert json_data["results"][0]["titulo"] == "Test Serie"

def test_get_animes_with_data(client, sample_anime):
    response = client.get("/api/animes")
    assert response.status_code == 200
    json_data = response.get_json()
    assert len(json_data["results"]) == 1
    assert json_data["results"][0]["titulo"] == "Test Anime"

def test_get_jogos_with_data(client, sample_jogo):
    response = client.get("/api/jogos")
    assert response.status_code == 200
    json_data = response.get_json()
    assert len(json_data["results"]) == 1
    assert json_data["results"][0]["titulo"] == "Test Jogo"

def test_get_filme_details(client, sample_filme):
    response = client.get(f"/api/filmes/{sample_filme}")
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["titulo"] == "Test Film"

def test_get_serie_details(client, sample_serie):
    response = client.get(f"/api/series/{sample_serie}")
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["titulo"] == "Test Serie"

def test_get_anime_details(client, sample_anime):
    response = client.get(f"/api/animes/{sample_anime}")
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["titulo"] == "Test Anime"

def test_get_jogo_details(client, sample_jogo):
    response = client.get(f"/api/jogos/{sample_jogo}")
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["titulo"] == "Test Jogo"
