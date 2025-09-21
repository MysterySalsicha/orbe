/*
  Warnings:

  - You are about to drop the column `data_lancamento_api` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_curada` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `dublagem_info` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `estudio` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `fonte` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `generos_api` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `generos_curados` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `personagens` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `plataformas_api` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `plataformas_curadas` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `poster_curado` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `poster_url_api` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `premiacoes` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse_api` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse_curada` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `staff` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_api` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_curado` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `trailer_url_api` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `trailer_url_curado` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `data_evento` on the `EventoAnuncio` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `EventoAnuncio` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_api` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_curada` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `diretor` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `duracao` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `elenco` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `escritor` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `generos_api` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `generos_curados` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `plataformas_api` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `plataformas_curadas` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `poster_curado` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `poster_url_api` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `premiacoes` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse_api` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse_curada` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_api` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_curado` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `trailer_url_api` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `trailer_url_curado` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `ultima_verificacao_ingresso` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_api` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_curada` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `desenvolvedores` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `evento_anuncio_id` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `generos_api` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `generos_curados` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `plataformas_api` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `plataformas_curadas` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `poster_curado` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `poster_url_api` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `premiacoes` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `publicadoras` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse_api` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse_curada` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_api` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_curado` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `trailer_url_api` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `trailer_url_curado` on the `Jogo` table. All the data in the column will be lost.
  - You are about to drop the column `criadores` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_api` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_curada` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `elenco` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `generos_api` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `generos_curados` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `numero_episodios` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `numero_temporadas` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `plataformas_api` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `plataformas_curadas` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `poster_curado` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `poster_url_api` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `premiacoes` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse_api` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse_curada` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_api` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_curado` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `trailer_url_api` on the `Serie` table. All the data in the column will be lost.
  - You are about to drop the column `trailer_url_curado` on the `Serie` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."MediaFormat" AS ENUM ('TV', 'TV_SHORT', 'MOVIE', 'SPECIAL', 'OVA', 'ONA', 'MUSIC');

-- CreateEnum
CREATE TYPE "public"."MediaStatus" AS ENUM ('FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED', 'HIATUS');

-- CreateEnum
CREATE TYPE "public"."MediaSeason" AS ENUM ('WINTER', 'SPRING', 'SUMMER', 'FALL');

-- CreateEnum
CREATE TYPE "public"."MediaSource" AS ENUM ('ORIGINAL', 'MANGA', 'LIGHT_NOVEL', 'VISUAL_NOVEL', 'VIDEO_GAME', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."CharacterRole" AS ENUM ('MAIN', 'SUPPORTING', 'BACKGROUND');

-- CreateEnum
CREATE TYPE "public"."GameCategory" AS ENUM ('MAIN_GAME', 'DLC_ADDON', 'EXPANSION', 'BUNDLE', 'STANDALONE_EXPANSION', 'MOD', 'EPISODE', 'SEASON', 'REMAKE', 'REMASTER', 'EXPANDED_GAME', 'PORT', 'FORK');

-- CreateEnum
CREATE TYPE "public"."GameStatus" AS ENUM ('RELEASED', 'ALPHA', 'BETA', 'EARLY_ACCESS', 'OFFLINE', 'CANCELLED', 'RUMORED', 'DELISTED');

-- DropForeignKey
ALTER TABLE "public"."Jogo" DROP CONSTRAINT "Jogo_evento_anuncio_id_fkey";

-- AlterTable
ALTER TABLE "public"."Anime" DROP COLUMN "data_lancamento_api",
DROP COLUMN "data_lancamento_curada",
DROP COLUMN "dublagem_info",
DROP COLUMN "estudio",
DROP COLUMN "fonte",
DROP COLUMN "generos_api",
DROP COLUMN "generos_curados",
DROP COLUMN "personagens",
DROP COLUMN "plataformas_api",
DROP COLUMN "plataformas_curadas",
DROP COLUMN "poster_curado",
DROP COLUMN "poster_url_api",
DROP COLUMN "premiacoes",
DROP COLUMN "sinopse_api",
DROP COLUMN "sinopse_curada",
DROP COLUMN "staff",
DROP COLUMN "titulo_api",
DROP COLUMN "titulo_curado",
DROP COLUMN "trailer_url_api",
DROP COLUMN "trailer_url_curado",
ADD COLUMN     "bannerImage_api" TEXT,
ADD COLUMN     "bannerImage_curado" TEXT,
ADD COLUMN     "countryOfOrigin_api" TEXT,
ADD COLUMN     "coverImage_api" JSONB,
ADD COLUMN     "coverImage_curado" JSONB,
ADD COLUMN     "description_api" TEXT,
ADD COLUMN     "description_curado" TEXT,
ADD COLUMN     "duration_api" INTEGER,
ADD COLUMN     "duration_curado" INTEGER,
ADD COLUMN     "endDate_api" TIMESTAMP(3),
ADD COLUMN     "endDate_curado" TIMESTAMP(3),
ADD COLUMN     "episodes_api" INTEGER,
ADD COLUMN     "episodes_curado" INTEGER,
ADD COLUMN     "format_api" "public"."MediaFormat",
ADD COLUMN     "genres_api" TEXT[],
ADD COLUMN     "genres_curado" TEXT[],
ADD COLUMN     "idMal" INTEGER,
ADD COLUMN     "nextAiringEpisode_api" JSONB,
ADD COLUMN     "seasonYear_api" INTEGER,
ADD COLUMN     "season_api" "public"."MediaSeason",
ADD COLUMN     "source_api" "public"."MediaSource",
ADD COLUMN     "source_curado" TEXT,
ADD COLUMN     "startDate_api" TIMESTAMP(3),
ADD COLUMN     "startDate_curado" TIMESTAMP(3),
ADD COLUMN     "status_api" "public"."MediaStatus",
ADD COLUMN     "title_api" JSONB,
ADD COLUMN     "title_curado" JSONB,
ADD COLUMN     "trailer_api" JSONB,
ADD COLUMN     "trailer_curado" JSONB;

-- AlterTable
ALTER TABLE "public"."EventoAnuncio" DROP COLUMN "data_evento",
DROP COLUMN "nome",
ADD COLUMN     "description_api" TEXT,
ADD COLUMN     "end_time_api" TIMESTAMP(3),
ADD COLUMN     "logo_api" JSONB,
ADD COLUMN     "name_api" VARCHAR(255),
ADD COLUMN     "name_curado" VARCHAR(255),
ADD COLUMN     "start_time_api" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "EventoAnuncio_id_seq";

-- AlterTable
ALTER TABLE "public"."Filme" DROP COLUMN "data_lancamento_api",
DROP COLUMN "data_lancamento_curada",
DROP COLUMN "diretor",
DROP COLUMN "duracao",
DROP COLUMN "elenco",
DROP COLUMN "escritor",
DROP COLUMN "generos_api",
DROP COLUMN "generos_curados",
DROP COLUMN "plataformas_api",
DROP COLUMN "plataformas_curadas",
DROP COLUMN "poster_curado",
DROP COLUMN "poster_url_api",
DROP COLUMN "premiacoes",
DROP COLUMN "sinopse_api",
DROP COLUMN "sinopse_curada",
DROP COLUMN "titulo_api",
DROP COLUMN "titulo_curado",
DROP COLUMN "trailer_url_api",
DROP COLUMN "trailer_url_curado",
DROP COLUMN "ultima_verificacao_ingresso",
ADD COLUMN     "backdrop_path_api" VARCHAR(255),
ADD COLUMN     "backdrop_path_curado" VARCHAR(255),
ADD COLUMN     "cast_api" JSONB,
ADD COLUMN     "cast_curado" JSONB,
ADD COLUMN     "crew_api" JSONB,
ADD COLUMN     "crew_curado" JSONB,
ADD COLUMN     "genres_api" JSONB,
ADD COLUMN     "genres_curado" JSONB,
ADD COLUMN     "original_title_api" VARCHAR(255),
ADD COLUMN     "overview_api" TEXT,
ADD COLUMN     "overview_curado" TEXT,
ADD COLUMN     "popularity_api" DOUBLE PRECISION,
ADD COLUMN     "poster_path_api" VARCHAR(255),
ADD COLUMN     "poster_path_curado" VARCHAR(255),
ADD COLUMN     "production_companies_api" JSONB,
ADD COLUMN     "production_countries_api" JSONB,
ADD COLUMN     "release_date_api" DATE,
ADD COLUMN     "release_date_curado" DATE,
ADD COLUMN     "runtime_api" INTEGER,
ADD COLUMN     "runtime_curado" INTEGER,
ADD COLUMN     "spoken_languages_api" JSONB,
ADD COLUMN     "status_api" VARCHAR(50),
ADD COLUMN     "title_api" VARCHAR(255),
ADD COLUMN     "title_curado" VARCHAR(255),
ADD COLUMN     "videos_api" JSONB,
ADD COLUMN     "vote_count_api" INTEGER,
ADD COLUMN     "watch_providers_api" JSONB;

-- AlterTable
ALTER TABLE "public"."Jogo" DROP COLUMN "data_lancamento_api",
DROP COLUMN "data_lancamento_curada",
DROP COLUMN "desenvolvedores",
DROP COLUMN "evento_anuncio_id",
DROP COLUMN "generos_api",
DROP COLUMN "generos_curados",
DROP COLUMN "plataformas_api",
DROP COLUMN "plataformas_curadas",
DROP COLUMN "poster_curado",
DROP COLUMN "poster_url_api",
DROP COLUMN "premiacoes",
DROP COLUMN "publicadoras",
DROP COLUMN "sinopse_api",
DROP COLUMN "sinopse_curada",
DROP COLUMN "titulo_api",
DROP COLUMN "titulo_curado",
DROP COLUMN "trailer_url_api",
DROP COLUMN "trailer_url_curado",
ADD COLUMN     "artworks_api" JSONB,
ADD COLUMN     "category_api" "public"."GameCategory",
ADD COLUMN     "cover_api" JSONB,
ADD COLUMN     "first_release_date_api" DATE,
ADD COLUMN     "first_release_date_curado" DATE,
ADD COLUMN     "genres_api" JSONB,
ADD COLUMN     "genres_curado" JSONB,
ADD COLUMN     "involved_companies_api" JSONB,
ADD COLUMN     "name_api" VARCHAR(255),
ADD COLUMN     "name_curado" VARCHAR(255),
ADD COLUMN     "platforms_api" JSONB,
ADD COLUMN     "platforms_curado" JSONB,
ADD COLUMN     "player_perspectives_api" JSONB,
ADD COLUMN     "screenshots_api" JSONB,
ADD COLUMN     "slug_api" VARCHAR(255),
ADD COLUMN     "status_api" "public"."GameStatus",
ADD COLUMN     "storyline_api" TEXT,
ADD COLUMN     "summary_api" TEXT,
ADD COLUMN     "summary_curado" TEXT,
ADD COLUMN     "themes_api" JSONB,
ADD COLUMN     "videos_api" JSONB,
ADD COLUMN     "websites_api" JSONB;

-- AlterTable
ALTER TABLE "public"."Serie" DROP COLUMN "criadores",
DROP COLUMN "data_lancamento_api",
DROP COLUMN "data_lancamento_curada",
DROP COLUMN "elenco",
DROP COLUMN "generos_api",
DROP COLUMN "generos_curados",
DROP COLUMN "numero_episodios",
DROP COLUMN "numero_temporadas",
DROP COLUMN "plataformas_api",
DROP COLUMN "plataformas_curadas",
DROP COLUMN "poster_curado",
DROP COLUMN "poster_url_api",
DROP COLUMN "premiacoes",
DROP COLUMN "sinopse_api",
DROP COLUMN "sinopse_curada",
DROP COLUMN "titulo_api",
DROP COLUMN "titulo_curado",
DROP COLUMN "trailer_url_api",
DROP COLUMN "trailer_url_curado",
ADD COLUMN     "backdrop_path_api" VARCHAR(255),
ADD COLUMN     "backdrop_path_curado" VARCHAR(255),
ADD COLUMN     "cast_api" JSONB,
ADD COLUMN     "cast_curado" JSONB,
ADD COLUMN     "created_by_api" JSONB,
ADD COLUMN     "crew_api" JSONB,
ADD COLUMN     "crew_curado" JSONB,
ADD COLUMN     "episode_run_time_api" JSONB,
ADD COLUMN     "first_air_date_api" DATE,
ADD COLUMN     "first_air_date_curado" DATE,
ADD COLUMN     "genres_api" JSONB,
ADD COLUMN     "genres_curado" JSONB,
ADD COLUMN     "last_air_date_api" DATE,
ADD COLUMN     "name_api" VARCHAR(255),
ADD COLUMN     "name_curado" VARCHAR(255),
ADD COLUMN     "networks_api" JSONB,
ADD COLUMN     "number_of_episodes_api" INTEGER,
ADD COLUMN     "number_of_seasons_api" INTEGER,
ADD COLUMN     "original_name_api" VARCHAR(255),
ADD COLUMN     "overview_api" TEXT,
ADD COLUMN     "overview_curado" TEXT,
ADD COLUMN     "popularity_api" DOUBLE PRECISION,
ADD COLUMN     "poster_path_api" VARCHAR(255),
ADD COLUMN     "poster_path_curado" VARCHAR(255),
ADD COLUMN     "seasons_api" JSONB,
ADD COLUMN     "videos_api" JSONB,
ADD COLUMN     "vote_count_api" INTEGER,
ADD COLUMN     "watch_providers_api" JSONB;

-- CreateTable
CREATE TABLE "public"."StreamingEpisode" (
    "id" SERIAL NOT NULL,
    "title_api" TEXT,
    "thumbnail_api" TEXT,
    "url_api" TEXT NOT NULL,
    "site_api" TEXT,
    "title_curado" TEXT,
    "url_curado" TEXT,
    "animeId" INTEGER NOT NULL,

    CONSTRAINT "StreamingEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSpoiler" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Character" (
    "id" INTEGER NOT NULL,
    "name_api" JSONB,
    "image_api" JSONB,
    "description_api" TEXT,
    "gender_api" TEXT,
    "age_api" TEXT,
    "name_curado" JSONB,
    "image_curado" JSONB,
    "description_curado" TEXT,
    "gender_curado" TEXT,
    "age_curado" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VoiceActor" (
    "id" INTEGER NOT NULL,
    "name_api" TEXT,
    "image_api" JSONB,
    "name_curado" TEXT,

    CONSTRAINT "VoiceActor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Staff" (
    "id" INTEGER NOT NULL,
    "name_api" TEXT,
    "image_api" JSONB,
    "primaryOccupations_api" TEXT[],
    "name_curado" TEXT,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Studio" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "isAnimationStudio" BOOLEAN NOT NULL,

    CONSTRAINT "Studio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeCharacter" (
    "animeId" INTEGER NOT NULL,
    "characterId" INTEGER NOT NULL,
    "role" "public"."CharacterRole" NOT NULL,

    CONSTRAINT "AnimeCharacter_pkey" PRIMARY KEY ("animeId","characterId")
);

-- CreateTable
CREATE TABLE "public"."CharacterVoiceActor" (
    "characterId" INTEGER NOT NULL,
    "voiceActorId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,

    CONSTRAINT "CharacterVoiceActor_pkey" PRIMARY KEY ("characterId","voiceActorId","language")
);

-- CreateTable
CREATE TABLE "public"."AnimeStaff" (
    "animeId" INTEGER NOT NULL,
    "staffId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "AnimeStaff_pkey" PRIMARY KEY ("animeId","staffId","role")
);

-- CreateTable
CREATE TABLE "public"."AnimeStudio" (
    "animeId" INTEGER NOT NULL,
    "studioId" INTEGER NOT NULL,

    CONSTRAINT "AnimeStudio_pkey" PRIMARY KEY ("animeId","studioId")
);

-- CreateTable
CREATE TABLE "public"."_EventoAnuncioToJogo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EventoAnuncioToJogo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AnimeToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AnimeToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "StreamingEpisode_url_api_key" ON "public"."StreamingEpisode"("url_api");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Studio_name_key" ON "public"."Studio"("name");

-- CreateIndex
CREATE INDEX "_EventoAnuncioToJogo_B_index" ON "public"."_EventoAnuncioToJogo"("B");

-- CreateIndex
CREATE INDEX "_AnimeToTag_B_index" ON "public"."_AnimeToTag"("B");

-- AddForeignKey
ALTER TABLE "public"."StreamingEpisode" ADD CONSTRAINT "StreamingEpisode_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeCharacter" ADD CONSTRAINT "AnimeCharacter_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeCharacter" ADD CONSTRAINT "AnimeCharacter_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CharacterVoiceActor" ADD CONSTRAINT "CharacterVoiceActor_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CharacterVoiceActor" ADD CONSTRAINT "CharacterVoiceActor_voiceActorId_fkey" FOREIGN KEY ("voiceActorId") REFERENCES "public"."VoiceActor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeStaff" ADD CONSTRAINT "AnimeStaff_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeStaff" ADD CONSTRAINT "AnimeStaff_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeStudio" ADD CONSTRAINT "AnimeStudio_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeStudio" ADD CONSTRAINT "AnimeStudio_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."Studio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EventoAnuncioToJogo" ADD CONSTRAINT "_EventoAnuncioToJogo_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."EventoAnuncio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EventoAnuncioToJogo" ADD CONSTRAINT "_EventoAnuncioToJogo_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Jogo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnimeToTag" ADD CONSTRAINT "_AnimeToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnimeToTag" ADD CONSTRAINT "_AnimeToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
