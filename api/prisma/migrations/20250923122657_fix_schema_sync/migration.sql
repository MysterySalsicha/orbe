/*
  Warnings:

  - You are about to drop the column `avaliacao` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `criadores` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_api` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_curada` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `estudio` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `fonte` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `generos` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `numero_episodios` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `numero_temporadas` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `plataformas_curadas` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `poster_curado` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `poster_url_api` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `proximo_episodio` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `status_dublagem` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_api` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_curado` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `avaliacao` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_api` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_curada` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `direcao` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `duracao` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `em_cartaz` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `em_prevenda` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `generos` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `plataformas_curadas` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `poster_curado` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `poster_url_api` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `roteiro` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_api` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_curado` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `avaliacao` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_api` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_curada` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `desenvolvedores` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `generos` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `plataformas_curadas` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `poster_curado` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `poster_url_api` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `publicadoras` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_api` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_curado` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `avaliacao` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `criadores` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_api` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_curada` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `generos` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `numero_episodios` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `numero_temporadas` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `plataformas_curadas` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `poster_curado` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `poster_url_api` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_api` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_curado` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the `Interacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notificacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[anilistId]` on the table `Anime` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[malId]` on the table `Anime` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tmdbId]` on the table `Filme` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imdbId]` on the table `Filme` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[igdbId]` on the table `Jogo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tmdbId]` on the table `Serie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `anilistId` to the `Anime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleRomaji` to the `Anime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Anime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Filme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmdbId` to the `Filme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Filme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `igdbId` to the `Jogo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Jogo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Jogo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Serie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmdbId` to the `Serie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Serie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Interacao" DROP CONSTRAINT "Interacao_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Notificacao" DROP CONSTRAINT "Notificacao_usuario_id_fkey";

-- AlterTable
ALTER TABLE "public"."Anime" DROP COLUMN "avaliacao",
DROP COLUMN "criadores",
DROP COLUMN "data_lancamento_api",
DROP COLUMN "data_lancamento_curada",
DROP COLUMN "estudio",
DROP COLUMN "fonte",
DROP COLUMN "generos",
DROP COLUMN "numero_episodios",
DROP COLUMN "numero_temporadas",
DROP COLUMN "plataformas_curadas",
DROP COLUMN "poster_curado",
DROP COLUMN "poster_url_api",
DROP COLUMN "proximo_episodio",
DROP COLUMN "sinopse",
DROP COLUMN "status_dublagem",
DROP COLUMN "titulo_api",
DROP COLUMN "titulo_curado",
ADD COLUMN     "anilistId" INTEGER NOT NULL,
ADD COLUMN     "averageScore" INTEGER,
ADD COLUMN     "bannerImage" TEXT,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "episodes" INTEGER,
ADD COLUMN     "format" TEXT,
ADD COLUMN     "malId" INTEGER,
ADD COLUMN     "meanScore" INTEGER,
ADD COLUMN     "popularity" INTEGER,
ADD COLUMN     "season" TEXT,
ADD COLUMN     "seasonYear" INTEGER,
ADD COLUMN     "siteUrl" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "status" TEXT,
ADD COLUMN     "titleEnglish" TEXT,
ADD COLUMN     "titleNative" TEXT,
ADD COLUMN     "titleRomaji" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Filme" DROP COLUMN "avaliacao",
DROP COLUMN "data_lancamento_api",
DROP COLUMN "data_lancamento_curada",
DROP COLUMN "direcao",
DROP COLUMN "duracao",
DROP COLUMN "em_cartaz",
DROP COLUMN "em_prevenda",
DROP COLUMN "generos",
DROP COLUMN "plataformas_curadas",
DROP COLUMN "poster_curado",
DROP COLUMN "poster_url_api",
DROP COLUMN "roteiro",
DROP COLUMN "sinopse",
DROP COLUMN "titulo_api",
DROP COLUMN "titulo_curado",
ADD COLUMN     "backdropPath" TEXT,
ADD COLUMN     "budget" BIGINT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "homepage" TEXT,
ADD COLUMN     "imdbId" TEXT,
ADD COLUMN     "originalTitle" TEXT,
ADD COLUMN     "overview" TEXT,
ADD COLUMN     "popularity" DOUBLE PRECISION,
ADD COLUMN     "posterPath" TEXT,
ADD COLUMN     "releaseDate" TIMESTAMP(3),
ADD COLUMN     "revenue" BIGINT,
ADD COLUMN     "runtime" INTEGER,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "tmdbId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "voteAverage" DOUBLE PRECISION,
ADD COLUMN     "voteCount" INTEGER;

-- AlterTable
ALTER TABLE "public"."Jogo" DROP COLUMN "avaliacao",
DROP COLUMN "data_lancamento_api",
DROP COLUMN "data_lancamento_curada",
DROP COLUMN "desenvolvedores",
DROP COLUMN "generos",
DROP COLUMN "plataformas_curadas",
DROP COLUMN "poster_curado",
DROP COLUMN "poster_url_api",
DROP COLUMN "publicadoras",
DROP COLUMN "sinopse",
DROP COLUMN "titulo_api",
DROP COLUMN "titulo_curado",
ADD COLUMN     "aggregatedRating" DOUBLE PRECISION,
ADD COLUMN     "aggregatedRatingCount" INTEGER,
ADD COLUMN     "cover" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstReleaseDate" TIMESTAMP(3),
ADD COLUMN     "igdbId" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "ratingCount" INTEGER,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "storyline" TEXT,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "public"."Serie" DROP COLUMN "avaliacao",
DROP COLUMN "criadores",
DROP COLUMN "data_lancamento_api",
DROP COLUMN "data_lancamento_curada",
DROP COLUMN "generos",
DROP COLUMN "numero_episodios",
DROP COLUMN "numero_temporadas",
DROP COLUMN "plataformas_curadas",
DROP COLUMN "poster_curado",
DROP COLUMN "poster_url_api",
DROP COLUMN "sinopse",
DROP COLUMN "titulo_api",
DROP COLUMN "titulo_curado",
ADD COLUMN     "backdropPath" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstAirDate" TIMESTAMP(3),
ADD COLUMN     "homepage" TEXT,
ADD COLUMN     "lastAirDate" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "numberOfEpisodes" INTEGER,
ADD COLUMN     "numberOfSeasons" INTEGER,
ADD COLUMN     "originalName" TEXT,
ADD COLUMN     "overview" TEXT,
ADD COLUMN     "popularity" DOUBLE PRECISION,
ADD COLUMN     "posterPath" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "tmdbId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "voteAverage" DOUBLE PRECISION,
ADD COLUMN     "voteCount" INTEGER;

-- DropTable
DROP TABLE "public"."Interacao";

-- DropTable
DROP TABLE "public"."Notificacao";

-- DropTable
DROP TABLE "public"."Usuario";

-- CreateTable
CREATE TABLE "public"."Video" (
    "id" SERIAL NOT NULL,
    "tmdbId" TEXT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "official" BOOLEAN NOT NULL,
    "filmeId" INTEGER,
    "serieId" INTEGER,
    "jogoId" INTEGER,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Genero" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Country" (
    "id" SERIAL NOT NULL,
    "iso" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Language" (
    "id" SERIAL NOT NULL,
    "iso" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pessoa" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "profilePath" TEXT,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Network" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "logoPath" TEXT,

    CONSTRAINT "Network_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Temporada" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "airDate" TIMESTAMP(3),
    "episodeCount" INTEGER,
    "name" TEXT NOT NULL,
    "overview" TEXT,
    "posterPath" TEXT,
    "seasonNumber" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,

    CONSTRAINT "Temporada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeGenero" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AnimeGenero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeStudio" (
    "id" SERIAL NOT NULL,
    "anilistId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AnimeStudio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Personagem" (
    "id" SERIAL NOT NULL,
    "anilistId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Personagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Dublador" (
    "id" SERIAL NOT NULL,
    "anilistId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Dublador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MembroStaff" (
    "id" SERIAL NOT NULL,
    "anilistId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "MembroStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeStreamingLink" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "thumbnail" TEXT,
    "animeId" INTEGER NOT NULL,

    CONSTRAINT "AnimeStreamingLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JogoGenero" (
    "id" SERIAL NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "JogoGenero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JogoPlataforma" (
    "id" SERIAL NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "JogoPlataforma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JogoCompany" (
    "id" SERIAL NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "developer" BOOLEAN NOT NULL,
    "publisher" BOOLEAN NOT NULL,

    CONSTRAINT "JogoCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JogoTheme" (
    "id" SERIAL NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "JogoTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JogoPlayerPerspective" (
    "id" SERIAL NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "JogoPlayerPerspective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Screenshot" (
    "id" SERIAL NOT NULL,
    "igdbId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "jogoId" INTEGER NOT NULL,

    CONSTRAINT "Screenshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Artwork" (
    "id" SERIAL NOT NULL,
    "igdbId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "jogoId" INTEGER NOT NULL,

    CONSTRAINT "Artwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Website" (
    "id" SERIAL NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "category" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "jogoId" INTEGER NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FilmeGenero" (
    "filmeId" INTEGER NOT NULL,
    "generoId" INTEGER NOT NULL,

    CONSTRAINT "FilmeGenero_pkey" PRIMARY KEY ("filmeId","generoId")
);

-- CreateTable
CREATE TABLE "public"."FilmeCompany" (
    "filmeId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "FilmeCompany_pkey" PRIMARY KEY ("filmeId","companyId")
);

-- CreateTable
CREATE TABLE "public"."FilmeCountry" (
    "filmeId" INTEGER NOT NULL,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "FilmeCountry_pkey" PRIMARY KEY ("filmeId","countryId")
);

-- CreateTable
CREATE TABLE "public"."FilmeLanguage" (
    "filmeId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,

    CONSTRAINT "FilmeLanguage_pkey" PRIMARY KEY ("filmeId","languageId")
);

-- CreateTable
CREATE TABLE "public"."FilmeCast" (
    "filmeId" INTEGER NOT NULL,
    "pessoaId" INTEGER NOT NULL,
    "character" TEXT,
    "order" INTEGER,

    CONSTRAINT "FilmeCast_pkey" PRIMARY KEY ("filmeId","pessoaId")
);

-- CreateTable
CREATE TABLE "public"."FilmeCrew" (
    "filmeId" INTEGER NOT NULL,
    "pessoaId" INTEGER NOT NULL,
    "job" TEXT,
    "department" TEXT,

    CONSTRAINT "FilmeCrew_pkey" PRIMARY KEY ("filmeId","pessoaId")
);

-- CreateTable
CREATE TABLE "public"."SerieGenero" (
    "serieId" INTEGER NOT NULL,
    "generoId" INTEGER NOT NULL,

    CONSTRAINT "SerieGenero_pkey" PRIMARY KEY ("serieId","generoId")
);

-- CreateTable
CREATE TABLE "public"."SerieNetwork" (
    "serieId" INTEGER NOT NULL,
    "networkId" INTEGER NOT NULL,

    CONSTRAINT "SerieNetwork_pkey" PRIMARY KEY ("serieId","networkId")
);

-- CreateTable
CREATE TABLE "public"."SerieCreator" (
    "serieId" INTEGER NOT NULL,
    "pessoaId" INTEGER NOT NULL,

    CONSTRAINT "SerieCreator_pkey" PRIMARY KEY ("serieId","pessoaId")
);

-- CreateTable
CREATE TABLE "public"."SerieCast" (
    "serieId" INTEGER NOT NULL,
    "pessoaId" INTEGER NOT NULL,
    "character" TEXT,
    "order" INTEGER,

    CONSTRAINT "SerieCast_pkey" PRIMARY KEY ("serieId","pessoaId")
);

-- CreateTable
CREATE TABLE "public"."SerieCrew" (
    "serieId" INTEGER NOT NULL,
    "pessoaId" INTEGER NOT NULL,
    "job" TEXT,
    "department" TEXT,

    CONSTRAINT "SerieCrew_pkey" PRIMARY KEY ("serieId","pessoaId")
);

-- CreateTable
CREATE TABLE "public"."AnimeOnGenero" (
    "animeId" INTEGER NOT NULL,
    "generoId" INTEGER NOT NULL,

    CONSTRAINT "AnimeOnGenero_pkey" PRIMARY KEY ("animeId","generoId")
);

-- CreateTable
CREATE TABLE "public"."AnimeOnStudio" (
    "animeId" INTEGER NOT NULL,
    "studioId" INTEGER NOT NULL,

    CONSTRAINT "AnimeOnStudio_pkey" PRIMARY KEY ("animeId","studioId")
);

-- CreateTable
CREATE TABLE "public"."AnimeCharacter" (
    "animeId" INTEGER NOT NULL,
    "characterId" INTEGER NOT NULL,
    "dubladorId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "AnimeCharacter_pkey" PRIMARY KEY ("animeId","characterId","dubladorId")
);

-- CreateTable
CREATE TABLE "public"."AnimeStaff" (
    "animeId" INTEGER NOT NULL,
    "staffId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "AnimeStaff_pkey" PRIMARY KEY ("animeId","staffId","role")
);

-- CreateTable
CREATE TABLE "public"."JogoOnGenero" (
    "jogoId" INTEGER NOT NULL,
    "generoId" INTEGER NOT NULL,

    CONSTRAINT "JogoOnGenero_pkey" PRIMARY KEY ("jogoId","generoId")
);

-- CreateTable
CREATE TABLE "public"."JogoOnPlataforma" (
    "jogoId" INTEGER NOT NULL,
    "plataformaId" INTEGER NOT NULL,

    CONSTRAINT "JogoOnPlataforma_pkey" PRIMARY KEY ("jogoId","plataformaId")
);

-- CreateTable
CREATE TABLE "public"."JogoOnCompany" (
    "jogoId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "JogoOnCompany_pkey" PRIMARY KEY ("jogoId","companyId")
);

-- CreateTable
CREATE TABLE "public"."JogoOnTheme" (
    "jogoId" INTEGER NOT NULL,
    "themeId" INTEGER NOT NULL,

    CONSTRAINT "JogoOnTheme_pkey" PRIMARY KEY ("jogoId","themeId")
);

-- CreateTable
CREATE TABLE "public"."JogoOnPlayerPerspective" (
    "jogoId" INTEGER NOT NULL,
    "perspectiveId" INTEGER NOT NULL,

    CONSTRAINT "JogoOnPlayerPerspective_pkey" PRIMARY KEY ("jogoId","perspectiveId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_tmdbId_key" ON "public"."Video"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Genero_tmdbId_key" ON "public"."Genero"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Genero_name_key" ON "public"."Genero"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_tmdbId_key" ON "public"."Company"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Country_iso_key" ON "public"."Country"("iso");

-- CreateIndex
CREATE UNIQUE INDEX "Language_iso_key" ON "public"."Language"("iso");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_tmdbId_key" ON "public"."Pessoa"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Network_tmdbId_key" ON "public"."Network"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Temporada_tmdbId_key" ON "public"."Temporada"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeGenero_name_key" ON "public"."AnimeGenero"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeStudio_anilistId_key" ON "public"."AnimeStudio"("anilistId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeStudio_name_key" ON "public"."AnimeStudio"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Personagem_anilistId_key" ON "public"."Personagem"("anilistId");

-- CreateIndex
CREATE UNIQUE INDEX "Dublador_anilistId_key" ON "public"."Dublador"("anilistId");

-- CreateIndex
CREATE UNIQUE INDEX "MembroStaff_anilistId_key" ON "public"."MembroStaff"("anilistId");

-- CreateIndex
CREATE UNIQUE INDEX "JogoGenero_igdbId_key" ON "public"."JogoGenero"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "JogoGenero_name_key" ON "public"."JogoGenero"("name");

-- CreateIndex
CREATE UNIQUE INDEX "JogoPlataforma_igdbId_key" ON "public"."JogoPlataforma"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "JogoPlataforma_name_key" ON "public"."JogoPlataforma"("name");

-- CreateIndex
CREATE UNIQUE INDEX "JogoCompany_igdbId_key" ON "public"."JogoCompany"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "JogoTheme_igdbId_key" ON "public"."JogoTheme"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "JogoTheme_name_key" ON "public"."JogoTheme"("name");

-- CreateIndex
CREATE UNIQUE INDEX "JogoPlayerPerspective_igdbId_key" ON "public"."JogoPlayerPerspective"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "JogoPlayerPerspective_name_key" ON "public"."JogoPlayerPerspective"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Screenshot_igdbId_key" ON "public"."Screenshot"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Artwork_igdbId_key" ON "public"."Artwork"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Anime_anilistId_key" ON "public"."Anime"("anilistId");

-- CreateIndex
CREATE UNIQUE INDEX "Anime_malId_key" ON "public"."Anime"("malId");

-- CreateIndex
CREATE UNIQUE INDEX "Filme_tmdbId_key" ON "public"."Filme"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Filme_imdbId_key" ON "public"."Filme"("imdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Jogo_igdbId_key" ON "public"."Jogo"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Serie_tmdbId_key" ON "public"."Serie"("tmdbId");

-- AddForeignKey
ALTER TABLE "public"."Video" ADD CONSTRAINT "Video_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "public"."Filme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Video" ADD CONSTRAINT "Video_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "public"."Serie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Video" ADD CONSTRAINT "Video_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "public"."Jogo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Temporada" ADD CONSTRAINT "Temporada_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "public"."Serie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeStreamingLink" ADD CONSTRAINT "AnimeStreamingLink_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Screenshot" ADD CONSTRAINT "Screenshot_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "public"."Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Artwork" ADD CONSTRAINT "Artwork_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "public"."Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Website" ADD CONSTRAINT "Website_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "public"."Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FilmeGenero" ADD CONSTRAINT "FilmeGenero_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "public"."Filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FilmeGenero" ADD CONSTRAINT "FilmeGenero_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "public"."Genero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FilmeCompany" ADD CONSTRAINT "FilmeCompany_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "public"."Filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FilmeCompany" ADD CONSTRAINT "FilmeCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FilmeCountry" ADD CONSTRAINT "FilmeCountry_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "public"."Filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FilmeCountry" ADD CONSTRAINT "FilmeCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FilmeLanguage" ADD CONSTRAINT "FilmeLanguage_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "public"."Filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FilmeLanguage" ADD CONSTRAINT "FilmeLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FilmeCast" ADD CONSTRAINT "FilmeCast_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "public"."Filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FilmeCast" ADD CONSTRAINT "FilmeCast_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FilmeCrew" ADD CONSTRAINT "FilmeCrew_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "public"."Filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FilmeCrew" ADD CONSTRAINT "FilmeCrew_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SerieGenero" ADD CONSTRAINT "SerieGenero_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "public"."Serie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SerieGenero" ADD CONSTRAINT "SerieGenero_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "public"."Genero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SerieNetwork" ADD CONSTRAINT "SerieNetwork_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "public"."Serie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SerieNetwork" ADD CONSTRAINT "SerieNetwork_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "public"."Network"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SerieCreator" ADD CONSTRAINT "SerieCreator_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "public"."Serie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SerieCreator" ADD CONSTRAINT "SerieCreator_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SerieCast" ADD CONSTRAINT "SerieCast_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "public"."Serie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SerieCast" ADD CONSTRAINT "SerieCast_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SerieCrew" ADD CONSTRAINT "SerieCrew_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "public"."Serie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SerieCrew" ADD CONSTRAINT "SerieCrew_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeOnGenero" ADD CONSTRAINT "AnimeOnGenero_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeOnGenero" ADD CONSTRAINT "AnimeOnGenero_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "public"."AnimeGenero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeOnStudio" ADD CONSTRAINT "AnimeOnStudio_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeOnStudio" ADD CONSTRAINT "AnimeOnStudio_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."AnimeStudio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeCharacter" ADD CONSTRAINT "AnimeCharacter_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeCharacter" ADD CONSTRAINT "AnimeCharacter_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."Personagem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeCharacter" ADD CONSTRAINT "AnimeCharacter_dubladorId_fkey" FOREIGN KEY ("dubladorId") REFERENCES "public"."Dublador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeStaff" ADD CONSTRAINT "AnimeStaff_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeStaff" ADD CONSTRAINT "AnimeStaff_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."MembroStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JogoOnGenero" ADD CONSTRAINT "JogoOnGenero_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "public"."Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JogoOnGenero" ADD CONSTRAINT "JogoOnGenero_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "public"."JogoGenero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JogoOnPlataforma" ADD CONSTRAINT "JogoOnPlataforma_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "public"."Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JogoOnPlataforma" ADD CONSTRAINT "JogoOnPlataforma_plataformaId_fkey" FOREIGN KEY ("plataformaId") REFERENCES "public"."JogoPlataforma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JogoOnCompany" ADD CONSTRAINT "JogoOnCompany_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "public"."Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JogoOnCompany" ADD CONSTRAINT "JogoOnCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."JogoCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JogoOnTheme" ADD CONSTRAINT "JogoOnTheme_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "public"."Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JogoOnTheme" ADD CONSTRAINT "JogoOnTheme_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "public"."JogoTheme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JogoOnPlayerPerspective" ADD CONSTRAINT "JogoOnPlayerPerspective_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "public"."Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JogoOnPlayerPerspective" ADD CONSTRAINT "JogoOnPlayerPerspective_perspectiveId_fkey" FOREIGN KEY ("perspectiveId") REFERENCES "public"."JogoPlayerPerspective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
