def test_home(client):
    response = client.get("/")
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["message"] == "Bem-vindo à API do Orbe Nerd!"

def test_get_filmes_empty(client):
    response = client.get("/api/filmes")
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["results"] == []

def test_search(client):
    response = client.get("/api/search?q=test")
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["results"] == []

def test_trending(client):
    response = client.get("/api/trending")
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["results"] == []

def test_get_series_empty(client):
    response = client.get("/api/series")
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["results"] == []

def test_get_animes_empty(client):
    response = client.get("/api/animes")
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["results"] == []

def test_get_jogos_empty(client):
    response = client.get("/api/jogos")
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["results"] == []
