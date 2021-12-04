export const calculate = (name) =>
  ({
    budgets: (year, month) => (budgets) =>
      budgets
        .filter((budget) => budget.year === year && budget.month === month)
        .reduce((allBudgets, budget) => parseFloat(allBudgets + budget.amount), 0),
    objective: (expenses, monthQuantity) => expenses * monthQuantity,
    objectiveTime: (objective, savedMoney, recommendedEmergency) =>
      Math.ceil((objective - savedMoney) / recommendedEmergency) || 0,
  }[name] || (() => {}));
