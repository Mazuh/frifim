import Decimal from 'decimal.js';
import groupBy from 'lodash.groupby';
import { getWeekdaysOccurences } from '../features/weekly-budget/weekly-budget-calcs';

export function groupAmountsByCategories(monthlyBudgetItems, weeklyBudgetItems) {
  const weeklyItemsTotals = weeklyBudgetItems.map((item) => {
    const amountInTheMonth = Decimal(item.amount).times(getWeekdaysOccurences(item));
    return { ...item, amount: amountInTheMonth };
  });
  const allBudgetItems = monthlyBudgetItems.concat(weeklyItemsTotals);

  const itemsGroupebByCategories = groupBy(allBudgetItems, (item) =>
    !item.category ? 'Sem categoria' : item.category
  );

  return Object.keys(itemsGroupebByCategories).reduce((groupedAmounts, categoryId) => {
    const categoryAmount = itemsGroupebByCategories[categoryId].reduce(
      (amount, item) => Decimal(amount).plus(item.amount).toFixed(2),
      0
    );
    groupedAmounts.push({ category: categoryId, amount: categoryAmount });
    return groupedAmounts;
  }, []);
}
