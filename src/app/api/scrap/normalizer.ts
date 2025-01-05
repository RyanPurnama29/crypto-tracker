import { type DataType, type Transaction } from './types';

function convertStringToNumber(input: string): number {
  if (input.startsWith("(") && input.endsWith(")")) {
    const numberString = input.slice(1, -1);
    return -parseFloat(numberString);
  }
  if (input === "0.0" || input === "-") return 0;
  return parseFloat(input);
}

export function normalizer(data: DataType): Transaction[] {
  const result: Transaction[] = [];
  const [companyNames, etfNames] = data.header;

  data.body.forEach((bodyRow: string[]) => {
    const [date, ...values] = bodyRow;
    values.forEach((value, index) => {
      result.push({
        companyName: companyNames[index],
        etfSymbol: etfNames[index],
        date,
        formatedDate: new Date(date), //UTC format
        amount: convertStringToNumber(`${value}`),
      });
    });
  });

  return result;
}
