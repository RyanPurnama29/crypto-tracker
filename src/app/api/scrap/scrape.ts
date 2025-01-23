// import puppeteer from "puppeteer";

// export async function scrapeETFData() {
//   const browser = await puppeteer.launch({
//     headless: false, // Non-headless untuk debugging
//     args: ["--no-sandbox", "--disable-setuid-sandbox"], // Untuk server
//   });

//   const page = await browser.newPage();

//   // Atur User-Agent dan Header
//   await page.setUserAgent(
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
//   );
//   await page.setExtraHTTPHeaders({
//     Referer: "https://farside.co.uk",
//     "Accept-Language": "en-US,en;q=0.9",
//   });

//   try {
//     await page.goto("https://farside.co.uk/btc/", {
//       waitUntil: "domcontentloaded",
//     });

//     const etfData = await page.evaluate(() => {
//       const header: string[][] = [];
//       Array.from(document.querySelectorAll("table thead tr")).map(
//         (row, rowIndex) => {
//           if (rowIndex === 0 || rowIndex === 1) {
//             const thArray: string[] = [];
//             Array.from(row.querySelectorAll("th")).map((th) => {
//               thArray.push(`${th.innerText.trim()}`);
//             });
//             header.push(thArray.slice(1, -1));
//           }
//         }
//       );

//       const body: string[][] = [];
//       Array.from(document.querySelectorAll("table tbody tr")).map((row) => {
//         const tdArray: string[] = [];
//         Array.from(row.querySelectorAll("td")).map((td) => {
//           const tdText = td.innerText.trim();
//           tdArray.push(`${tdText}`);
//         });
//         body.push(tdArray.slice(0, -1));
//       });
//       const trimmerdBody = body.slice(2, -6);

//       return {
//         header: header,
//         body: trimmerdBody,
//       };
//     });
//     return etfData;
//   } catch (error) {
//     console.error("Error scraping data:", error);
//     throw error;
//   } finally {
//     await browser.close();
//   }
// }

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