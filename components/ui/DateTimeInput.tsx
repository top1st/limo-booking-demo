"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { useRef } from "react";
import { formatDateDisplay, formatTimeDisplay } from "@/lib/datetime";
import type { BookingFormValues } from "@/lib/validation";

interface DateTimeFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type: "date" | "time";
  icon: React.ReactNode;
}

function openPicker(input: HTMLInputElement | null) {
  if (!input) {
    return;
  }

  input.focus();

  if (typeof input.showPicker === "function") {
    input.showPicker();
  } else {
    input.click();
  }
}

function DateTimeField({
  label,
  value,
  onChange,
  onBlur,
  type,
  icon,
}: DateTimeFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = `${label.toLowerCase()}-input`;
  const displayValue =
    type === "date" ? formatDateDisplay(value) : formatTimeDisplay(value);

  return (
    <div className="relative flex-1">
      <label
        htmlFor={inputId}
        className="absolute -top-2 left-3 z-10 bg-white px-1 text-xs text-muted"
      >
        {label}
      </label>
      <div className="flex items-center">
        <span className="pl-3 text-muted [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        <button
          type="button"
          onClick={() => openPicker(inputRef.current)}
          className="flex min-w-0 flex-1 items-center px-3 py-3 text-left text-sm text-foreground"
        >
          {displayValue}
        </button>
        <button
          type="button"
          onClick={() => openPicker(inputRef.current)}
          className="pr-3 text-muted [&>svg]:h-4 [&>svg]:w-4"
          aria-label={`Open ${label.toLowerCase()} picker`}
        >
          {icon}
        </button>
        <input
          ref={inputRef}
          id={inputId}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 6h12M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

interface PickupDateTimeFieldsProps {
  control: Control<BookingFormValues>;
  errors: FieldErrors<BookingFormValues>;
}

export function PickupDateTimeFields({ control, errors }: PickupDateTimeFieldsProps) {
  const dateError = errors.pickupDate?.message;
  const timeError = errors.pickupTime?.message;
  const hasError = Boolean(dateError || timeError);

  return (
    <div>
      <div
        className={`flex divide-x rounded-md border bg-white ${
          hasError
            ? "divide-error border-error"
            : "divide-border border-border focus-within:border-accent"
        }`}
      >
        <Controller
          name="pickupDate"
          control={control}
          render={({ field }) => (
            <DateTimeField
              label="Date"
              type="date"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            icon={<CalendarIcon />}
            />
          )}
        />
        <Controller
          name="pickupTime"
          control={control}
          render={({ field }) => (
            <DateTimeField
              label="Time"
              type="time"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            icon={<ClockIcon />}
            />
          )}
        />
      </div>
      {dateError || timeError ? (
        <p className="mt-1 text-xs text-error">{dateError ?? timeError}</p>
      ) : null}
    </div>
  );
}
