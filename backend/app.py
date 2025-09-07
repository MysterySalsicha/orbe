import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime, timedelta
import hashlib
import jwt

load_dotenv()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "orbe_nerd_secret_key_2025"  # Em produção, use uma chave mais segura
db = SQLAlchemy(app)

# Configurar CORS para permitir requisições do frontend
CORS(app, origins=["http://localhost:3000"])

# Modelos do Banco de Dados
class Filme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo_curado = db.Column(db.String(255), nullable=False)
    titulo_api = db.Column(db.String(255))
    sinopse = db.Column(db.Text)
    poster_curado = db.Column(db.String(255))
    poster_url_api = db.Column(db.String(255))
    data_lancamento_curada = db.Column(db.String(10))
    data_lancamento_api = db.Column(db.String(10))
    avaliacao = db.Column(db.Float)
    generos = db.Column(db.ARRAY(db.String))
    plataformas_curadas = db.Column(db.ARRAY(db.String))
    em_cartaz = db.Column(db.Boolean, default=False)
    em_prevenda = db.Column(db.Boolean, default=False)
    duracao = db.Column(db.String(50))
    direcao = db.Column(db.String(255))
    roteiro = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.id,
            "titulo": self.titulo_curado,
            "sinopse": self.sinopse,
            "poster": self.poster_curado,
            "data_lancamento": self.data_lancamento_curada,
            "avaliacao": self.avaliacao,
            "generos": self.generos or [],
            "plataformas": self.plataformas_curadas or [],
            "em_cartaz": self.em_cartaz,
            "em_prevenda": self.em_prevenda,
            "duracao": self.duracao,
            "direcao": self.direcao,
            "roteiro": self.roteiro,
            "tipo": "filme"
        }

class Serie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo_curado = db.Column(db.String(255), nullable=False)
    titulo_api = db.Column(db.String(255))
    sinopse = db.Column(db.Text)
    poster_curado = db.Column(db.String(255))
    poster_url_api = db.Column(db.String(255))
    data_lancamento_curada = db.Column(db.String(10))
    data_lancamento_api = db.Column(db.String(10))
    avaliacao = db.Column(db.Float)
    generos = db.Column(db.ARRAY(db.String))
    plataformas_curadas = db.Column(db.ARRAY(db.String))
    numero_temporadas = db.Column(db.Integer)
    numero_episodios = db.Column(db.Integer)
    criadores = db.Column(db.ARRAY(db.String))
    status = db.Column(db.String(50))

    def to_dict(self):
        return {
            "id": self.id,
            "titulo": self.titulo_curado,
            "sinopse": self.sinopse,
            "poster": self.poster_curado,
            "data_lancamento": self.data_lancamento_curada,
            "avaliacao": self.avaliacao,
            "generos": self.generos or [],
            "plataformas": self.plataformas_curadas or [],
            "numero_temporadas": self.numero_temporadas,
            "numero_episodios": self.numero_episodios,
            "criadores": self.criadores or [],
            "status": self.status,
            "tipo": "serie"
        }

class Anime(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo_curado = db.Column(db.String(255), nullable=False)
    titulo_api = db.Column(db.String(255))
    sinopse = db.Column(db.Text)
    poster_curado = db.Column(db.String(255))
    poster_url_api = db.Column(db.String(255))
    data_lancamento_curada = db.Column(db.String(10))
    data_lancamento_api = db.Column(db.String(10))
    avaliacao = db.Column(db.Float)
    generos = db.Column(db.ARRAY(db.String))
    plataformas_curadas = db.Column(db.ARRAY(db.String))
    fonte = db.Column(db.String(100))
    estudio = db.Column(db.String(255))
    status_dublagem = db.Column(db.String(50))
    numero_episodios = db.Column(db.Integer)
    proximo_episodio = db.Column(db.String(10))

    def to_dict(self):
        return {
            "id": self.id,
            "titulo": self.titulo_curado,
            "sinopse": self.sinopse,
            "poster": self.poster_curado,
            "data_lancamento": self.data_lancamento_curada,
            "avaliacao": self.avaliacao,
            "generos": self.generos or [],
            "plataformas": self.plataformas_curadas or [],
            "fonte": self.fonte,
            "estudio": self.estudio,
            "status_dublagem": self.status_dublagem,
            "numero_episodios": self.numero_episodios,
            "proximo_episodio": self.proximo_episodio,
            "tipo": "anime"
        }

class Jogo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo_curado = db.Column(db.String(255), nullable=False)
    titulo_api = db.Column(db.String(255))
    sinopse = db.Column(db.Text)
    poster_curado = db.Column(db.String(255))
    poster_url_api = db.Column(db.String(255))
    data_lancamento_curada = db.Column(db.String(10))
    data_lancamento_api = db.Column(db.String(10))
    avaliacao = db.Column(db.Float)
    generos = db.Column(db.ARRAY(db.String))
    plataformas_curadas = db.Column(db.ARRAY(db.String))
    desenvolvedores = db.Column(db.ARRAY(db.String))
    publicadoras = db.Column(db.ARRAY(db.String))
    lojas_digitais = db.Column(db.JSON)

    def to_dict(self):
        return {
            "id": self.id,
            "titulo": self.titulo_curado,
            "sinopse": self.sinopse,
            "poster": self.poster_curado,
            "data_lancamento": self.data_lancamento_curada,
            "avaliacao": self.avaliacao,
            "generos": self.generos or [],
            "plataformas": self.plataformas_curadas or [],
            "desenvolvedores": self.desenvolvedores or [],
            "publicadoras": self.publicadoras or [],
            "lojas_digitais": self.lojas_digitais or {},
            "tipo": "jogo"
        }

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(255), nullable=False)
    avatar = db.Column(db.String(255))
    data_criacao = db.Column(db.DateTime, default=db.func.current_timestamp())
    preferencias = db.Column(db.JSON)

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "avatar": self.avatar,
            "data_criacao": self.data_criacao.isoformat(),
            "preferencias": self.preferencias or {},
        }

class Notificacao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False)
    titulo = db.Column(db.String(255), nullable=False)
    mensagem = db.Column(db.Text, nullable=False)
    tipo = db.Column(db.String(50))
    lida = db.Column(db.Boolean, default=False)
    importante = db.Column(db.Boolean, default=False)
    data_criacao = db.Column(db.DateTime, default=db.func.current_timestamp())

    def to_dict(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "titulo": self.titulo,
            "mensagem": self.mensagem,
            "tipo": self.tipo,
            "lida": self.lida,
            "importante": self.importante,
            "data_criacao": self.data_criacao.isoformat(),
        }

# Funções auxiliares
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
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# Rotas da API

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Bem-vindo à API do Orbe Nerd!", "version": "1.0"})

# Rotas de Filmes
@app.route("/api/filmes", methods=["GET"])
def get_filmes():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    filtro = request.args.get('filtro', 'todos')
    genero = request.args.get('genero')
    
    query = Filme.query
    
    if filtro == 'em_cartaz':
        query = query.filter(Filme.em_cartaz == True)
    elif filtro == 'em_breve':
        query = query.filter(Filme.em_prevenda == True).order_by(Filme.data_lancamento_curada.asc())
    elif filtro == 'populares':
        query = query.order_by(Filme.avaliacao.desc())
    
    if genero:
        query = query.filter(Filme.generos.contains([genero]))
    
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

# Rotas de Séries
@app.route("/api/series", methods=["GET"])
def get_series():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    genero = request.args.get('genero')
    
    query = Serie.query
    
    if genero:
        query = query.filter(Serie.generos.contains([genero]))
    
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
    genero = request.args.get('genero')
    
    query = Anime.query
    
    if genero:
        query = query.filter(Anime.generos.contains([genero]))
    
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
    genero = request.args.get('genero')
    
    query = Jogo.query
    
    if genero:
        query = query.filter(Jogo.generos.contains([genero]))
    
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
    tipo = request.args.get('type', 'all')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400
    
    results = []
    
    if tipo in ['all', 'filme']:
        filmes = Filme.query.filter(
            Filme.titulo_curado.ilike(f'%{query}%')
        ).limit(per_page if tipo == 'filme' else 5).all()
        results.extend([filme.to_dict() for filme in filmes])
    
    if tipo in ['all', 'serie']:
        series = Serie.query.filter(
            Serie.titulo_curado.ilike(f'%{query}%')
        ).limit(per_page if tipo == 'serie' else 5).all()
        results.extend([serie.to_dict() for serie in series])
    
    if tipo in ['all', 'anime']:
        animes = Anime.query.filter(
            Anime.titulo_curado.ilike(f'%{query}%')
        ).limit(per_page if tipo == 'anime' else 5).all()
        results.extend([anime.to_dict() for anime in animes])
    
    if tipo in ['all', 'jogo']:
        jogos = Jogo.query.filter(
            Jogo.titulo_curado.ilike(f'%{query}%')
        ).limit(per_page if tipo == 'jogo' else 5).all()
        results.extend([jogo.to_dict() for jogo in jogos])
    
    return jsonify({
        "results": results,
        "query": query,
        "type": tipo,
        "total_results": len(results)
    })

# Rota de Conteúdo em Alta
@app.route("/api/trending", methods=["GET"])
def get_trending():
    tipo = request.args.get('type', 'all')
    limit = request.args.get('limit', 10, type=int)
    
    results = []
    
    if tipo in ['all', 'filme']:
        filmes = Filme.query.order_by(Filme.avaliacao.desc()).limit(limit).all()
        results.extend([filme.to_dict() for filme in filmes])
    
    if tipo in ['all', 'serie']:
        series = Serie.query.order_by(Serie.avaliacao.desc()).limit(limit).all()
        results.extend([serie.to_dict() for serie in series])
    
    if tipo in ['all', 'anime']:
        animes = Anime.query.order_by(Anime.avaliacao.desc()).limit(limit).all()
        results.extend([anime.to_dict() for anime in animes])
    
    if tipo in ['all', 'jogo']:
        jogos = Jogo.query.order_by(Jogo.avaliacao.desc()).limit(limit).all()
        results.extend([jogo.to_dict() for jogo in jogos])
    
    return jsonify({
        "results": results,
        "type": tipo
    })

# Rotas de Autenticação
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('nome'):
        return jsonify({"error": "Email, senha e nome são obrigatórios"}), 400
    
    # Verifica se o usuário já existe
    existing_user = Usuario.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"error": "Email já cadastrado"}), 400
    
    # Cria novo usuário
    new_user = Usuario(
        nome=data['nome'],
        email=data['email'],
        senha_hash=hash_password(data['password']),
        preferencias={}
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Gera token
    token = generate_token(new_user.id)
    
    return jsonify({
        "message": "Usuário criado com sucesso",
        "token": token,
        "user": new_user.to_dict()
    }), 201

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email e senha são obrigatórios"}), 400
    
    # Busca usuário
    user = Usuario.query.filter_by(email=data['email']).first()
    
    if not user or user.senha_hash != hash_password(data['password']):
        return jsonify({"error": "Email ou senha inválidos"}), 401
    
    # Gera token
    token = generate_token(user.id)
    
    return jsonify({
        "message": "Login realizado com sucesso",
        "token": token,
        "user": user.to_dict()
    })

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

# Rotas de Notificações
@app.route("/api/notifications", methods=["GET"])
def get_notifications():
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        # Retorna notificações mockadas para usuários não autenticados
        mock_notifications = [
            {
                "id": 1,
                "titulo": "Novo episódio disponível",
                "mensagem": "O episódio 12 de Attack on Titan está disponível!",
                "tipo": "episodio",
                "lida": False,
                "importante": True,
                "data_criacao": datetime.now().isoformat()
            },
            {
                "id": 2,
                "titulo": "Filme em cartaz",
                "mensagem": "Dune: Part Two agora está em cartaz nos cinemas!",
                "tipo": "lancamento",
                "lida": False,
                "importante": False,
                "data_criacao": (datetime.now() - timedelta(hours=2)).isoformat()
            }
        ]
        return jsonify(mock_notifications)
    
    token = auth_header.split(' ')[1]
    user_id = verify_token(token)
    
    if not user_id:
        return jsonify({"error": "Token inválido"}), 401
    
    notifications = Notificacao.query.filter_by(usuario_id=user_id).order_by(
        Notificacao.data_criacao.desc()
    ).all()
    
    return jsonify([notif.to_dict() for notif in notifications])

if __name__ == "__main__":
    with app.app_context():
        db.create_all() # Cria as tabelas se não existirem
    app.run(debug=True, host='0.0.0.0', port=5000)


