from .extensions import db
from datetime import datetime

# Modelos do Banco de Dados
class Filme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tmdb_id = db.Column(db.Integer, unique=True)
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
    tmdb_id = db.Column(db.Integer, unique=True)
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
    mal_id = db.Column(db.Integer, unique=True)
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
    # Novos campos para o Super Modal
    mal_link = db.Column(db.String(255))
    trailer_url = db.Column(db.String(255))
    tags = db.Column(db.ARRAY(db.String))
    staff = db.Column(db.JSON)
    personagens = db.Column(db.JSON)

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
            # Adicionando novos campos ao dicionário
            "mal_link": self.mal_link,
            "trailer_url": self.trailer_url,
            "tags": self.tags or [],
            "staff": self.staff or [],
            "personagens": self.personagens or [],
            "tipo": "anime"
        }

class Jogo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    igdb_id = db.Column(db.Integer, unique=True)
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
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
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
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)

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
