import Decimal from 'decimal.js';

export const calculateObjective = (expenses, monthQuantity) =>
  Decimal(expenses).times(monthQuantity).toString();

export const calculateObjectiveTime = (objective, savedMoney, recommendedEmergency) =>
  Decimal(objective || 0)
    .minus(savedMoney || 0)
    .dividedBy(recommendedEmergency || 0)
    .ceil()
    .toString();
