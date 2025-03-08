import type { ETF, Transaction, TableColumns } from './types';

export const generateColumns = (eftData: ETF[]): TableColumns[] => {
  /**
   * columns = [
   *  { title: 'Date', dataIndex: 'date', key: 'date' },
   *  { title: 'IBIT', dataIndex: 'ibit', key: 'ibit' },
   *  { title: 'Total', dataIndex: 'total', key: 'total' },
   * ]
   */
  const columns = eftData.map(etf => ({
    title: etf.etf_symbol,
    dataIndex: etf.id.toString(),
    key: etf.id.toString(),
  }));

  const newColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date', fixed: 'left' },
    ...columns,
    { title: 'Total', dataIndex: 'total', key: 'total', fixed: 'right' },
  ];

  return newColumns;
};

export const generateDataSource = (_columns: TableColumns[], transactionData: Transaction[]) => {
  /**
   * dataSource = [
   *  { key: '1', date: '03 Jan 2025', IBIT: 100, FBTC: 200, BITB: 300, ARKB: 400, BTCO: 500, EZBC: 600, BRRR: 700, HODL: 800, BTCW: 900, GBTC: 1000, BTC: 1100, total: 6600 },
   * ]
   */

  // **1. Group data berdasarkan tanggal**
  const groupedData: Record<string, Record<string, number | string>> = {};

  transactionData.forEach(({ date, etf_id, amount }) => {
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = { date: formattedDate, total: 0 };
    }

    groupedData[formattedDate][etf_id] = ((groupedData[formattedDate][etf_id] || 0) as number) + amount;
    (groupedData[formattedDate]['total'] as number) += amount;
  });

  // **2. Konversi menjadi array sesuai format dataSource**
  const dataSource = Object.entries(groupedData)
    .sort(([dateA], [dateB]) => {
      // Konversi tanggal kembali ke format Date untuk sorting
      const dA = new Date(dateA.split(' ').reverse().join('-')); // "03 Jan 2025" → "2025-Jan-03"
      const dB = new Date(dateB.split(' ').reverse().join('-'));
      return dA.getTime() - dB.getTime(); // Ascending order
    })
    .map(([, row], index) => ({
      key: `${index + 1}`,
      ...row,
      total: Math.round((row.total as number) * 10) / 10,
    }));

  return dataSource;
};
