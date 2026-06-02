"use client";

import { useEffect, useState } from "react";
import { PickerPopover } from "@/components/ui/PickerPopover";
import {
  compareIsoDate,
  getCalendarCells,
  isoDateFromDate,
  parseIsoDate,
  startOfToday,
  WEEKDAY_LABELS,
} from "@/lib/datetime";

interface DatePickerPopoverProps {
  open: boolean;
  onClose: () => void;
  labelId: string;
  value: string;
  onChange: (isoDate: string) => void;
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M10 4 6 8l4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DatePickerPopover({
  open,
  onClose,
  labelId,
  value,
  onChange,
}: DatePickerPopoverProps) {
  const today = startOfToday();
  const todayIso = isoDateFromDate(today);
  const parsed = parseIsoDate(value);

  const [viewYear, setViewYear] = useState(parsed?.year ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? today.getMonth() + 1);

  useEffect(() => {
    if (!open) {
      return;
    }

    const next = parseIsoDate(value);
    if (next) {
      setViewYear(next.year);
      setViewMonth(next.month);
    }
  }, [open, value]);

  const cells = getCalendarCells(viewYear, viewMonth);
  const monthLabel = new Date(viewYear, viewMonth - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const shiftMonth = (delta: number) => {
    const date = new Date(viewYear, viewMonth - 1 + delta, 1);
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth() + 1);
  };

  const selectDay = (iso: string) => {
    if (compareIsoDate(iso, todayIso) < 0) {
      return;
    }

    onChange(iso);
    onClose();
  };

  return (
    <PickerPopover open={open} onClose={onClose} labelId={labelId}>
      <div className="picker-popover__header">
        <button
          type="button"
          className="picker-nav-btn"
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
        >
          <ChevronLeft />
        </button>
        <p className="picker-popover__title">{monthLabel}</p>
        <button
          type="button"
          className="picker-nav-btn"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="datepicker-weekdays">
        {WEEKDAY_LABELS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="datepicker-grid">
        {cells.map((cell, index) => {
          if (!cell.inMonth || !cell.iso || cell.day === null) {
            return <span key={`empty-${index}`} className="datepicker-day datepicker-day--empty" />;
          }

          const isSelected = cell.iso === value;
          const isToday = cell.iso === todayIso;
          const isDisabled = compareIsoDate(cell.iso, todayIso) < 0;

          return (
            <button
              key={cell.iso}
              type="button"
              disabled={isDisabled}
              onClick={() => selectDay(cell.iso!)}
              className={`datepicker-day ${
                isSelected ? "datepicker-day--selected" : ""
              } ${isToday ? "datepicker-day--today" : ""} ${
                isDisabled ? "datepicker-day--disabled" : ""
              }`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      <div className="picker-popover__footer">
        <button
          type="button"
          className="picker-footer-btn"
          onClick={() => {
            onChange("");
            onClose();
          }}
        >
          Clear
        </button>
        <button
          type="button"
          className="picker-footer-btn picker-footer-btn--primary"
          onClick={() => {
            onChange(todayIso);
            onClose();
          }}
        >
          Today
        </button>
      </div>
    </PickerPopover>
  );
}
