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
      className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition-colors ${
        selected
          ? "border-accent text-accent"
          : "border-border text-muted hover:border-gray-300"
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
    <div className="inline-flex rounded-md border border-border p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
            value === option.value
              ? "border border-accent bg-white text-accent"
              : "border border-transparent text-muted hover:text-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
