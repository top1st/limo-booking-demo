"use client";

import { InputHTMLAttributes, useEffect, useRef } from "react";
import { formatPhoneDisplay } from "@/lib/phone";

interface PhoneInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  prefix?: React.ReactNode;
}

function extractDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

function countDigitsBeforeIndex(formatted: string, index: number): number {
  let count = 0;

  for (let i = 0; i < index && i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      count++;
    }
  }

  return count;
}

function cursorAfterDigitIndex(formatted: string, digitIndex: number): number {
  if (digitIndex <= 0) {
    return 0;
  }

  let count = 0;

  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      count++;
      if (count === digitIndex) {
        return i + 1;
      }
    }
  }

  return formatted.length;
}

function setFormattedValue(
  input: HTMLInputElement,
  digits: string,
  cursorDigitIndex: number,
  onChange: (value: string) => void,
) {
  const formatted = formatPhoneDisplay(digits);
  onChange(formatted);

  requestAnimationFrame(() => {
    const nextCursor = cursorAfterDigitIndex(
      formatted,
      Math.min(cursorDigitIndex, digits.length),
    );
    input.setSelectionRange(nextCursor, nextCursor);
  });
}

export function PhoneInput({
  value,
  onChange,
  prefix,
  onBlur,
  onKeyDown,
  className = "",
  ...props
}: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previousDigitsRef = useRef(extractDigits(value));

  useEffect(() => {
    previousDigitsRef.current = extractDigits(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const previousDigits = previousDigitsRef.current;
    const nextDigits = extractDigits(input.value);
    const selectionStart = input.selectionStart ?? nextDigits.length;

    previousDigitsRef.current = nextDigits;

    let cursorDigitIndex = countDigitsBeforeIndex(input.value, selectionStart);

    if (nextDigits.length < previousDigits.length) {
      cursorDigitIndex = Math.min(cursorDigitIndex, nextDigits.length);
    }

    setFormattedValue(input, nextDigits, cursorDigitIndex, onChange);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }

    const input = event.currentTarget;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    if (start !== end) {
      return;
    }

    const currentDigits = extractDigits(value);

    if (event.key === "Backspace" && start > 0 && value[start - 1] === " ") {
      event.preventDefault();
      const digitIndex = countDigitsBeforeIndex(value, start);

      if (digitIndex > 0) {
        const nextDigits =
          currentDigits.slice(0, digitIndex - 1) +
          currentDigits.slice(digitIndex);
        previousDigitsRef.current = nextDigits;
        setFormattedValue(input, nextDigits, digitIndex - 1, onChange);
      }

      return;
    }

    if (
      event.key === "Delete" &&
      start < value.length &&
      value[start] === " "
    ) {
      event.preventDefault();
      const digitIndex = countDigitsBeforeIndex(value, start);

      if (digitIndex < currentDigits.length) {
        const nextDigits =
          currentDigits.slice(0, digitIndex) +
          currentDigits.slice(digitIndex + 1);
        previousDigitsRef.current = nextDigits;
        setFormattedValue(input, nextDigits, digitIndex, onChange);
      }
    }
  };

  return (
    <div className="flex items-center">
      {prefix}
      <input
        {...props}
        ref={inputRef}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        className={`w-full bg-transparent py-3 pr-3 text-sm text-foreground outline-none placeholder:text-gray-400 ${className}`}
      />
    </div>
  );
}
