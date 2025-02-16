export interface ETF {
  id: number;
  etf_symbol: string;
  etf_name: string;
  crypto_name: string;
  crypto_symbol: string;
  company_name: string;
}

export interface Transaction {
  id: number;
  etf_id: number;
  amount: number;
  date: string;
}

export interface TableColumns {
  title: string;
  dataIndex: string;
  key: string;
}
