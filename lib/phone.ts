import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) {
    return "";
  }

  try {
    const parsed = parsePhoneNumberFromString(trimmed);
    if (parsed?.isValid()) {
      return parsed.format("E.164");
    }
  } catch {
    // fall through to digit normalization
  }

  const digits = trimmed.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  if (trimmed.startsWith("+")) {
    return `+${digits}`;
  }

  return digits ? `+${digits}` : "";
}

export function formatPhoneDisplay(phone: string): string {
  const trimmed = phone.trim();

  try {
    const parsed = parsePhoneNumberFromString(trimmed);
    if (parsed?.isValid()) {
      const national = parsed.formatNational();
      return national.replace(/^\+\d+\s*/, "").trim();
    }
  } catch {
    // fall through
  }

  const digits = trimmed.replace(/\D/g, "");
  const national =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (national.length <= 3) {
    return national;
  }

  if (national.length <= 6) {
    return `${national.slice(0, 3)} ${national.slice(3)}`;
  }

  return `${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6, 10)}`;
}

export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    return false;
  }

  if (isValidPhoneNumber(normalized) || isPossiblePhoneNumber(normalized)) {
    return true;
  }

  // Demo seed uses US 555 numbers that libphonenumber may reject as fictitious
  return /^\+1\d{10}$/.test(normalized);
}
