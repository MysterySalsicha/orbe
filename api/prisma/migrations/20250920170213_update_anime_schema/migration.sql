/*
  Warnings:

  - The primary key for the `Anime` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `avaliacao` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_api` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `data_lancamento_curada` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `estudio` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `fonte` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `generos` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `numero_episodios` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `plataformas_curadas` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `poster_curado` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `poster_url_api` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `proximo_episodio` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `sinopse` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `status_dublagem` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_api` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_curado` on the `Anime` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalId]` on the table `Anime` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `Anime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Anime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Anime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Anime" DROP CONSTRAINT "Anime_pkey",
DROP COLUMN "avaliacao",
DROP COLUMN "data_lancamento_api",
DROP COLUMN "data_lancamento_curada",
DROP COLUMN "estudio",
DROP COLUMN "fonte",
DROP COLUMN "generos",
DROP COLUMN "numero_episodios",
DROP COLUMN "plataformas_curadas",
DROP COLUMN "poster_curado",
DROP COLUMN "poster_url_api",
DROP COLUMN "proximo_episodio",
DROP COLUMN "sinopse",
DROP COLUMN "status_dublagem",
DROP COLUMN "titulo_api",
DROP COLUMN "titulo_curado",
ADD COLUMN     "averageScore" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "englishTitle" TEXT,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "releaseDate" TIMESTAMP(3),
ADD COLUMN     "studio" TEXT,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'temp_title',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Anime_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Anime_id_seq";

-- CreateIndex
-- Backfill unique externalId for existing rows
UPDATE "public"."Anime"
SET "externalId" = gen_random_uuid()::text
WHERE "externalId" IS NULL OR "externalId" = 'temp_external_id';

-- Set externalId to NOT NULL after backfilling
ALTER TABLE "public"."Anime" ALTER COLUMN "externalId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Anime_externalId_key" ON "public"."Anime"("externalId");
