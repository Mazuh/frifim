export const calculateBudgets = (year, month) => (budgets) =>
  budgets
    .filter((budget) => budget.year === year && budget.month === month)
    .reduce((allBudgets, budget) => parseFloat(allBudgets + budget.amount), 0);

export const calculateObjective = (expenses, monthQuantity) => expenses * monthQuantity;

export const calculateObjectiveTime = (objective, savedMoney, recommendedEmergency) =>
  Math.ceil((objective - savedMoney) / recommendedEmergency) || 0;
