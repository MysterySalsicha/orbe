import os
from dotenv import load_dotenv

load_dotenv()

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import hashlib
import jwt

# Importar a instância do db e os modelos
from extensions import db
from models import Filme, Serie, Anime, Jogo, Usuario, Notificacao

app = Flask(__name__)

# Configuração da Aplicação
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "orbe_nerd_secret_key_2025"

# Inicializar extensões
db.init_app(app)
# Configuração de CORS para permitir múltiplas origens
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://orbe-nerd.vercel.app",
    "https://orbe-seven.vercel.app"
    # Adicione aqui a URL do seu deploy de preview da Vercel se necessário
    # Ex: r"https://orbe-nerd-.*-igor-santos-projects.vercel.app"
]
CORS(app, origins=origins, supports_credentials=True)

# Funções auxiliares de autenticação
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7)
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
    # ... (lógica de filtro existente) ...
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

# ... (Rotas para Series, Animes, Jogos seguem o mesmo padrão)

# Rotas de Séries
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

# Rotas de Animes
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

# Rotas de Jogos
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

# ... (Outras rotas como Search, Trending, Auth, etc.)

# Rota de Pesquisa Global
@app.route("/api/search", methods=["GET"])
def search():
    query = request.args.get('q', '')
    # ... (lógica de pesquisa existente) ...
    return jsonify({"results": []}) # Placeholder

# Rota de Conteúdo em Alta
@app.route("/api/trending", methods=["GET"])
def get_trending():
    # ... (lógica de trending existente) ...
    return jsonify({"results": []}) # Placeholder

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

# Bloco de execução principal
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)