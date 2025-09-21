/*
  Warnings:

  - You are about to drop the column `avaliacao` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `criadores` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `generos` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `numero_episodios` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `numero_temporadas` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `proximo_episodio` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `status_dublagem` on the `Anime` table. All the data in the column will be lost.
  - The `data_lancamento_api` column on the `Anime` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `data_lancamento_curada` column on the `Anime` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `avaliacao` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `direcao` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `em_cartaz` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `generos` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `roteiro` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse` on the `Filme` table. All the data in the column will be lost.
  - The `data_lancamento_curada` column on the `Filme` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `data_lancamento_api` column on the `Filme` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `duracao` column on the `Filme` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `avaliacao` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `generos` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse` on the `Jogo` table. All the data in the column will be lost.
  - The `data_lancamento_curada` column on the `Jogo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `data_lancamento_api` column on the `Jogo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `desenvolvedores` column on the `Jogo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `publicadoras` column on the `Jogo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `lida` on the `Notificacao` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Notificacao` table. All the data in the column will be lost.
  - You are about to drop the column `avaliacao` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `generos` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse` on the `Serie` table. All the data in the column will be lost.
  - The `data_lancamento_curada` column on the `Serie` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `data_lancamento_api` column on the `Serie` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `criadores` column on the `Serie` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Interacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tipo_notificacao` to the `Notificacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Interacao" DROP CONSTRAINT "Interacao_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Notificacao" DROP CONSTRAINT "Notificacao_usuario_id_fkey";

-- AlterTable
ALTER TABLE "public"."Anime" DROP COLUMN "avaliacao",
DROP COLUMN "criadores",
DROP COLUMN "generos",
DROP COLUMN "numero_episodios",
DROP COLUMN "numero_temporadas",
DROP COLUMN "proximo_episodio",
DROP COLUMN "sinopse",
DROP COLUMN "status_dublagem",
ADD COLUMN     "avaliacao_api" DOUBLE PRECISION,
ADD COLUMN     "dublagem_info" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "generos_api" JSONB,
ADD COLUMN     "generos_curados" JSONB,
ADD COLUMN     "personagens" JSONB,
ADD COLUMN     "plataformas_api" TEXT[],
ADD COLUMN     "premiacoes" JSONB,
ADD COLUMN     "sinopse_api" TEXT,
ADD COLUMN     "sinopse_curada" TEXT,
ADD COLUMN     "staff" JSONB,
ADD COLUMN     "trailer_url_api" VARCHAR(255),
ADD COLUMN     "trailer_url_curado" VARCHAR(255),
DROP COLUMN "data_lancamento_api",
ADD COLUMN     "data_lancamento_api" DATE,
DROP COLUMN "data_lancamento_curada",
ADD COLUMN     "data_lancamento_curada" DATE,
ALTER COLUMN "estudio" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "fonte" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "plataformas_curadas" DROP DEFAULT,
ALTER COLUMN "titulo_curado" DROP DEFAULT,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Anime_id_seq";

-- AlterTable
ALTER TABLE "public"."Filme" DROP COLUMN "avaliacao",
DROP COLUMN "direcao",
DROP COLUMN "em_cartaz",
DROP COLUMN "generos",
DROP COLUMN "roteiro",
DROP COLUMN "sinopse",
ADD COLUMN     "avaliacao_api" DOUBLE PRECISION,
ADD COLUMN     "diretor" VARCHAR(255),
ADD COLUMN     "elenco" JSONB,
ADD COLUMN     "escritor" VARCHAR(255),
ADD COLUMN     "generos_api" JSONB,
ADD COLUMN     "generos_curados" JSONB,
ADD COLUMN     "ingresso_link" VARCHAR(255),
ADD COLUMN     "plataformas_api" TEXT[],
ADD COLUMN     "premiacoes" JSONB,
ADD COLUMN     "sinopse_api" TEXT,
ADD COLUMN     "sinopse_curada" TEXT,
ADD COLUMN     "trailer_url_api" VARCHAR(255),
ADD COLUMN     "trailer_url_curado" VARCHAR(255),
ADD COLUMN     "ultima_verificacao_ingresso" TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
DROP COLUMN "data_lancamento_curada",
ADD COLUMN     "data_lancamento_curada" DATE,
DROP COLUMN "data_lancamento_api",
ADD COLUMN     "data_lancamento_api" DATE,
DROP COLUMN "duracao",
ADD COLUMN     "duracao" INTEGER;
DROP SEQUENCE "Filme_id_seq";

-- AlterTable
ALTER TABLE "public"."Jogo" DROP COLUMN "avaliacao",
DROP COLUMN "generos",
DROP COLUMN "sinopse",
ADD COLUMN     "avaliacao_api" DOUBLE PRECISION,
ADD COLUMN     "evento_anuncio_id" INTEGER,
ADD COLUMN     "generos_api" JSONB,
ADD COLUMN     "generos_curados" JSONB,
ADD COLUMN     "plataformas_api" TEXT[],
ADD COLUMN     "premiacoes" JSONB,
ADD COLUMN     "sinopse_api" TEXT,
ADD COLUMN     "sinopse_curada" TEXT,
ADD COLUMN     "trailer_url_api" VARCHAR(255),
ADD COLUMN     "trailer_url_curado" VARCHAR(255),
ALTER COLUMN "id" DROP DEFAULT,
DROP COLUMN "data_lancamento_curada",
ADD COLUMN     "data_lancamento_curada" DATE,
DROP COLUMN "data_lancamento_api",
ADD COLUMN     "data_lancamento_api" DATE,
DROP COLUMN "desenvolvedores",
ADD COLUMN     "desenvolvedores" TEXT[],
DROP COLUMN "publicadoras",
ADD COLUMN     "publicadoras" TEXT[];
DROP SEQUENCE "Jogo_id_seq";

-- AlterTable
ALTER TABLE "public"."Notificacao" DROP COLUMN "lida",
DROP COLUMN "tipo",
ADD COLUMN     "foi_visualizada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tipo_notificacao" VARCHAR(50) NOT NULL,
ALTER COLUMN "usuario_id" DROP NOT NULL,
ALTER COLUMN "tipo_midia" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "public"."Serie" DROP COLUMN "avaliacao",
DROP COLUMN "generos",
DROP COLUMN "sinopse",
ADD COLUMN     "avaliacao_api" DOUBLE PRECISION,
ADD COLUMN     "elenco" JSONB,
ADD COLUMN     "generos_api" JSONB,
ADD COLUMN     "generos_curados" JSONB,
ADD COLUMN     "plataformas_api" TEXT[],
ADD COLUMN     "premiacoes" JSONB,
ADD COLUMN     "sinopse_api" TEXT,
ADD COLUMN     "sinopse_curada" TEXT,
ADD COLUMN     "trailer_url_api" VARCHAR(255),
ADD COLUMN     "trailer_url_curado" VARCHAR(255),
ALTER COLUMN "id" DROP DEFAULT,
DROP COLUMN "data_lancamento_curada",
ADD COLUMN     "data_lancamento_curada" DATE,
DROP COLUMN "data_lancamento_api",
ADD COLUMN     "data_lancamento_api" DATE,
DROP COLUMN "criadores",
ADD COLUMN     "criadores" TEXT[];
DROP SEQUENCE "Serie_id_seq";

-- DropTable
DROP TABLE "public"."Interacao";

-- DropTable
DROP TABLE "public"."Usuario";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "hashed_password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'user',
    "quer_avaliar" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."preferencias_usuario_midia" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "midia_id" INTEGER NOT NULL,
    "tipo_midia" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "avaliacao" VARCHAR(50),
    "data_interacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "preferencias_usuario_midia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventoAnuncio" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "data_evento" DATE NOT NULL,

    CONSTRAINT "EventoAnuncio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Jogo" ADD CONSTRAINT "Jogo_evento_anuncio_id_fkey" FOREIGN KEY ("evento_anuncio_id") REFERENCES "public"."EventoAnuncio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."preferencias_usuario_midia" ADD CONSTRAINT "preferencias_usuario_midia_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
