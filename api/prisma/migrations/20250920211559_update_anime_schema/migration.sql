/*
  Warnings:

  - The primary key for the `Anime` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `averageScore` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `englishTitle` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `externalId` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `genres` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `studio` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Anime` table. All the data in the column will be lost.
  - The `id` column on the `Anime` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "public"."Anime_externalId_key";

-- AlterTable
ALTER TABLE "public"."Anime" DROP CONSTRAINT "Anime_pkey",
DROP COLUMN "averageScore",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "englishTitle",
DROP COLUMN "externalId",
DROP COLUMN "genres",
DROP COLUMN "imageUrl",
DROP COLUMN "releaseDate",
DROP COLUMN "studio",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "avaliacao" DOUBLE PRECISION,
ADD COLUMN     "criadores" VARCHAR(255),
ADD COLUMN     "data_lancamento_api" VARCHAR(10),
ADD COLUMN     "data_lancamento_curada" VARCHAR(10),
ADD COLUMN     "estudio" VARCHAR(100),
ADD COLUMN     "fonte" VARCHAR(100),
ADD COLUMN     "generos" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "numero_episodios" INTEGER,
ADD COLUMN     "numero_temporadas" INTEGER,
ADD COLUMN     "plataformas_curadas" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "poster_curado" VARCHAR(255),
ADD COLUMN     "poster_url_api" VARCHAR(255),
ADD COLUMN     "proximo_episodio" VARCHAR(10),
ADD COLUMN     "sinopse" TEXT,
ADD COLUMN     "status_dublagem" VARCHAR(50),
ADD COLUMN     "titulo_api" VARCHAR(255),
ADD COLUMN     "titulo_curado" VARCHAR(255) NOT NULL DEFAULT '',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Anime_pkey" PRIMARY KEY ("id");
