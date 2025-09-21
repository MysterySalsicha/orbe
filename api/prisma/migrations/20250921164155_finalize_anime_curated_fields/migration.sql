/*
  Warnings:

  - You are about to drop the column `coverImage_curado` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `title_curado` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `trailer_curado` on the `Anime` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Anime" DROP COLUMN "coverImage_curado",
DROP COLUMN "title_curado",
DROP COLUMN "trailer_curado",
ADD COLUMN     "characters_curado" JSONB,
ADD COLUMN     "nome_curado" TEXT,
ADD COLUMN     "plataformas_curado" JSONB,
ADD COLUMN     "poster_path_curado" TEXT,
ADD COLUMN     "staff_curado" JSONB,
ADD COLUMN     "studios_curado" JSONB,
ADD COLUMN     "tags_curado" JSONB,
ADD COLUMN     "trailer_url_curado" TEXT;
