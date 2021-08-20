export function getWeekdaysOccurences(weeklyBudget) {
  // Set the first day of the budget month
  const date = new Date();
  date.setDate(1);
  date.setMonth(weeklyBudget.month);
  date.setYear(weeklyBudget.year);

  const month = date.getMonth();

  let weekDaysOccurences = 0;

  // Set the first occurrence of the wanted weekday in the budget month
  while (date.getDay() !== weeklyBudget.day) {
    date.setDate(date.getDate() + 1);
  }

  // Get all the occurences of the wanted weekday
  while (date.getMonth() === month) {
    weekDaysOccurences += 1;
    date.setDate(date.getDate() + 7);
  }

  return weekDaysOccurences;
}
