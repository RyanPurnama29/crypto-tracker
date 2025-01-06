async function getEtf() {
  const res = await fetch(`http://localhost:3000/api/get/etf`);
  return res.json()
}

async function getTransaction() {
  const res = await fetch(`http://localhost:3000/api/get/transaction`);
  return res.json()
}

const Crypto = async () => {
  const etfData = getEtf();
  const transactionData = getTransaction();
  const [etf, transaction] = await Promise.all([etfData, transactionData]);

  return (
    <div>
      <h1>ETF</h1>
      <pre>{JSON.stringify(etf, null, 2)}</pre>
      <h1>Transaction</h1>
      <pre>{JSON.stringify(transaction, null, 2)}</pre>
    </div>
  );
};

export default Crypto;
