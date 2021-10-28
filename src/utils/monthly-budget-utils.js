export function generateMonthlyBudgetCSV(header, incomesData, expensesData) {
  const headerRow = header.join(',');
  const incomesRows = incomesData.length
    ? `\n${incomesData.map((i) => i.map((it) => `"${it}"`).join(',')).join('\n')}`
    : '';
  const expensesRows = expensesData.length
    ? `\n${expensesData.map((i) => i.map((it) => `"${it}"`).join(',')).join('\n')}`
    : '';

  const csvContent = `data:text/csv;charset=utf-8,sep=,\n${headerRow}${incomesRows}${expensesRows}`;

  return encodeURI(csvContent);
}
