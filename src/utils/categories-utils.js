import Decimal from 'decimal.js';
import groupBy from 'lodash.groupby';
import { getWeekdaysOccurences } from '../features/weekly-budget/weekly-budget-calcs';

export function groupIncomesAmountsByCategories(monthlyBudgetIncomes, weeklyBudgetIncomes) {
  const weeklyIncomesTotals = weeklyBudgetIncomes.map((income) => {
    const amountInTheMonth = Decimal(income.amount).times(getWeekdaysOccurences(income));
    return { ...income, amount: amountInTheMonth };
  });
  const allBudgetIncomes = monthlyBudgetIncomes.concat(weeklyIncomesTotals);

  const incomesGroupebByCategories = groupBy(allBudgetIncomes, 'category');

  return Object.keys(incomesGroupebByCategories).reduce((groupedAmounts, categoryId) => {
    const categoryAmount = incomesGroupebByCategories[categoryId].reduce(
      (amount, income) => Decimal(amount).plus(income.amount).toFixed(2),
      0
    );
    groupedAmounts.push({ category: categoryId, amount: categoryAmount });
    return groupedAmounts;
  }, []);
}

export function groupExpensesAmountsByCategories(monthlyBudgetExpenses, weeklyBudgetExpenses) {
  const weeklyExpensesTotals = weeklyBudgetExpenses.map((expense) => {
    const amountInTheMonth = Decimal(expense.amount).times(getWeekdaysOccurences(expense));
    return { ...expense, amount: amountInTheMonth };
  });
  const allBudgetExpenses = monthlyBudgetExpenses.concat(weeklyExpensesTotals);

  const expensesGroupebByCategories = groupBy(allBudgetExpenses, 'category');

  return Object.keys(expensesGroupebByCategories).reduce((groupedAmounts, categoryId) => {
    const categoryAmount = expensesGroupebByCategories[categoryId].reduce(
      (amount, expense) => Decimal(amount).plus(expense.amount).toFixed(2),
      0
    );
    groupedAmounts.push({ category: categoryId, amount: categoryAmount });
    return groupedAmounts;
  }, []);
}
