import Decimal from 'decimal.js';

export const calculateBudgets = (year, month) => (budgets) =>
  budgets
    .filter((budget) => budget.year === year && budget.month === month)
    .reduce((allBudgets, budget) => Decimal(allBudgets).plus(budget.amount), 0)
    .toString();

export const calculateObjective = (expenses, monthQuantity) => expenses * monthQuantity;

export const calculateObjectiveTime = (objective, savedMoney, recommendedEmergency) =>
  Decimal(objective || 0)
    .minus(savedMoney || 0)
    .dividedBy(recommendedEmergency || 0)
    .ceil()
    .toString();
