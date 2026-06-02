"use client";

import {
  CalendarIcon,
  ClockIcon,
  FieldIcon,
  PickerChevronIcon,
} from "@/components/ui/FieldIcons";
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
      <label htmlFor={inputId} className="input-label">
        {label}
      </label>
      <div className="flex items-center">
        <FieldIcon>{icon}</FieldIcon>
        <button
          type="button"
          onClick={() => openPicker(inputRef.current)}
          className="flex min-w-0 flex-1 items-center px-2 py-3 text-left text-sm text-foreground"
        >
          {displayValue}
        </button>
        <button
          type="button"
          onClick={() => openPicker(inputRef.current)}
          className="datetime-picker-trigger"
          aria-label={`Open ${label.toLowerCase()} picker`}
        >
          <PickerChevronIcon />
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
        className={`input-shell flex divide-x ${
          hasError ? "input-shell--error divide-error" : "divide-border"
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
