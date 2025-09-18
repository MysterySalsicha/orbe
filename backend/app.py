import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
import hashlib
import jwt

# Importar a instância do db e os modelos
from .extensions import db
from .models import Filme, Serie, Anime, Jogo, Usuario, Notificacao

def hash_password(password):
    """Gera o hash de uma senha usando SHA256."""
    return hashlib.sha256(password.encode()).hexdigest()

def create_app(testing=False):
    """Cria e configura uma instância do aplicativo Flask."""
    app = Flask(__name__)

    if testing:
        app.config["TESTING"] = True
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        app.config["SECRET_KEY"] = "test-secret-key"
    else:
        load_dotenv()
        app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
        app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
        app.config["SECRET_KEY"] = "orbe_nerd_secret_key_2025"


    # Inicializar extensões
    db.init_app(app)

    # Lista de origens permitidas para o CORS
    allowed_origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://orbe-seven.vercel.app",
        "https://orbe-git-feat-remove-mock-data-igor-silvas-projects-70341dd7.vercel.app",
    ]

    CORS(app, origins=allowed_origins, supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], allow_headers=["Content-Type", "Authorization"])

    # Funções auxiliares de autenticação
    def generate_token(user_id):
        payload = {
            'user_id': user_id,
            'exp': datetime.now(timezone.utc) + timedelta(days=7)
        }
        return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

    def verify_token(token):
        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            return payload['user_id']
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return None

    # Rotas da API
    @app.route("/", methods=["GET"])
    def home():
        return jsonify({"message": "Bem-vindo à API do Orbe Nerd!", "version": "1.0"})

    # Rotas de Mídia (exemplo para Filmes)
    @app.route("/api/filmes", methods=["GET"])
    def get_filmes():
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        query = Filme.query
        filmes = query.paginate(page=page, per_page=per_page, error_out=False)
        return jsonify({
            "results": [filme.to_dict() for filme in filmes.items],
            "page": page,
            "total_pages": filmes.pages,
            "total_results": filmes.total
        })

    @app.route("/api/filmes/<int:filme_id>", methods=["GET"])
    def get_filme_details(filme_id):
        filme = Filme.query.get_or_404(filme_id)
        return jsonify(filme.to_dict())

    # Rotas para Series, Animes, Jogos
    @app.route("/api/series", methods=["GET"])
    def get_series():
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        query = Serie.query
        series = query.paginate(page=page, per_page=per_page, error_out=False)
        return jsonify({
            "results": [serie.to_dict() for serie in series.items],
            "page": page,
            "total_pages": series.pages,
            "total_results": series.total
        })

    @app.route("/api/series/<int:serie_id>", methods=["GET"])
    def get_serie_details(serie_id):
        serie = Serie.query.get_or_404(serie_id)
        return jsonify(serie.to_dict())

    @app.route("/api/animes", methods=["GET"])
    def get_animes():
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        query = Anime.query
        animes = query.paginate(page=page, per_page=per_page, error_out=False)
        return jsonify({
            "results": [anime.to_dict() for anime in animes.items],
            "page": page,
            "total_pages": animes.pages,
            "total_results": animes.total
        })

    @app.route("/api/animes/<int:anime_id>", methods=["GET"])
    def get_anime_details(anime_id):
        anime = Anime.query.get_or_404(anime_id)
        return jsonify(anime.to_dict())

    @app.route("/api/jogos", methods=["GET"])
    def get_jogos():
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        query = Jogo.query
        jogos = query.paginate(page=page, per_page=per_page, error_out=False)
        return jsonify({
            "results": [jogo.to_dict() for jogo in jogos.items],
            "page": page,
            "total_pages": jogos.pages,
            "total_results": jogos.total
        })

    @app.route("/api/jogos/<int:jogo_id>", methods=["GET"])
    def get_jogo_details(jogo_id):
        jogo = Jogo.query.get_or_404(jogo_id)
        return jsonify(jogo.to_dict())

    # Rota de Pesquisa Global
    @app.route("/api/search", methods=["GET"])
    def search():
        query = request.args.get('q', '')
        return jsonify({"results": []})

    # Rota de Conteúdo em Alta
    @app.route("/api/trending", methods=["GET"])
    def get_trending():
        return jsonify({"results": []})

    # Rotas de Autenticação
    @app.route("/api/auth/register", methods=["POST"])
    def register():
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password') or not data.get('nome'):
            return jsonify({"error": "Email, senha e nome são obrigatórios"}), 400
        if Usuario.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email já cadastrado"}), 400
        new_user = Usuario(nome=data['nome'], email=data['email'], senha_hash=hash_password(data['password']))
        db.session.add(new_user)
        db.session.commit()
        token = generate_token(new_user.id)
        return jsonify({"message": "Usuário criado com sucesso", "token": token, "user": new_user.to_dict()}), 201

    @app.route("/api/auth/login", methods=["POST"])
    def login():
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email e senha são obrigatórios"}), 400
        user = Usuario.query.filter_by(email=data['email']).first()
        if not user or user.senha_hash != hash_password(data['password']):
            return jsonify({"error": "Email ou senha inválidos"}), 401
        token = generate_token(user.id)
        return jsonify({"message": "Login realizado com sucesso", "token": token, "user": user.to_dict()})

    @app.route("/api/auth/me", methods=["GET"])
    def get_current_user():
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Token não fornecido"}), 401
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        if not user_id:
            return jsonify({"error": "Token inválido"}), 401
        user = Usuario.query.get(user_id)
        if not user:
            return jsonify({"error": "Usuário não encontrado"}), 404
        return jsonify(user.to_dict())

    @app.route("/api/debug_db_schema", methods=["GET"])
    def debug_db_schema():
        try:
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            columns = inspector.get_columns('filme')
            column_names = [col['name'] for col in columns]
            return jsonify({"filme_columns": column_names})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return app

app = create_app() # Make the app instance available for Gunicorn