import type { ETF, Transaction, TableRow } from './types';

// Fungsi untuk memformat tanggal menjadi "03 Jan 2025"
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const normalizer = (etfData: ETF[], transactionData: Transaction[]): TableRow[] => {
  const result: TableRow[] = [];

  // Buat map untuk mengakses ETF berdasarkan ID
  const etfMap: { [key: number]: string } = {};
  etfData.forEach((etf) => {
    etfMap[etf.id] = etf.etf_symbol;
  });

  // Kelompokkan transaksi berdasarkan tanggal
  const groupedByDate: { [key: string]: { [key: string]: number } } = {};
  transactionData.forEach((transaction) => {
    const date = formatDate(transaction.date);
    if (!groupedByDate[date]) {
      groupedByDate[date] = {};
    }
    groupedByDate[date][etfMap[transaction.etf_id]] = transaction.amount;
  });

  // console.log(groupedByDate);

  // Format data untuk tabel
  for (const date in groupedByDate) {
    const row: TableRow = { date };
    // console.log(date);
    for (const etfSymbol in groupedByDate[date]) {
      row[etfSymbol] = groupedByDate[date][etfSymbol];
    }
    // console.log(row);
    result.push(row);
  }

  // console.log(result);

  return result;
};

export default normalizer;
