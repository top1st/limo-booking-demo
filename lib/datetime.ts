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
