import { NextResponse } from 'next/server'
import { scrapeETFData } from "./scrape";
import { normalizer } from "./normalizer";
import { MOCK_DATA } from "./mock";

export async function GET(request: Request) {
  // const etfData = await scrapeETFData();
  const normalizeData = normalizer(MOCK_DATA);
  return NextResponse.json({ data: normalizeData }, { status: 200 });
}