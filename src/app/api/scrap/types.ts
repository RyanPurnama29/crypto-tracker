export interface DataType {
  header: string[][];
  body: string[][];
}

export interface Transaction {
  companyName: string;
  etfSymbol: string;
  date: string
  formatedDate: Date;
  amount: number;
}
