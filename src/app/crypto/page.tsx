import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import normalizer from './normalizer';
import type { ETFTable } from './types';

async function getEtf() {
  const res = await fetch(`http://localhost:3000/api/get/etf`);
  return res.json();
}

async function getTransaction() {
  const res = await fetch(`http://localhost:3000/api/get/transaction`);
  return res.json();
}

const Crypto: React.FC<ETFTable> = async () => {
  const etfData = getEtf();
  const transactionData = getTransaction();
  const [etf, transaction] = await Promise.all([etfData, transactionData]);
  const etfTable = normalizer(etf, transaction);
  const columns = ['date', ...new Set(etfTable.flatMap(row => Object.keys(row)).filter(key => key !== 'date'))];

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-8">Bitcoin ETF</h1>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead key={column}>{column.toUpperCase()}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {etfTable.map((row, index) => (
            <TableRow key={index}>
              {columns.map(column => {
                const value = row[column] || '-';
                return <TableCell key={column}>{value}</TableCell>;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Crypto;
