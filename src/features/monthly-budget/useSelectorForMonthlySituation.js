import Decimal from "decimal.js";
import { useSelector } from "react-redux";
import { EXPENSE_TYPE, INCOME_TYPE } from "../categories/constants";

export default function useSelectorForMonthlySituation() {
  const monthlyBudgetState = useSelector(state => state.monthlyBudget);
  const weeklyBudgetState = useSelector(state => state.weeklyBudget);

  const { totalWeeklyIncomes, totalWeeklyExpenses } = weeklyBudgetState.items.reduce((acc, weeklyBudget) => {
    if (weeklyBudget.type === INCOME_TYPE.value) {
      acc.totalWeeklyIncomes = acc.totalWeeklyIncomes.plus(weeklyBudget.amount);
    } else if (weeklyBudget.type === EXPENSE_TYPE.value) {
      acc.totalWeeklyExpenses = acc.totalWeeklyExpenses.plus(weeklyBudget.amount);
    }

    return acc;
  }, { totalWeeklyIncomes: Decimal(0), totalWeeklyExpenses: Decimal(0) });

  const { onlyMonthlyIncomes, onlyMonthlyExpenses } = monthlyBudgetState.items.reduce((acc, monthlyBudget) => {
    if (monthlyBudget.type === INCOME_TYPE.value) {
      acc.onlyMonthlyIncomes.push(monthlyBudget);
    } else if (monthlyBudget.type === EXPENSE_TYPE.value) {
      acc.onlyMonthlyExpenses.push(monthlyBudget);
    }

    return acc;
  }, { onlyMonthlyIncomes: [], onlyMonthlyExpenses: [] });

  return {
    ...monthlyBudgetState,
    weeklyBudgetState,
    onlyMonthlyIncomes,
    totalWeeklyIncomes,
    onlyMonthlyExpenses,
    totalWeeklyExpenses,
    items: null,
    isLoading: monthlyBudgetState.isLoading || weeklyBudgetState.isLoading,
    isCreating: monthlyBudgetState.isCreating || weeklyBudgetState.isCreating,
    isReadingAll: monthlyBudgetState.isReadingAll || weeklyBudgetState.isReadingAll,
  };
}
