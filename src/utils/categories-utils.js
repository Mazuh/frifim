import Decimal from 'decimal.js';
import groupBy from 'lodash.groupby';
import { getWeekdaysOccurences } from './weekly-budget-utils';

export function groupIncomesAmountsByCategories(monthlyBudgetIncomes, weeklyBudgetIncomes) {
  const weeklyIncomesTotals = weeklyBudgetIncomes.map((income) => {
    const amountInTheMonth = Decimal(income.amount).times(getWeekdaysOccurences(income.day));
    return { ...income, amount: amountInTheMonth };
  });
  const allBudgetIncomes = monthlyBudgetIncomes.concat(weeklyIncomesTotals);

  const incomesGroupebByCategories = groupBy(allBudgetIncomes, 'category');

  return Object.keys(incomesGroupebByCategories).reduce((groupedAmounts, categoryId) => {
    const categoryAmount = incomesGroupebByCategories[categoryId].reduce(
      (amount, income) => Decimal(amount).plus(income.amount).toFixed(2),
      0
    );
    groupedAmounts[categoryId] = categoryAmount;
    return groupedAmounts;
  }, {});
}
