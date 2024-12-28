interface DataItem {
  companyName: string;
  etfName: string;
  date: string;
  value: string;
}

export function normalizer(data: any): DataItem[] {
  const result: DataItem[] = [];
  const [companyNames, etfNames] = data.header;

  data.body.forEach((bodyRow: string[]) => {
    const [date, ...values] = bodyRow;
    values.forEach((value, index) => {
      result.push({
        companyName: companyNames[index],
        etfName: etfNames[index],
        date,
        value: `${value}`,
      });
    });
  });

  return result;
}
