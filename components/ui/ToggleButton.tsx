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
}

export function MiniToggle({ options, value, onChange }: MiniToggleProps) {
  return (
    <div className="inline-flex rounded-md border border-border bg-accent-light/40 p-0.5 shadow-sm">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            value === option.value
              ? "border border-accent bg-surface text-accent shadow-sm"
              : "border border-transparent text-muted hover:text-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
