/*
  Warnings:

  - Changed the type of `igdbId` on the `Artwork` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `igdbId` on the `Screenshot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Artwork" DROP COLUMN "igdbId",
ADD COLUMN     "igdbId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Screenshot" DROP COLUMN "igdbId",
ADD COLUMN     "igdbId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Website" ALTER COLUMN "igdbId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Artwork_igdbId_key" ON "public"."Artwork"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Screenshot_igdbId_key" ON "public"."Screenshot"("igdbId");
