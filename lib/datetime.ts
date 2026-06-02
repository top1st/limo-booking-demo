export function formatDateDisplay(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");

  if (!year || !month || !day) {
    return "";
  }

  return `${month}/${day}/${year}`;
}

export function formatTimeDisplay(time24: string): string {
  const [hoursStr, minutes] = time24.split(":");

  if (!hoursStr || minutes === undefined) {
    return "";
  }

  const hours24 = Number.parseInt(hoursStr, 10);

  if (Number.isNaN(hours24)) {
    return "";
  }

  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${hours12.toString().padStart(2, "0")}:${minutes} ${period}`;
}

export function parseIsoDate(iso: string): {
  year: number;
  month: number;
  day: number;
} | null {
  const [yearStr, monthStr, dayStr] = iso.split("-");
  const year = Number.parseInt(yearStr ?? "", 10);
  const month = Number.parseInt(monthStr ?? "", 10);
  const day = Number.parseInt(dayStr ?? "", 10);

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  return { year, month, day };
}

export function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

export function parseTime24(time: string): { hours: number; minutes: number } | null {
  const [hoursStr, minutesStr] = time.split(":");
  const hours = Number.parseInt(hoursStr ?? "", 10);
  const minutes = Number.parseInt(minutesStr ?? "", 10);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return { hours, minutes };
}

export function toTime24(hours: number, minutes: number): string {
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function to12Hour(hours24: number): { hour12: number; period: "AM" | "PM" } {
  const period = hours24 >= 12 ? "PM" : "AM";
  const hour12 = hours24 % 12 || 12;
  return { hour12, period };
}

export function to24Hour(hour12: number, period: "AM" | "PM"): number {
  if (period === "AM") {
    return hour12 === 12 ? 0 : hour12;
  }

  return hour12 === 12 ? 12 : hour12 + 12;
}

export function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function isoDateFromDate(date: Date): string {
  return toIsoDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function compareIsoDate(a: string, b: string): number {
  const parsedA = parseIsoDate(a);
  const parsedB = parseIsoDate(b);

  if (!parsedA || !parsedB) {
    return 0;
  }

  const dateA = new Date(parsedA.year, parsedA.month - 1, parsedA.day);
  const dateB = new Date(parsedB.year, parsedB.month - 1, parsedB.day);

  return dateA.getTime() - dateB.getTime();
}

export interface CalendarCell {
  iso: string | null;
  day: number | null;
  inMonth: boolean;
}

export function getCalendarCells(year: number, month: number): CalendarCell[] {
  const firstOfMonth = new Date(year, month - 1, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: CalendarCell[] = [];

  for (let i = 0; i < 42; i++) {
    const dayIndex = i - startOffset + 1;

    if (dayIndex < 1 || dayIndex > daysInMonth) {
      cells.push({ iso: null, day: null, inMonth: false });
      continue;
    }

    cells.push({
      iso: toIsoDate(year, month, dayIndex),
      day: dayIndex,
      inMonth: true,
    });
  }

  return cells;
}

export const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

export const HOURS_12 = Array.from({ length: 12 }, (_, index) =>
  (index + 1).toString().padStart(2, "0"),
);

export const MINUTES_60 = Array.from({ length: 60 }, (_, index) =>
  index.toString().padStart(2, "0"),
);

export const PERIODS = ["AM", "PM"] as const;
