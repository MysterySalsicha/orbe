/*
  Warnings:

  - The primary key for the `FilmeCast` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FilmeCrew` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SerieCast` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SerieCrew` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `order` on table `FilmeCast` required. This step will fail if there are existing NULL values in that column.
  - Made the column `job` on table `FilmeCrew` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order` on table `SerieCast` required. This step will fail if there are existing NULL values in that column.
  - Made the column `job` on table `SerieCrew` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."FilmeCast" DROP CONSTRAINT "FilmeCast_pkey",
ALTER COLUMN "order" SET NOT NULL,
ADD CONSTRAINT "FilmeCast_pkey" PRIMARY KEY ("filmeId", "pessoaId", "order");

-- AlterTable
ALTER TABLE "public"."FilmeCrew" DROP CONSTRAINT "FilmeCrew_pkey",
ALTER COLUMN "job" SET NOT NULL,
ADD CONSTRAINT "FilmeCrew_pkey" PRIMARY KEY ("filmeId", "pessoaId", "job");

-- AlterTable
ALTER TABLE "public"."SerieCast" DROP CONSTRAINT "SerieCast_pkey",
ALTER COLUMN "order" SET NOT NULL,
ADD CONSTRAINT "SerieCast_pkey" PRIMARY KEY ("serieId", "pessoaId", "order");

-- AlterTable
ALTER TABLE "public"."SerieCrew" DROP CONSTRAINT "SerieCrew_pkey",
ALTER COLUMN "job" SET NOT NULL,
ADD CONSTRAINT "SerieCrew_pkey" PRIMARY KEY ("serieId", "pessoaId", "job");
