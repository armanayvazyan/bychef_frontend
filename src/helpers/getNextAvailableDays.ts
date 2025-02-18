import { IChefAvailableDates } from "@/types";

function generateTimeSlots(timeFrom: string, timeTo: string) {
  const slots = [];
  const startTime = new Date(`1970-01-01T${timeFrom}Z`);
  const endTime = new Date(`1970-01-01T${timeTo}Z`);

  while (startTime < endTime) {
    slots.push(startTime.toISOString().substring(11, 16)); // Format HH:mm
    startTime.setMinutes(startTime.getMinutes() + 30);
  }

  return slots;
}

function getNextAvailableDays(orderBefore: number, workingDays: IChefAvailableDates[], exceptionDays: string[] = []) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight

  const minOrderDate = new Date(today);
  minOrderDate.setDate(today.getDate() + orderBefore); // First available day

  const availableDays = workingDays
    .filter((dateObj) => {
      const date = new Date(dateObj.date);
      return date >= minOrderDate && !exceptionDays.includes(dateObj.date);
    })
    // @ts-expect-error no need for mentioned types
    .sort((a: IChefAvailableDates, b: IChefAvailableDates) => new Date(a.date) - new Date(b.date))
    .map(({ date: dateStr, timeFrom, timeTo }) => {
      const date = new Date(dateStr);
      return {
        date: new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(date),
        time: generateTimeSlots(timeFrom, timeTo)
      };
    });

  return availableDays;
}

export default getNextAvailableDays;
