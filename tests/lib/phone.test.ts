import { describe, expect, it } from "vitest";
import {
  formatPhoneDisplay,
  isValidPhone,
  normalizePhone,
} from "@/lib/phone";

describe("phone utils", () => {
  it("formats national numbers with spaces", () => {
    expect(formatPhoneDisplay("7744153244")).toBe("774 415 3244");
    expect(formatPhoneDisplay("774")).toBe("774");
  });

  it("normalizes formatted national numbers to E.164", () => {
    expect(normalizePhone("774 415 3244")).toBe("+17744153244");
    expect(isValidPhone("774 415 3244")).toBe(true);
  });

  it("normalizes numbers pasted with country code", () => {
    expect(normalizePhone("+1 774 415 3244")).toBe("+17744153244");
    expect(normalizePhone("17744153244")).toBe("+17744153244");
  });
});
