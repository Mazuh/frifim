import Decimal from "decimal.js";
import { useSelector } from "react-redux";
import { EXPENSE_TYPE, INCOME_TYPE } from "../categories/constants";

export default function useSelectorForMonthlyBudgetStatus() {
  const monthlyBudgetState = useSelector(state => state.monthlyBudget);
  const weeklyBudgetState = useSelector(state => state.weeklyBudget);

  const { totalEachWeeklyIncomes, totalEachWeeklyExpenses } = weeklyBudgetState.items.reduce((acc, weeklyBudget) => {
    if (weeklyBudget.type === INCOME_TYPE.value) {
      acc.totalEachWeeklyIncomes = acc.totalEachWeeklyIncomes.plus(weeklyBudget.amount);
    } else if (weeklyBudget.type === EXPENSE_TYPE.value) {
      acc.totalEachWeeklyExpenses = acc.totalEachWeeklyExpenses.plus(weeklyBudget.amount);
    }

    return acc;
  }, { totalEachWeeklyIncomes: Decimal(0), totalEachWeeklyExpenses: Decimal(0) });

  const { onlyMonthlyIncomes, onlyMonthlyExpenses } = monthlyBudgetState.items.reduce((acc, monthlyBudget) => {
    if (monthlyBudget.type === INCOME_TYPE.value) {
      acc.onlyMonthlyIncomes.push(monthlyBudget);
    } else if (monthlyBudget.type === EXPENSE_TYPE.value) {
      acc.onlyMonthlyExpenses.push(monthlyBudget);
    }

    return acc;
  }, { onlyMonthlyIncomes: [], onlyMonthlyExpenses: [] });

  return {
    weeklyBudgetState,
    ...monthlyBudgetState,
    items: null,
    onlyMonthlyIncomes,
    totalEachWeeklyIncomes,
    totalWeeklyIncomes: totalEachWeeklyIncomes.times(4),
    onlyMonthlyExpenses,
    totalEachWeeklyExpenses,
    totalWeeklyExpenses: totalEachWeeklyIncomes.times(4),
    isLoading: monthlyBudgetState.isLoading || weeklyBudgetState.isLoading,
    isCreating: monthlyBudgetState.isCreating || weeklyBudgetState.isCreating,
    isReadingAll: monthlyBudgetState.isReadingAll || weeklyBudgetState.isReadingAll,
  };
}

export function getMonthlyCalcs(monthlySituation) {
  const monthlyCalcs = {
    total: Decimal(0),
    subtotalIncomes: Decimal(0),
    subtotalExpenses: Decimal(0),
  };

  monthlySituation.onlyMonthlyIncomes.forEach(({ amount }) => {
    monthlyCalcs.subtotalIncomes = monthlyCalcs.subtotalIncomes.plus(amount);
    monthlyCalcs.total = monthlyCalcs.total.plus(amount);
  });

  monthlyCalcs.subtotalIncomes = monthlyCalcs.subtotalIncomes.plus(monthlySituation.totalWeeklyIncomes);
  monthlyCalcs.total = monthlyCalcs.total.plus(monthlySituation.totalWeeklyIncomes);

  monthlySituation.onlyMonthlyExpenses.forEach(({ amount }) => {
    monthlyCalcs.subtotalExpenses = monthlyCalcs.subtotalExpenses.plus(amount);
    monthlyCalcs.total = monthlyCalcs.total.minus(amount);
  });

  monthlyCalcs.subtotalExpenses = monthlyCalcs.subtotalExpenses.plus(monthlySituation.totalWeeklyExpenses);
  monthlyCalcs.total = monthlyCalcs.total.minus(monthlySituation.totalWeeklyExpenses);

  return monthlyCalcs;
}
