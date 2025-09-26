/*
  Warnings:

  - You are about to drop the column `developer` on the `JogoCompany` table. All the data in the column will be lost.
  - You are about to drop the column `publisher` on the `JogoCompany` table. All the data in the column will be lost.
  - The primary key for the `JogoOnCompany` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[usuario_id,midia_id,tipo_midia]` on the table `preferencias_usuario_midia` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `JogoOnCompany` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Anime" ADD COLUMN     "countryOfOrigin" TEXT,
ADD COLUMN     "hashtag" TEXT,
ADD COLUMN     "isAdult" BOOLEAN DEFAULT false,
ADD COLUMN     "isLicensed" BOOLEAN,
ADD COLUMN     "synonyms" TEXT[];

-- AlterTable
ALTER TABLE "public"."Filme" ADD COLUMN     "adult" BOOLEAN DEFAULT false,
ADD COLUMN     "collectionId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Jogo" ADD COLUMN     "category" TEXT,
ADD COLUMN     "hypes" INTEGER,
ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "public"."JogoCompany" DROP COLUMN "developer",
DROP COLUMN "publisher";

-- AlterTable
ALTER TABLE "public"."JogoOnCompany" DROP CONSTRAINT "JogoOnCompany_pkey",
ADD COLUMN     "role" TEXT NOT NULL,
ADD CONSTRAINT "JogoOnCompany_pkey" PRIMARY KEY ("jogoId", "companyId", "role");

-- AlterTable
ALTER TABLE "public"."Serie" ADD COLUMN     "adult" BOOLEAN DEFAULT false,
ADD COLUMN     "episodeRunTime" INTEGER[],
ADD COLUMN     "inProduction" BOOLEAN,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "type" TEXT;

-- CreateTable
CREATE TABLE "public"."Collection" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "posterPath" TEXT,
    "backdropPath" TEXT,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StreamingProvider" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "logoPath" TEXT,

    CONSTRAINT "StreamingProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeTag" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "isAdult" BOOLEAN,

    CONSTRAINT "AnimeTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeRank" (
    "id" SERIAL NOT NULL,
    "animeId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "year" INTEGER,
    "allTime" BOOLEAN,

    CONSTRAINT "AnimeRank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeExternalLink" (
    "id" SERIAL NOT NULL,
    "animeId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "site" TEXT NOT NULL,

    CONSTRAINT "AnimeExternalLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AiringSchedule" (
    "id" SERIAL NOT NULL,
    "animeId" INTEGER NOT NULL,
    "airingAt" TIMESTAMP(3) NOT NULL,
    "episode" INTEGER NOT NULL,

    CONSTRAINT "AiringSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AgeRating" (
    "id" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "AgeRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GameMode" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "GameMode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GameEngine" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "GameEngine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FilmeOnStreamingProvider" (
    "filmeId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,

    CONSTRAINT "FilmeOnStreamingProvider_pkey" PRIMARY KEY ("filmeId","providerId")
);

-- CreateTable
CREATE TABLE "public"."SerieLanguage" (
    "serieId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,

    CONSTRAINT "SerieLanguage_pkey" PRIMARY KEY ("serieId","languageId")
);

-- CreateTable
CREATE TABLE "public"."SerieOnStreamingProvider" (
    "serieId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,

    CONSTRAINT "SerieOnStreamingProvider_pkey" PRIMARY KEY ("serieId","providerId")
);

-- CreateTable
CREATE TABLE "public"."AnimeOnTag" (
    "animeId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "AnimeOnTag_pkey" PRIMARY KEY ("animeId","tagId")
);

-- CreateTable
CREATE TABLE "public"."AnimeRelation" (
    "sourceAnimeId" INTEGER NOT NULL,
    "relatedAnimeId" INTEGER NOT NULL,
    "relationType" TEXT NOT NULL,

    CONSTRAINT "AnimeRelation_pkey" PRIMARY KEY ("sourceAnimeId","relatedAnimeId","relationType")
);

-- CreateTable
CREATE TABLE "public"."JogoOnAgeRating" (
    "jogoId" INTEGER NOT NULL,
    "ageRatingId" INTEGER NOT NULL,

    CONSTRAINT "JogoOnAgeRating_pkey" PRIMARY KEY ("jogoId","ageRatingId")
);

-- CreateTable
CREATE TABLE "public"."JogoOnGameMode" (
    "jogoId" INTEGER NOT NULL,
    "gameModeId" INTEGER NOT NULL,

    CONSTRAINT "JogoOnGameMode_pkey" PRIMARY KEY ("jogoId","gameModeId")
);

-- CreateTable
CREATE TABLE "public"."JogoOnGameEngine" (
    "jogoId" INTEGER NOT NULL,
    "gameEngineId" INTEGER NOT NULL,

    CONSTRAINT "JogoOnGameEngine_pkey" PRIMARY KEY ("jogoId","gameEngineId")
);

-- CreateTable
CREATE TABLE "public"."GameRelation" (
    "sourceGameId" INTEGER NOT NULL,
    "relatedGameId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "GameRelation_pkey" PRIMARY KEY ("sourceGameId","relatedGameId","type")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "relatedMediaId" INTEGER,
    "relatedMediaType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collection_id_key" ON "public"."Collection"("id");

-- CreateIndex
CREATE UNIQUE INDEX "StreamingProvider_tmdbId_key" ON "public"."StreamingProvider"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeTag_name_key" ON "public"."AnimeTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GameMode_name_key" ON "public"."GameMode"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GameMode_slug_key" ON "public"."GameMode"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GameEngine_name_key" ON "public"."GameEngine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GameEngine_slug_key" ON "public"."GameEngine"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "preferencias_usuario_midia_usuario_id_midia_id_tipo_midia_key" ON "public"."preferencias_usuario_midia"("usuario_id", "midia_id", "tipo_midia");

-- AddForeignKey
ALTER TABLE "public"."Filme" ADD CONSTRAINT "Filme_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeRank" ADD CONSTRAINT "AnimeRank_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeExternalLink" ADD CONSTRAINT "AnimeExternalLink_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AiringSchedule" ADD CONSTRAINT "AiringSchedule_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FilmeOnStreamingProvider" ADD CONSTRAINT "FilmeOnStreamingProvider_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "public"."Filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FilmeOnStreamingProvider" ADD CONSTRAINT "FilmeOnStreamingProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."StreamingProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SerieLanguage" ADD CONSTRAINT "SerieLanguage_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "public"."Serie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SerieLanguage" ADD CONSTRAINT "SerieLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SerieOnStreamingProvider" ADD CONSTRAINT "SerieOnStreamingProvider_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "public"."Serie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SerieOnStreamingProvider" ADD CONSTRAINT "SerieOnStreamingProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."StreamingProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeOnTag" ADD CONSTRAINT "AnimeOnTag_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeOnTag" ADD CONSTRAINT "AnimeOnTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."AnimeTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeRelation" ADD CONSTRAINT "AnimeRelation_sourceAnimeId_fkey" FOREIGN KEY ("sourceAnimeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeRelation" ADD CONSTRAINT "AnimeRelation_relatedAnimeId_fkey" FOREIGN KEY ("relatedAnimeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JogoOnAgeRating" ADD CONSTRAINT "JogoOnAgeRating_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "public"."Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JogoOnAgeRating" ADD CONSTRAINT "JogoOnAgeRating_ageRatingId_fkey" FOREIGN KEY ("ageRatingId") REFERENCES "public"."AgeRating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JogoOnGameMode" ADD CONSTRAINT "JogoOnGameMode_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "public"."Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JogoOnGameMode" ADD CONSTRAINT "JogoOnGameMode_gameModeId_fkey" FOREIGN KEY ("gameModeId") REFERENCES "public"."GameMode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JogoOnGameEngine" ADD CONSTRAINT "JogoOnGameEngine_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "public"."Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JogoOnGameEngine" ADD CONSTRAINT "JogoOnGameEngine_gameEngineId_fkey" FOREIGN KEY ("gameEngineId") REFERENCES "public"."GameEngine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameRelation" ADD CONSTRAINT "GameRelation_sourceGameId_fkey" FOREIGN KEY ("sourceGameId") REFERENCES "public"."Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameRelation" ADD CONSTRAINT "GameRelation_relatedGameId_fkey" FOREIGN KEY ("relatedGameId") REFERENCES "public"."Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
