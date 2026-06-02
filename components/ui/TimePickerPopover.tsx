"use client";

import { useEffect, useRef, useState } from "react";
import { PickerPopover } from "@/components/ui/PickerPopover";
import {
  HOURS_12,
  MINUTES_60,
  PERIODS,
  parseTime24,
  to12Hour,
  to24Hour,
  toTime24,
} from "@/lib/datetime";

interface TimePickerPopoverProps {
  open: boolean;
  onClose: () => void;
  labelId: string;
  value: string;
  onChange: (time24: string) => void;
  align?: "left" | "right";
}

function TimeColumn({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selectedEl = listRef.current?.querySelector("[data-selected='true']");

    if (selectedEl instanceof HTMLElement) {
      selectedEl.scrollIntoView({ block: "center" });
    }
  }, [selected]);

  return (
    <div className="timepicker-column">
      <span className="timepicker-column__label">{label}</span>
      <div ref={listRef} className="timepicker-column__list" role="listbox" aria-label={label}>
        {options.map((option) => {
          const isSelected = option === selected;

          return (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={isSelected}
              data-selected={isSelected}
              onClick={() => onSelect(option)}
              className={`timepicker-cell ${isSelected ? "timepicker-cell--selected" : ""}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TimePickerPopover({
  open,
  onClose,
  labelId,
  value,
  onChange,
  align = "left",
}: TimePickerPopoverProps) {
  const parsed = parseTime24(value) ?? { hours: 15, minutes: 0 };
  const initial = to12Hour(parsed.hours);

  const [hour12, setHour12] = useState(initial.hour12.toString().padStart(2, "0"));
  const [minute, setMinute] = useState(parsed.minutes.toString().padStart(2, "0"));
  const [period, setPeriod] = useState<"AM" | "PM">(initial.period);

  useEffect(() => {
    if (!open) {
      return;
    }

    const next = parseTime24(value);
    if (!next) {
      return;
    }

    const display = to12Hour(next.hours);
    setHour12(display.hour12.toString().padStart(2, "0"));
    setMinute(next.minutes.toString().padStart(2, "0"));
    setPeriod(display.period);
  }, [open, value]);

  const applyTime = (nextHour12: string, nextMinute: string, nextPeriod: "AM" | "PM") => {
    const hours24 = to24Hour(Number.parseInt(nextHour12, 10), nextPeriod);
    onChange(toTime24(hours24, Number.parseInt(nextMinute, 10)));
  };

  return (
    <PickerPopover
      open={open}
      onClose={onClose}
      labelId={labelId}
      align={align}
      className="timepicker-popover"
    >
      <div className="picker-popover__header picker-popover__header--compact">
        <p className="picker-popover__title">Select time</p>
      </div>

      <div className="timepicker-columns">
        <TimeColumn
          label="Hour"
          options={HOURS_12}
          selected={hour12}
          onSelect={(next) => {
            setHour12(next);
            applyTime(next, minute, period);
          }}
        />
        <TimeColumn
          label="Min"
          options={MINUTES_60}
          selected={minute}
          onSelect={(next) => {
            setMinute(next);
            applyTime(hour12, next, period);
          }}
        />
        <TimeColumn
          label=""
          options={PERIODS}
          selected={period}
          onSelect={(next) => {
            const nextPeriod = next as "AM" | "PM";
            setPeriod(nextPeriod);
            applyTime(hour12, minute, nextPeriod);
          }}
        />
      </div>

      <div className="picker-popover__footer">
        <button
          type="button"
          className="picker-footer-btn picker-footer-btn--primary picker-footer-btn--full"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </PickerPopover>
  );
}
