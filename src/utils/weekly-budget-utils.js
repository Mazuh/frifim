export function getWeekdaysOccurences(weekDayIndex) {
  const date = new Date();
  const month = date.getMonth();
  const weekDaysOccurences = [];

  // Set the first day of the current month
  date.setDate(1);

  // Set the first occurrence of the wanted weekday in the current month
  while (date.getDay() !== weekDayIndex) {
    date.setDate(date.getDate() + 1);
  }

  // Get all the occurences of the wanted weekday
  while (date.getMonth() === month) {
    weekDaysOccurences.push(new Date(date.getTime()));
    date.setDate(date.getDate() + 7);
  }

  return weekDaysOccurences.length;
}
