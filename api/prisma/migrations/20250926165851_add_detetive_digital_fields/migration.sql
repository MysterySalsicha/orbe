-- AlterTable
ALTER TABLE "public"."Filme" ADD COLUMN     "em_prevenda" BOOLEAN DEFAULT false,
ADD COLUMN     "ingresso_link" TEXT,
ADD COLUMN     "ultima_verificacao_ingresso" TIMESTAMP(3);
