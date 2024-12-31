/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Etf" (
    "id" SERIAL NOT NULL,
    "etf_symbol" TEXT NOT NULL,
    "etf_name" TEXT NOT NULL,
    "crypto_name" TEXT NOT NULL,
    "crypto_symbol" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,

    CONSTRAINT "Etf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "etf_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Etf_etf_symbol_key" ON "Etf"("etf_symbol");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_etf_id_fkey" FOREIGN KEY ("etf_id") REFERENCES "Etf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
