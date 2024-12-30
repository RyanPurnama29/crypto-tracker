import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { scrapeETFData } from "./scrape";
import { normalizer } from "./normalizer";
// import { MOCK_DATA } from "./mock";

export async function GET() {
  // const etfData = await scrapeETFData();
  // const normalizeData = normalizer(etfData);
  const users = await prisma.user.findMany();
  return NextResponse.json({ data: users }, { status: 200 });
}