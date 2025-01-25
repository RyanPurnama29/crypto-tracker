import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/prisma';
import { scrapeETFData } from "./scrape";
import { normalizer } from "./normalizer";
import { type Transaction } from "./types";
// import { MOCK_DATA } from "./mock";

// async function deleteAllTransactions() {
//   return prisma.transaction.deleteMany();
// }

async function insertTransactions(normalizeData: Transaction[]) {
  try {
    const upsertPromises = normalizeData.map(async (transaction) => {
      // Cari ETF berdasarkan etf_name dan company_name
      const etf = await prisma.etf.findFirst({
        where: {
          etf_symbol: transaction.etfSymbol,
          company_name: transaction.companyName,
        },
      });

      if (!etf) {
        console.error(`ETF not found for ${transaction.etfSymbol} (${transaction.companyName})`);
        return;
      }

      // Gunakan upsert untuk membuat atau memperbarui transaksi
      await prisma.transaction.upsert({
        where: {
          etf_id_date: { // Gunakan constraint unik untuk etf_id dan date
            etf_id: etf.id,
            date: new Date(transaction.formatedDate),
          },
        },
        update: {
          amount: transaction.amount, // Perbarui amount jika data sudah ada
        },
        create: {
          etf_id: etf.id,
          amount: transaction.amount,
          date: new Date(transaction.formatedDate), // Buat data baru jika tidak ada
        },
      });

      // console.log(`Upserted transaction for ETF: ${transaction.etfSymbol} on ${transaction.formatedDate.toLocaleString('id-ID')}`);
    });

    // Jalankan semua upsert secara paralel
    await Promise.all(upsertPromises);
  } catch (error) {
    console.error('Error inserting transactions:', error);
  }
}

async function getAllTransactions() {
  return prisma.transaction.findMany({
    include: {
      etf: true,
    },
  });
}

export async function GET() {
  const scrappedData = await scrapeETFData();
  /**
   * @note: this is used to reduce the database insertion time consumption
   */
  const get3LastData = {
    header: scrappedData.header,
    body: scrappedData.body.slice(-3), // Ambil 3 data terakhir
  };
  
  const normalizeData = normalizer(get3LastData);

  await insertTransactions(normalizeData);

  // const allTransactions = await getAllTransactions();
  return NextResponse.json({ data: get3LastData }, { status: 200 });
}
