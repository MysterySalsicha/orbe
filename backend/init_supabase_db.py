import os
import psycopg2
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# Obtém a URL de conexão direta do Supabase
database_url = os.getenv("DIRECT_URL")

def init_db():
    """Inicializa o banco de dados no Supabase"""
    try:
        # Conecta ao banco de dados
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        print("Conectado ao banco de dados Supabase com sucesso!")

        # Cria as tabelas se não existirem
        create_tables(cursor)

        # Commit das alterações
        conn.commit()
        print("Tabelas criadas com sucesso!")

    except Exception as e:
        print(f"Erro ao inicializar o banco de dados: {e}")
    finally:
        if conn:
            cursor.close()
            conn.close()
            print("Conexão com o banco de dados fechada.")

def create_tables(cursor):
    """Cria as tabelas no banco de dados"""
    # Apagar tabelas se existirem (para garantir um estado limpo)
    cursor.execute("DROP TABLE IF EXISTS interacao CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS notificacao CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS usuario CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS jogo CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS anime CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS serie CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS filme CASCADE;")

    # Tabela de Filmes
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS filme (
        id SERIAL PRIMARY KEY,
        titulo_curado VARCHAR(255) NOT NULL,
        titulo_api VARCHAR(255),
        sinopse TEXT,
        poster_curado VARCHAR(255),
        poster_url_api VARCHAR(255),
        data_lancamento_curada VARCHAR(10),
        data_lancamento_api VARCHAR(10),
        avaliacao REAL,
        generos TEXT[],
        plataformas_curadas TEXT[],
        em_cartaz BOOLEAN DEFAULT FALSE,
        em_prevenda BOOLEAN DEFAULT FALSE,
        duracao VARCHAR(50),
        direcao VARCHAR(255),
        roteiro VARCHAR(255)
    );
    """)

    # Tabela de Séries
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS serie (
        id SERIAL PRIMARY KEY,
        titulo_curado VARCHAR(255) NOT NULL,
        titulo_api VARCHAR(255),
        sinopse TEXT,
        poster_curado VARCHAR(255),
        poster_url_api VARCHAR(255),
        data_lancamento_curada VARCHAR(10),
        data_lancamento_api VARCHAR(10),
        avaliacao REAL,
        generos TEXT[],
        plataformas_curadas TEXT[],
        numero_temporadas INTEGER,
        numero_episodios INTEGER,
        criadores TEXT[]
    );
    """)

    # Tabela de Animes
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS anime (
        id SERIAL PRIMARY KEY,
        titulo_curado VARCHAR(255) NOT NULL,
        titulo_api VARCHAR(255),
        sinopse TEXT,
        poster_curado VARCHAR(255),
        poster_url_api VARCHAR(255),
        data_lancamento_curada VARCHAR(10),
        data_lancamento_api VARCHAR(10),
        avaliacao REAL,
        generos TEXT[],
        plataformas_curadas TEXT[],
        fonte VARCHAR(100),
        estudio VARCHAR(255),
        status_dublagem VARCHAR(50),
        numero_episodios INTEGER,
        proximo_episodio VARCHAR(50),
        mal_link VARCHAR(255),
        trailer_url VARCHAR(255),
        tags TEXT[],
        staff JSONB,
        personagens JSONB
    );
    """)

    # Tabela de Jogos
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS jogo (
        id SERIAL PRIMARY KEY,
        titulo_curado VARCHAR(255) NOT NULL,
        titulo_api VARCHAR(255),
        sinopse TEXT,
        poster_curado VARCHAR(255),
        poster_url_api VARCHAR(255),
        data_lancamento_curada VARCHAR(10),
        data_lancamento_api VARCHAR(10),
        avaliacao REAL,
        generos TEXT[],
        plataformas_curadas TEXT[],
        desenvolvedores TEXT[],
        publicadoras TEXT[],
        lojas_digitais JSONB
    );
    """)

    # Tabela de Usuários
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS usuario (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        avatar VARCHAR(255),
        preferencias JSONB
    );
    """)

    # Tabela de Notificações
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notificacao (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuario(id),
        titulo VARCHAR(255) NOT NULL,
        mensagem TEXT NOT NULL,
        tipo VARCHAR(50) NOT NULL,
        lida BOOLEAN DEFAULT FALSE,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        midia_id INTEGER,
        tipo_midia VARCHAR(20)
    );
    """)

    # Tabela de Interações
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interacao (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuario(id),
        midia_id INTEGER NOT NULL,
        tipo_midia VARCHAR(20) NOT NULL,
        tipo_interacao VARCHAR(20) NOT NULL,
        valor REAL,
        comentario TEXT,
        data_interacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

if __name__ == "__main__":
    init_db()