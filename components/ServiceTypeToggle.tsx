"use client";

import type { ServiceType } from "@/lib/types";

interface ServiceTypeToggleProps {
  value: ServiceType;
  onChange: (value: ServiceType) => void;
}

const OPTIONS: Array<{ value: ServiceType; label: string }> = [
  { value: "one-way", label: "One-way" },
  { value: "hourly", label: "Hourly" },
];

export function ServiceTypeToggle({ value, onChange }: ServiceTypeToggleProps) {
  return (
    <div
      className="segmented-toggle segmented-toggle--full"
      role="group"
      aria-label="Service type"
    >
      <div className="segmented-toggle__track">
        {OPTIONS.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={`segmented-toggle__option ${
                selected ? "segmented-toggle__option--selected" : ""
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
