-- AlterTable
ALTER TABLE "public"."Anime" ADD COLUMN     "premiacoes" JSONB;

-- AlterTable
ALTER TABLE "public"."Filme" ADD COLUMN     "premiacoes" JSONB;

-- AlterTable
ALTER TABLE "public"."Jogo" ADD COLUMN     "premiacoes" JSONB;

-- AlterTable
ALTER TABLE "public"."Serie" ADD COLUMN     "premiacoes" JSONB;
