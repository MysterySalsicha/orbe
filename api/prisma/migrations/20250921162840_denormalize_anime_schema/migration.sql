/*
  Warnings:

  - The `format_api` column on the `Anime` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `season_api` column on the `Anime` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `source_api` column on the `Anime` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status_api` column on the `Anime` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `AnimeCharacter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimeStaff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimeStudio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Character` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CharacterVoiceActor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StreamingEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Studio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VoiceActor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AnimeToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AnimeCharacter" DROP CONSTRAINT "AnimeCharacter_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeCharacter" DROP CONSTRAINT "AnimeCharacter_characterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeStaff" DROP CONSTRAINT "AnimeStaff_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeStaff" DROP CONSTRAINT "AnimeStaff_staffId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeStudio" DROP CONSTRAINT "AnimeStudio_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeStudio" DROP CONSTRAINT "AnimeStudio_studioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CharacterVoiceActor" DROP CONSTRAINT "CharacterVoiceActor_characterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CharacterVoiceActor" DROP CONSTRAINT "CharacterVoiceActor_voiceActorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StreamingEpisode" DROP CONSTRAINT "StreamingEpisode_animeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AnimeToTag" DROP CONSTRAINT "_AnimeToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AnimeToTag" DROP CONSTRAINT "_AnimeToTag_B_fkey";

-- AlterTable
ALTER TABLE "public"."Anime" ADD COLUMN     "characters_api" JSONB,
ADD COLUMN     "staff_api" JSONB,
ADD COLUMN     "streamingEpisodes_api" JSONB,
ADD COLUMN     "studios_api" JSONB,
ADD COLUMN     "tags_api" JSONB,
DROP COLUMN "format_api",
ADD COLUMN     "format_api" TEXT,
DROP COLUMN "season_api",
ADD COLUMN     "season_api" TEXT,
DROP COLUMN "source_api",
ADD COLUMN     "source_api" TEXT,
DROP COLUMN "status_api",
ADD COLUMN     "status_api" TEXT;

-- DropTable
DROP TABLE "public"."AnimeCharacter";

-- DropTable
DROP TABLE "public"."AnimeStaff";

-- DropTable
DROP TABLE "public"."AnimeStudio";

-- DropTable
DROP TABLE "public"."Character";

-- DropTable
DROP TABLE "public"."CharacterVoiceActor";

-- DropTable
DROP TABLE "public"."Staff";

-- DropTable
DROP TABLE "public"."StreamingEpisode";

-- DropTable
DROP TABLE "public"."Studio";

-- DropTable
DROP TABLE "public"."Tag";

-- DropTable
DROP TABLE "public"."VoiceActor";

-- DropTable
DROP TABLE "public"."_AnimeToTag";
