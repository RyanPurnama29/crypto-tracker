import * as cheerio from 'cheerio';

interface ETFData {
  header: string[][];
  body: string[][];
}

export async function scrapeETFData(): Promise<ETFData> {
  try {
    // Fetch data dari URL
    const response = await fetch('https://r.jina.ai/https://farside.co.uk/btc/', {
      headers: {
        'X-Return-Format': 'html',
        'X-No-Cache': 'true',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const html = await response.text();

    // Load HTML ke cheerio
    const $ = cheerio.load(html);

    // Ekstrak header
    const header: string[][] = [];
    $('table thead tr').each((rowIndex, row) => {
      if (rowIndex === 0 || rowIndex === 1) {
        const thArray: string[] = [];
        $(row)
          .find('th')
          .each((_, th) => {
            thArray.push($(th).text().trim());
          });
        header.push(thArray.slice(1, -1)); // Hapus kolom pertama dan terakhir
      }
    });

    // Ekstrak body
    const body: string[][] = [];
    $('table tbody tr').each((_, row) => {
      const tdArray: string[] = [];
      $(row)
        .find('td')
        .each((_, td) => {
          tdArray.push($(td).text().trim());
        });
      body.push(tdArray.slice(0, -1)); // Hapus kolom terakhir
    });

    // Hapus baris yang tidak diperlukan
    const trimmedBody = body.slice(2, -6);

    return {
      header: header,
      body: trimmedBody,
    };
  } catch (error) {
    console.error('Error scraping data:', error);
    throw error;
  }
}
