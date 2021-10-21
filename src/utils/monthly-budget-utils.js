export function generateMonthlyBudgetCSV(header, incomes, expenses) {
  const incomesData = incomes.map((i) => [i.name, 'Receita', i.amount, i.categoryName]);
  const expensesData = expenses.map((e) => [e.name, 'Despesa', e.amount, e.categoryName]);

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
