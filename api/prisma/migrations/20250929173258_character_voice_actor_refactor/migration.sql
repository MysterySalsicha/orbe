/*
  Warnings:

  - The primary key for the `AnimeCharacter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dubladorId` on the `AnimeCharacter` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[animeId,characterId,role]` on the table `AnimeCharacter` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."AnimeCharacter" DROP CONSTRAINT "AnimeCharacter_dubladorId_fkey";

-- AlterTable
ALTER TABLE "public"."AnimeCharacter" DROP CONSTRAINT "AnimeCharacter_pkey",
DROP COLUMN "dubladorId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "AnimeCharacter_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "public"."AnimeCharacterVoiceActor" (
    "animeCharacterId" INTEGER NOT NULL,
    "dubladorId" INTEGER NOT NULL,

    CONSTRAINT "AnimeCharacterVoiceActor_pkey" PRIMARY KEY ("animeCharacterId","dubladorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimeCharacter_animeId_characterId_role_key" ON "public"."AnimeCharacter"("animeId", "characterId", "role");

-- AddForeignKey
ALTER TABLE "public"."AnimeCharacterVoiceActor" ADD CONSTRAINT "AnimeCharacterVoiceActor_animeCharacterId_fkey" FOREIGN KEY ("animeCharacterId") REFERENCES "public"."AnimeCharacter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeCharacterVoiceActor" ADD CONSTRAINT "AnimeCharacterVoiceActor_dubladorId_fkey" FOREIGN KEY ("dubladorId") REFERENCES "public"."Dublador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
