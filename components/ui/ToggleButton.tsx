"use client";

import { ReactNode } from "react";

interface ToggleButtonProps {
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ToggleButton({
  selected,
  onClick,
  icon,
  children,
  className = "",
}: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
        selected
          ? "toggle-selected"
          : "border-border bg-surface text-muted shadow-sm hover:border-accent-muted hover:text-foreground"
      } ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}

interface MiniToggleProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  "aria-label"?: string;
}

export function MiniToggle({
  options,
  value,
  onChange,
  "aria-label": ariaLabel = "Location type",
}: MiniToggleProps) {
  return (
    <div className="segmented-toggle segmented-toggle--mini" role="group" aria-label={ariaLabel}>
      <div className="segmented-toggle__track">
        {options.map((option) => {
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
