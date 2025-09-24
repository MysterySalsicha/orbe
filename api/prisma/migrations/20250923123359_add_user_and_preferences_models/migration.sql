-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "quer_avaliar" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."preferencias_usuario_midia" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "midia_id" INTEGER NOT NULL,
    "tipo_midia" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "avaliacao" TEXT,
    "data_interacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "preferencias_usuario_midia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."preferencias_usuario_midia" ADD CONSTRAINT "preferencias_usuario_midia_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
