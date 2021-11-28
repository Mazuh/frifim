import useSelectorForMonthlyBudgetStatus from "../monthly-budget/useSelectorForMonthlyBudgetStatus";

const useSelectEmergencySaving = () => {
  const monthlySituation = useSelectorForMonthlyBudgetStatus();
  const {
    onlyMonthlyExpenses,
    onlyMonthlyIncomes,
    emergencySaving
  } = monthlySituation;

  const shouldSave = onlyMonthlyExpenses.length > 0
    && onlyMonthlyIncomes.length > 0
    && emergencySaving <= 0;

  return shouldSave;
}

export default useSelectEmergencySaving;