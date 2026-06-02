import { describe, expect, it } from "vitest";
import {
  compareIsoDate,
  formatDateDisplay,
  formatTimeDisplay,
  getCalendarCells,
  to24Hour,
  toTime24,
} from "@/lib/datetime";

describe("datetime formatters", () => {
  it("formats ISO date as MM/DD/YYYY", () => {
    expect(formatDateDisplay("2026-06-02")).toBe("06/02/2026");
  });

  it("formats 24-hour time as 12-hour with AM/PM", () => {
    expect(formatTimeDisplay("15:00")).toBe("03:00 PM");
    expect(formatTimeDisplay("09:30")).toBe("09:30 AM");
    expect(formatTimeDisplay("00:00")).toBe("12:00 AM");
  });

  it("builds calendar cells for a month", () => {
    const cells = getCalendarCells(2026, 6).filter((cell) => cell.inMonth);
    expect(cells).toHaveLength(30);
    expect(cells[0]?.iso).toBe("2026-06-01");
  });

  it("converts 12-hour selections to 24-hour storage", () => {
    expect(to24Hour(3, "PM")).toBe(15);
    expect(toTime24(15, 30)).toBe("15:30");
  });

  it("compares ISO dates", () => {
    expect(compareIsoDate("2026-06-02", "2026-06-03")).toBeLessThan(0);
  });
});
