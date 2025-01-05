/*
  Warnings:

  - A unique constraint covering the columns `[etf_id,date]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transaction_etf_id_date_key" ON "Transaction"("etf_id", "date");
