import Decimal from 'decimal.js';
import { useSelector } from 'react-redux';
import { getWeekdaysOccurences } from '../weekly-budget/weekly-budget-calcs';
import { EXPENSE_TYPE, INCOME_TYPE } from '../categories/constants';

export default function useSelectorForMonthlyBudgetStatus() {
  const monthlyBudgetState = useSelector((state) => state.monthlyBudget);
  const weeklyBudgetState = useSelector((state) => state.weeklyBudget);

  const { totalEachWeeklyIncomes, totalEachWeeklyExpenses } = weeklyBudgetState.items.reduce(
    (acc, weeklyBudget) => {
      const weekDayOccurences = getWeekdaysOccurences(weeklyBudget);
      if (weeklyBudget.type === INCOME_TYPE.value) {
        acc.totalEachWeeklyIncomes = acc.totalEachWeeklyIncomes.plus(
          Decimal(weeklyBudget.amount).times(weekDayOccurences)
        );
      } else if (weeklyBudget.type === EXPENSE_TYPE.value) {
        acc.totalEachWeeklyExpenses = acc.totalEachWeeklyExpenses.plus(
          Decimal(weeklyBudget.amount).times(weekDayOccurences)
        );
      }

      return acc;
    },
    { totalEachWeeklyIncomes: Decimal(0), totalEachWeeklyExpenses: Decimal(0) }
  );

  const { onlyMonthlyIncomes, onlyMonthlyExpenses } = monthlyBudgetState.items.reduce(
    (acc, monthlyBudget) => {
      if (monthlyBudget.type === INCOME_TYPE.value) {
        acc.onlyMonthlyIncomes.push(monthlyBudget);
      } else if (monthlyBudget.type === EXPENSE_TYPE.value) {
        acc.onlyMonthlyExpenses.push(monthlyBudget);
      }

      return acc;
    },
    { onlyMonthlyIncomes: [], onlyMonthlyExpenses: [] }
  );

  return {
    weeklyBudgetState,
    ...monthlyBudgetState,
    items: null,
    monthlyBudgetSize: onlyMonthlyIncomes.length + onlyMonthlyExpenses.length,
    onlyMonthlyIncomes,
    totalEachWeeklyIncomes,
    totalWeeklyIncomes: totalEachWeeklyIncomes,
    onlyMonthlyExpenses,
    totalEachWeeklyExpenses,
    totalWeeklyExpenses: totalEachWeeklyExpenses,
    isLoading: monthlyBudgetState.isLoading || weeklyBudgetState.isLoading,
    isCreating: monthlyBudgetState.isCreating || weeklyBudgetState.isCreating,
    isReadingAll: monthlyBudgetState.isReadingAll || weeklyBudgetState.isReadingAll,
  };
}

export function getMonthlyCalcs(monthlySituation) {
  const monthlyCalcs = {
    total: Decimal(0),
    totalIncomes: Decimal(0),
    totalExpenses: Decimal(0),
  };

  monthlySituation.onlyMonthlyIncomes.forEach(({ amount }) => {
    monthlyCalcs.totalIncomes = monthlyCalcs.totalIncomes.plus(amount);
    monthlyCalcs.total = monthlyCalcs.total.plus(amount);
  });

  monthlyCalcs.totalIncomes = monthlyCalcs.totalIncomes.plus(monthlySituation.totalWeeklyIncomes);
  monthlyCalcs.total = monthlyCalcs.total.plus(monthlySituation.totalWeeklyIncomes);

  monthlySituation.onlyMonthlyExpenses.forEach(({ amount }) => {
    monthlyCalcs.totalExpenses = monthlyCalcs.totalExpenses.plus(amount);
    monthlyCalcs.total = monthlyCalcs.total.minus(amount);
  });

  monthlyCalcs.totalExpenses = monthlyCalcs.totalExpenses.plus(
    monthlySituation.totalWeeklyExpenses
  );
  monthlyCalcs.total = monthlyCalcs.total.minus(monthlySituation.totalWeeklyExpenses);

  return monthlyCalcs;
}
