export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  if (phone.trim().startsWith("+")) {
    return `+${digits}`;
  }

  return digits ? `+${digits}` : "";
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
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
  return /^\+1\d{10}$/.test(normalized);
}
