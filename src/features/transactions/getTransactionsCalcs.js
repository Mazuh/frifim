import Decimal from 'decimal.js';
import { INCOME_TYPE, EXPENSE_TYPE } from '../categories/constants';

export default function getTransactionsCalcs(transactionsItems) {
  return transactionsItems.reduce(
    (acc, transaction) => {
      if (transaction.type === INCOME_TYPE.value) {
        acc.totalIncomes = acc.totalIncomes.plus(transaction.amount);
        acc.total = acc.total.plus(transaction.amount);
      } else if (transaction.type === EXPENSE_TYPE.value) {
        acc.totalExpenses = acc.totalExpenses.plus(transaction.amount);
        acc.total = acc.total.minus(transaction.amount);
      }

      return acc;
    },
    { total: Decimal(0), totalIncomes: Decimal(0), totalExpenses: Decimal(0) }
  );
}
