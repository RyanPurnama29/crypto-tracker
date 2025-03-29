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

export const dynamic = `force-dynamic`; // disable pre-rendering

const Crypto = async () => {
  const etfData = getEtf();
  const transactionData = getTransaction();
  const [etf, transaction] = await Promise.all([etfData, transactionData]);
  const columns = generateColumns(etf);
  const dataSource = generateDataSource(columns, transaction);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Bitcoin ETF</h1>
      <p className="text-gray-600 mb-6 max-w-3xl">
        A Bitcoin Exchange-Traded Fund (ETF) is an investment product traded on stock exchanges that tracks the price of
        Bitcoin. It allows investors to gain exposure to Bitcoin`s price movements without needing to directly own or
        store the cryptocurrency. The data below shows real-time fund inflows and outflows related to Bitcoin ETFs.
      </p>
      <Table columns={columns} dataSource={dataSource} pagination={false} scroll={{ x: 'max-content' }} />
    </div>
  );
};

export default Crypto;
