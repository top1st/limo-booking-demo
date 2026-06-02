import { describe, expect, it } from "vitest";
import { formatDateDisplay, formatTimeDisplay } from "@/lib/datetime";

describe("datetime formatters", () => {
  it("formats ISO date as MM/DD/YYYY", () => {
    expect(formatDateDisplay("2026-06-02")).toBe("06/02/2026");
  });

  it("formats 24-hour time as 12-hour with AM/PM", () => {
    expect(formatTimeDisplay("15:00")).toBe("03:00 PM");
    expect(formatTimeDisplay("09:30")).toBe("09:30 AM");
    expect(formatTimeDisplay("00:00")).toBe("12:00 AM");
  });
});
