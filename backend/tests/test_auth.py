import json
import pytest
from models import Usuario
from extensions import db
from app import hash_password

@pytest.fixture
def sample_user(app):
    with app.app_context():
        user = Usuario(nome="Test User", email="test@example.com", senha_hash=hash_password("password"))
        db.session.add(user)
        db.session.commit()
        return user

def test_register(client):
    response = client.post("/api/auth/register", data=json.dumps({
        "nome": "New User",
        "email": "new@example.com",
        "password": "password"
    }), content_type="application/json")
    assert response.status_code == 201
    json_data = response.get_json()
    assert "token" in json_data
    assert json_data["user"]["email"] == "new@example.com"

def test_register_duplicate_email(client, sample_user):
    response = client.post("/api/auth/register", data=json.dumps({
        "nome": "Another User",
        "email": "test@example.com",
        "password": "password"
    }), content_type="application/json")
    assert response.status_code == 400
    json_data = response.get_json()
    assert json_data["error"] == "Email já cadastrado"

def test_login(client, sample_user):
    response = client.post("/api/auth/login", data=json.dumps({
        "email": "test@example.com",
        "password": "password"
    }), content_type="application/json")
    assert response.status_code == 200
    json_data = response.get_json()
    assert "token" in json_data

def test_login_invalid_credentials(client, sample_user):
    response = client.post("/api/auth/login", data=json.dumps({
        "email": "test@example.com",
        "password": "wrongpassword"
    }), content_type="application/json")
    assert response.status_code == 401
    json_data = response.get_json()
    assert json_data["error"] == "Email ou senha inválidos"

def test_get_me(client, sample_user):
    # Primeiro, faz o login para obter o token
    login_response = client.post("/api/auth/login", data=json.dumps({
        "email": "test@example.com",
        "password": "password"
    }), content_type="application/json")
    token = login_response.get_json()["token"]

    # Agora, acessa a rota protegida
    response = client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["email"] == "test@example.com"

def test_get_me_invalid_token(client):
    response = client.get("/api/auth/me", headers={
        "Authorization": "Bearer invalidtoken"
    })
    assert response.status_code == 401
    json_data = response.get_json()
    assert json_data["error"] == "Token inválido"

def test_register_invalid_data(client):
    response = client.post("/api/auth/register", data=json.dumps({
        "nome": "Test User"
    }), content_type="application/json")
    assert response.status_code == 400
    json_data = response.get_json()
    assert json_data["error"] == "Email, senha e nome são obrigatórios"

def test_login_invalid_data(client):
    response = client.post("/api/auth/login", data=json.dumps({
        "email": "test@example.com"
    }), content_type="application/json")
    assert response.status_code == 400
    json_data = response.get_json()
    assert json_data["error"] == "Email e senha são obrigatórios"

def test_get_me_deleted_user(client, app, sample_user):
    login_response = client.post("/api/auth/login", data=json.dumps({
        "email": "test@example.com",
        "password": "password"
    }), content_type="application/json")
    token = login_response.get_json()["token"]

    with app.app_context():
        db.session.delete(sample_user)
        db.session.commit()

    response = client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 404
    json_data = response.get_json()
    assert json_data["error"] == "Usuário não encontrado"
