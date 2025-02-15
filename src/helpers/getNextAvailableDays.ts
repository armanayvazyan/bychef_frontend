function getNextAvailableDays(orderBefore: number, workingDays: number[], exceptionDays: string[] = []) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight

  const minOrderDate = new Date(today);
  minOrderDate.setDate(today.getDate() + orderBefore); // First available day

  const availableDays = [];
  const formatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" });

  const currentDate = new Date(minOrderDate);

  while (availableDays.length < 7) { // Collect exactly 7 available working days
    const formattedDate = currentDate.toLocaleDateString("sv-SE"); // Uses local time, keeps YYYY-MM-DD format

    if (
      workingDays.includes(currentDate.getDay()) &&
      !exceptionDays.includes(formattedDate)
    ) {
      availableDays.push(formatter.format(currentDate));
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return availableDays;
}

export default getNextAvailableDays;
