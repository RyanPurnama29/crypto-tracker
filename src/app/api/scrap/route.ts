import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { scrapeETFData } from './scrape';
import { normalizer } from './normalizer';
import { type Transaction } from './types';

async function insertTransactions(normalizeData: Transaction[]) {
  try {
    // 1. Kumpulkan semua identifier ETF unik
    const seen = new Set<string>();
    const uniquePairs: Array<{ etfSymbol: string; companyName: string }> = [];

    for (const t of normalizeData) {
      const key = `${t.etfSymbol}|${t.companyName}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniquePairs.push({ etfSymbol: t.etfSymbol, companyName: t.companyName });
      }
    }

    // 2. Ambil semua ETF terkait dalam satu query
    const etfs = await prisma.etf.findMany({
      where: {
        OR: uniquePairs.map(pair => ({
          etf_symbol: pair.etfSymbol,
          company_name: pair.companyName,
        })),
      },
    });

    // 3. Buat mapping ETF identifier ke ID
    const etfMap = new Map<string, number>();
    for (const etf of etfs) {
      const key = `${etf.etf_symbol}|${etf.company_name}`;
      etfMap.set(key, etf.id);
    }

    // 4. Siapkan transaksi valid dengan ETF ID
    const validTransactions = [];
    for (const t of normalizeData) {
      const key = `${t.etfSymbol}|${t.companyName}`;
      const etfId = etfMap.get(key);

      if (!etfId) {
        console.error(`ETF not found for ${t.etfSymbol} (${t.companyName})`);
        continue;
      }

      validTransactions.push({
        etfId,
        date: new Date(t.formatedDate),
        amount: t.amount,
      });
    }

    if (validTransactions.length === 0) {
      console.log('No valid transactions to insert');
      return;
    }

    // 5. Bulk upsert menggunakan raw SQL
    const values = validTransactions.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(', ');

    const params = validTransactions.flatMap(t => [t.etfId, t.date, t.amount]);

    const query = `
      INSERT INTO "Transaction" (etf_id, date, amount)
      VALUES ${values}
      ON CONFLICT (etf_id, date)
      DO UPDATE SET amount = EXCLUDED.amount
    `;

    await prisma.$executeRawUnsafe(query, ...params);
  } catch (error) {
    console.error('Error inserting transactions:', error);
    throw error;
  }
}

export async function GET() {
  try {
    // Step 1: Scrape ETF Data
    console.time('Scrape ETF Data');
    const scrappedData = await scrapeETFData();
    console.timeEnd('Scrape ETF Data');

    // Step 2: Ambil 2 data terakhir
    const get2LastData = {
      header: scrappedData.header,
      body: scrappedData.body.slice(-2),
    };

    // Step 3: Normalisasi data
    console.time('Normalize Data');
    const normalizeData = normalizer(get2LastData);
    console.timeEnd('Normalize Data');

    // Step 4: Insert ke database
    console.time('Insert Data');
    await insertTransactions(normalizeData);
    console.timeEnd('Insert Data');

    return NextResponse.json({ data: get2LastData }, { status: 200 });
  } catch (error) {
    console.error('Error in GET function:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
