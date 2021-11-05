import Decimal from 'decimal.js';
import get from 'lodash.get';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { ProjectContext } from '../../app/contexts';
import { getWeekdaysOccurences } from '../weekly-budget/weekly-budget-calcs';
import { EXPENSE_TYPE, INCOME_TYPE } from '../categories/constants';

export default function useSelectorForMonthlyBudgetStatus() {
  const monthlyBudgetState = useSelector((state) => state.monthlyBudget);
  const weeklyBudgetState = useSelector((state) => state.weeklyBudget);

  const projectContext = useContext(ProjectContext);
  const selectedProjectUuid = get(projectContext, 'uuid', '');
  const project = useSelector((state) =>
    state.projects.items.find((it) => it.uuid === selectedProjectUuid)
  );
  const emergencySavingValue = get(project, 'emergencySaving', '');

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

  if (emergencySavingValue) {
    onlyMonthlyExpenses.push({
      uuid: 'emergency-value',
      name: `Reserva de emergência`,
      tooltip: 'Valor destinado à reserva de emergência.',
      amount: emergencySavingValue,
      isReadOnly: true,
    });
  }

  const { onlyWeeklyIncomes, onlyWeeklyExpenses } = weeklyBudgetState.items.reduce(
    (acc, weeklyBudget) => {
      if (weeklyBudget.type === INCOME_TYPE.value) {
        acc.onlyWeeklyIncomes.push(weeklyBudget);
      } else if (weeklyBudget.type === EXPENSE_TYPE.value) {
        acc.onlyWeeklyExpenses.push(weeklyBudget);
      }

      return acc;
    },
    { onlyWeeklyIncomes: [], onlyWeeklyExpenses: [] }
  );

  return {
    weeklyBudgetState,
    ...monthlyBudgetState,
    items: null,
    monthlyBudgetSize: onlyMonthlyIncomes.length + onlyMonthlyExpenses.length,
    onlyMonthlyIncomes,
    onlyWeeklyIncomes,
    totalEachWeeklyIncomes,
    totalWeeklyIncomes: totalEachWeeklyIncomes,
    onlyMonthlyExpenses,
    onlyWeeklyExpenses,
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
