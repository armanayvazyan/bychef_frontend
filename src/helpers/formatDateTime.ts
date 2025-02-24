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