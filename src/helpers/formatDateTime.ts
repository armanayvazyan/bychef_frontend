export function formatDateTime(dateStr: string, timeStr: string) {
  const today = new Date();
  const currentYear = today.getFullYear();

  const date = new Date(`${dateStr} ${currentYear} ${timeStr}`);

  // If the date has already passed this year, use next year
  if (date < today) {
    date.setFullYear(currentYear + 1);
  }

  // Format YYYY-MM-DDTHH:mm
  const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
  return `${formattedDate}T${timeStr}`;
}

export function formatDateTimeReverse(isoString: string) {
  const date = new Date(isoString);

  // Format date as "Month Day, Year"
  const formattedDate = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const [month, day, year] = formattedDate.split(" ");

  // Extract time in HH:mm format
  const formattedTime = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  return {
    month: month.toLowerCase(),
    day: parseInt(day.replace(",", ""), 10),
    year: parseInt(year, 10),
    time: formattedTime
  };
}