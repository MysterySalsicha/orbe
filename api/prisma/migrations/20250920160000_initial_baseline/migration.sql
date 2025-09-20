-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."Anime" (
    "id" SERIAL NOT NULL,
    "titulo_curado" VARCHAR(255) NOT NULL,
    "titulo_api" VARCHAR(255),
    "sinopse" TEXT,
    "poster_curado" VARCHAR(255),
    "poster_url_api" VARCHAR(255),
    "data_lancamento_curada" VARCHAR(10),
    "data_lancamento_api" VARCHAR(10),
    "avaliacao" DOUBLE PRECISION,
    "generos" TEXT[],
    "plataformas_curadas" TEXT[],
    "numero_episodios" INTEGER,
    "fonte" VARCHAR(100),
    "estudio" VARCHAR(255),
    "status_dublagem" VARCHAR(50),
    "proximo_episodio" VARCHAR(50),

    CONSTRAINT "Anime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Filme" (
    "id" SERIAL NOT NULL,
    "titulo_curado" VARCHAR(255) NOT NULL,
    "titulo_api" VARCHAR(255),
    "sinopse" TEXT,
    "poster_curado" VARCHAR(255),
    "poster_url_api" VARCHAR(255),
    "data_lancamento_curada" VARCHAR(10),
    "data_lancamento_api" VARCHAR(10),
    "avaliacao" DOUBLE PRECISION,
    "generos" TEXT[],
    "plataformas_curadas" TEXT[],
    "em_cartaz" BOOLEAN NOT NULL DEFAULT false,
    "em_prevenda" BOOLEAN NOT NULL DEFAULT false,
    "duracao" VARCHAR(50),
    "direcao" VARCHAR(255),
    "roteiro" VARCHAR(255),

    CONSTRAINT "Filme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Interacao" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "midia_id" INTEGER NOT NULL,
    "tipo_midia" VARCHAR(20) NOT NULL,
    "tipo_interacao" VARCHAR(20) NOT NULL,
    "valor" DOUBLE PRECISION,
    "comentario" TEXT,
    "data_interacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Jogo" (
    "id" SERIAL NOT NULL,
    "titulo_curado" VARCHAR(255) NOT NULL,
    "titulo_api" VARCHAR(255),
    "sinopse" TEXT,
    "poster_curado" VARCHAR(255),
    "poster_url_api" VARCHAR(255),
    "data_lancamento_curada" VARCHAR(10),
    "data_lancamento_api" VARCHAR(10),
    "avaliacao" DOUBLE PRECISION,
    "generos" TEXT[],
    "plataformas_curadas" TEXT[],
    "desenvolvedores" VARCHAR(255),
    "publicadoras" VARCHAR(255),

    CONSTRAINT "Jogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notificacao" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "midia_id" INTEGER,
    "tipo_midia" VARCHAR(20),

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Serie" (
    "id" SERIAL NOT NULL,
    "titulo_curado" VARCHAR(255) NOT NULL,
    "titulo_api" VARCHAR(255),
    "sinopse" TEXT,
    "poster_curado" VARCHAR(255),
    "poster_url_api" VARCHAR(255),
    "data_lancamento_curada" VARCHAR(10),
    "data_lancamento_api" VARCHAR(10),
    "avaliacao" DOUBLE PRECISION,
    "generos" TEXT[],
    "plataformas_curadas" TEXT[],
    "numero_temporadas" INTEGER,
    "numero_episodios" INTEGER,
    "criadores" VARCHAR(255),

    CONSTRAINT "Serie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar_url" VARCHAR(255),
    "bio" TEXT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email" ASC);

-- AddForeignKey
ALTER TABLE "public"."Interacao" ADD CONSTRAINT "Interacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notificacao" ADD CONSTRAINT "Notificacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

