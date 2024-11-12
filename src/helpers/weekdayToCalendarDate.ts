const dayOfWeekAsString = (dayIndex: number) => {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex] || "";
};

const weekdaysToCalendarDate = (targetWeekdays: number[]) => {
  const today = new Date();
  const currentWeekday = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Calculate the date for each target weekday, and return as an array of objects
  const dates = targetWeekdays.map(targetWeekday => {
    const daysUntilTarget = (targetWeekday - currentWeekday + 7) % 7;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);

    // Format the date as "Month Day" (e.g., "August 18")
    const formattedDate = targetDate.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    return { weekdayNum: targetWeekday, weekday: dayOfWeekAsString(targetWeekday), date: formattedDate, targetDate };
  });

  // Sort dates by the number of days until each target weekday from today
  dates.sort((a, b) => Number(a.targetDate) - Number(b.targetDate));

  // Return an array of formatted date strings in sorted order
  return dates.map(item => ({ day: item.date, weekday: item.weekday, weekdayNum: item.weekdayNum }));
};

export default weekdaysToCalendarDate;