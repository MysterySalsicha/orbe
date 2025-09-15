import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("user")
DB_PASSWORD = os.getenv("password")
DB_HOST = os.getenv("host")
DB_PORT = os.getenv("port")
DB_NAME = os.getenv("dbname")

print(f"DB_USER: {DB_USER}")
print(f"DB_PASSWORD: {DB_PASSWORD}")
print(f"DB_HOST: {DB_HOST}")
print(f"DB_PORT: {DB_PORT}")
print(f"DB_NAME: {DB_NAME}")

def initialize_db():
    conn = psycopg2.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME
    )
    cur = conn.cursor()

    # Drop tables if they exist (for clean slate)
    cur.execute("DROP TABLE IF EXISTS notificacao CASCADE;")
    cur.execute("DROP TABLE IF EXISTS usuario CASCADE;")
    cur.execute("DROP TABLE IF EXISTS jogo CASCADE;")
    cur.execute("DROP TABLE IF EXISTS anime CASCADE;")
    cur.execute("DROP TABLE IF EXISTS serie CASCADE;")
    cur.execute("DROP TABLE IF EXISTS filme CASCADE;")

    # Create tables
    cur.execute("""
        CREATE TABLE filme (
            id SERIAL PRIMARY KEY,
            tmdb_id INTEGER UNIQUE,
            titulo_curado VARCHAR(255) NOT NULL,
            titulo_api VARCHAR(255),
            sinopse TEXT,
            poster_curado VARCHAR(255),
            poster_url_api VARCHAR(255),
            data_lancamento_curada VARCHAR(10),
            data_lancamento_api VARCHAR(10),
            avaliacao FLOAT,
            generos VARCHAR[],
            plataformas_curadas VARCHAR[],
            em_cartaz BOOLEAN DEFAULT FALSE,
            em_prevenda BOOLEAN DEFAULT FALSE,
            duracao VARCHAR(50),
            direcao VARCHAR(255),
            roteiro VARCHAR(255)
        );
    """)

    cur.execute("""
        CREATE TABLE serie (
            id SERIAL PRIMARY KEY,
            tmdb_id INTEGER UNIQUE,
            titulo_curado VARCHAR(255) NOT NULL,
            titulo_api VARCHAR(255),
            sinopse TEXT,
            poster_curado VARCHAR(255),
            poster_url_api VARCHAR(255),
            data_lancamento_curada VARCHAR(10),
            data_lancamento_api VARCHAR(10),
            avaliacao FLOAT,
            generos VARCHAR[],
            plataformas_curadas VARCHAR[],
            numero_temporadas INTEGER,
            numero_episodios INTEGER,
            criadores VARCHAR[],
            status VARCHAR(50)
        );
    """)

    cur.execute("""
        CREATE TABLE anime (
            id SERIAL PRIMARY KEY,
            mal_id INTEGER UNIQUE,
            titulo_curado VARCHAR(255) NOT NULL,
            titulo_api VARCHAR(255),
            sinopse TEXT,
            poster_curado VARCHAR(255),
            poster_url_api VARCHAR(255),
            data_lancamento_curada VARCHAR(10),
            data_lancamento_api VARCHAR(10),
            avaliacao FLOAT,
            generos VARCHAR[],
            plataformas_curadas VARCHAR[],
            fonte VARCHAR(100),
            estudio VARCHAR(255),
            status_dublagem VARCHAR(50),
            numero_episodios INTEGER,
            proximo_episodio VARCHAR(10),
            mal_link VARCHAR(255),
            trailer_url VARCHAR(255),
            tags VARCHAR[],
            staff JSON,
            personagens JSON
        );
    """)

    cur.execute("""
        CREATE TABLE jogo (
            id SERIAL PRIMARY KEY,
            igdb_id INTEGER UNIQUE,
            titulo_curado VARCHAR(255) NOT NULL,
            titulo_api VARCHAR(255),
            sinopse TEXT,
            poster_curado VARCHAR(255),
            poster_url_api VARCHAR(255),
            data_lancamento_curada VARCHAR(10),
            data_lancamento_api VARCHAR(10),
            avaliacao FLOAT,
            generos VARCHAR[],
            plataformas_curadas VARCHAR[],
            desenvolvedores VARCHAR[],
            publicadoras VARCHAR[],
            lojas_digitais JSON
        );
    """)

    cur.execute("""
        CREATE TABLE usuario (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(120) UNIQUE NOT NULL,
            senha_hash VARCHAR(255) NOT NULL,
            avatar VARCHAR(255),
            data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            preferencias JSON
        );
    """)

    cur.execute("""
        CREATE TABLE notificacao (
            id SERIAL PRIMARY KEY,
            usuario_id INTEGER NOT NULL REFERENCES usuario(id),
            titulo VARCHAR(255) NOT NULL,
            mensagem TEXT NOT NULL,
            tipo VARCHAR(50),
            lida BOOLEAN DEFAULT FALSE,
            importante BOOLEAN DEFAULT FALSE,
            data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    conn.commit()
    cur.close()
    print("Banco de dados inicializado e tabelas criadas.")

    if conn:
        conn.close()

if __name__ == "__main__":
    initialize_db()