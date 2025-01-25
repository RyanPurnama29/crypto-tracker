import { type DataType, type Transaction } from './types';

function convertStringToNumber(input: string): number {
  if (input.startsWith('(') && input.endsWith(')')) {
    const numberString = input.slice(1, -1);
    return -parseFloat(numberString);
  }
  if (input === '0.0' || input === '-') return 0;
  return parseFloat(input);
}

export function normalizer(data: DataType): Transaction[] {
  const result: Transaction[] = [];
  const [companyNames, etfNames] = data.header;

  data.body.forEach((bodyRow: string[]) => {
    const [date, ...values] = bodyRow;
    values.forEach((value, index) => {
      // Konversi tanggal ke UTC
      const localDate = new Date(date); // Tanggal dari input (local time)
      const utcDate = new Date(
        Date.UTC(
          localDate.getFullYear(),
          localDate.getMonth(),
          localDate.getDate(),
          localDate.getHours(),
          localDate.getMinutes(),
          localDate.getSeconds(),
          localDate.getMilliseconds(),
        ),
      );

      result.push({
        companyName: companyNames[index],
        etfSymbol: etfNames[index],
        date,
        formatedDate: utcDate,
        amount: convertStringToNumber(`${value}`),
      });
    });
  });

  return result;
}
