import { type DataType } from './types';

interface DataItem {
  companyName: string;
  etfName: string;
  date: string
  formatedDate: Date;
  amount: number;
}

function convertStringToNumber(input: string): number {
  if (input.startsWith("(") && input.endsWith(")")) {
    const numberString = input.slice(1, -1);
    return -parseFloat(numberString);
  }
  if (input === "0.0") return 0;
  return parseFloat(input);
}

export function normalizer(data: DataType): DataItem[] {
  const result: DataItem[] = [];
  const [companyNames, etfNames] = data.header;

  data.body.forEach((bodyRow: string[]) => {
    const [date, ...values] = bodyRow;
    values.forEach((value, index) => {
      result.push({
        companyName: companyNames[index],
        etfName: etfNames[index],
        date,
        formatedDate: new Date(date), //UTC format
        amount: convertStringToNumber(`${value}`),
      });
    });
  });

  return result;
}
