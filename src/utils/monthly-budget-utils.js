export function generateMonthlyBudgetReport(header, incomes, expenses) {
  const incomesRows = incomes
    .map((i) => [i.name, 'Receita', i.amount, i.categoryName])
    .map((i) => i.join(','));
  const expensesRows = expenses
    .map((e) => [e.name, 'Despesa', e.amount, e.categoryName])
    .map((e) => e.join(','));

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    header +
    '\n' +
    incomesRows.join('\n') +
    '\n' +
    expensesRows.join('\n');

  return encodeURI(csvContent);
}
