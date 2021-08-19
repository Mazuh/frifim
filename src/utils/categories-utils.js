import Decimal from 'decimal.js';
import groupBy from 'lodash.groupby';

export function groupIncomesAmountsByCategories(monthlyBudgetIncomes, weeklyBudgetIncomes) {
  const allBudgetIncomes = monthlyBudgetIncomes.concat(weeklyBudgetIncomes);

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
