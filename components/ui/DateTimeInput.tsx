"use client";

import {
  CalendarIcon,
  ClockIcon,
  FieldIcon,
  PickerChevronIcon,
} from "@/components/ui/FieldIcons";
import { DatePickerPopover } from "@/components/ui/DatePickerPopover";
import { TimePickerPopover } from "@/components/ui/TimePickerPopover";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { useId, useState } from "react";
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

function DateTimeField({
  label,
  value,
  onChange,
  onBlur,
  type,
  icon,
}: DateTimeFieldProps) {
  const [open, setOpen] = useState(false);
  const labelId = useId();
  const displayValue =
    type === "date" ? formatDateDisplay(value) : formatTimeDisplay(value);

  const close = () => {
    setOpen(false);
    onBlur?.();
  };

  const toggle = () => {
    setOpen((current) => !current);
  };

  return (
    <div className="relative flex-1" data-picker-root>
      <span id={labelId} className="input-label">
        {label}
      </span>
      <div className="flex items-center">
        <FieldIcon>{icon}</FieldIcon>
        <button
          type="button"
          onClick={toggle}
          className="flex min-w-0 flex-1 items-center px-2 py-3 text-left text-sm text-foreground"
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          {displayValue || (
            <span className="text-muted/60">
              {type === "date" ? "Select date" : "Select time"}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={toggle}
          className={`datetime-picker-trigger ${open ? "datetime-picker-trigger--open" : ""}`}
          aria-label={`Open ${label.toLowerCase()} picker`}
          aria-expanded={open}
        >
          <PickerChevronIcon />
        </button>
      </div>

      {type === "date" ? (
        <DatePickerPopover
          open={open}
          onClose={close}
          labelId={labelId}
          value={value}
          onChange={onChange}
        />
      ) : (
        <TimePickerPopover
          open={open}
          onClose={close}
          labelId={labelId}
          value={value}
          onChange={onChange}
          align="right"
        />
      )}
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
