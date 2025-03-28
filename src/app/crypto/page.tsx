import { Table } from 'antd';
import { generateColumns, generateDataSource } from './normalize-table';

async function getEtf() {
  const res = await fetch(`https://bitdex.id/api/get/etf`);
  return res.json();
}

async function getTransaction() {
  const res = await fetch(`https://bitdex.id/api/get/transaction`);
  return res.json();
}

export const dynamic = 'force-dynamic'; // disable pre-rendering

const Crypto = async () => {
  const etfData = getEtf();
  const transactionData = getTransaction();
  const [etf, transaction] = await Promise.all([etfData, transactionData]);
  const columns = generateColumns(etf);
  const dataSource = generateDataSource(columns, transaction);

  return (
    <div className="p-6">
      <h1>Bitcoin ETF</h1>
      <Table columns={columns} dataSource={dataSource} pagination={false} scroll={{ x: 'max-content' }} />
    </div>
  );
};

export default Crypto;
