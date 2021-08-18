export function getWeekdaysOccurences(weekDayIndex) {
  const date = new Date();
  const month = date.getMonth();
  var weekDaysOccurences = 0;

  // Set the first day of the current month
  date.setDate(1);

  // Set the first occurrence of the wanted weekday in the current month
  while (date.getDay() !== weekDayIndex) {
    date.setDate(date.getDate() + 1);
  }

  // Get all the occurences of the wanted weekday
  while (date.getMonth() === month) {
    weekDaysOccurences += 1;
    date.setDate(date.getDate() + 7);
  }

  return weekDaysOccurences;
}
