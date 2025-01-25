import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { scrapeETFData } from './scrape';
import { normalizer } from './normalizer';
import { type Transaction } from './types';
// import { MOCK_DATA } from "./mock";

async function insertTransactions(normalizeData: Transaction[]) {
  try {
    const upsertPromises = normalizeData.map(async transaction => {
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
          etf_id_date: {
            // Gunakan constraint unik untuk etf_id dan date
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

      console.log(`Upserted transaction for ETF: ${transaction.etfSymbol} on ${transaction.formatedDate}`);
    });

    // Jalankan semua upsert secara paralel
    await Promise.all(upsertPromises);
  } catch (error) {
    console.error('Error inserting transactions:', error);
  }
}

export async function GET() {
  try {
    // Step 1: Scrape ETF Data
    console.time('Scrape ETF Data');
    const scrappedData = await scrapeETFData();
    console.timeEnd('Scrape ETF Data');

    // Step 2: Extract Last 2 Rows
    console.time('Extract Last 2 Rows');
    const get2LastData = {
      header: scrappedData.header,
      body: scrappedData.body.slice(-2), // Take the last 2 rows
    };
    console.timeEnd('Extract Last 2 Rows');

    // Step 3: Normalize Data
    console.time('Normalize Data');
    const normalizeData = normalizer(get2LastData);
    console.timeEnd('Normalize Data');

    // Step 4: Insert Data into Database
    console.log('Data Inserted Started');
    console.time('Insert Data into Database');
    await insertTransactions(normalizeData);
    console.timeEnd('Insert Data into Database');
    console.log('Data Inserted Successfully');

    // Step 5: Return Response
    console.timeEnd('Total Execution Time');
    return NextResponse.json({ data: get2LastData }, { status: 200 });
  } catch (error) {
    console.error('Error in GET function:', error);
    console.timeEnd('Total Execution Time');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
