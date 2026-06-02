"use client";

import { FieldIcon } from "@/components/ui/FieldIcons";
import { InputHTMLAttributes, ReactNode } from "react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  containerClassName?: string;
}

export function FloatingInput({
  label,
  icon,
  error,
  containerClassName = "",
  className = "",
  id,
  ...props
}: FloatingInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={containerClassName}>
      <div className={`input-shell ${error ? "input-shell--error" : ""}`}>
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
        <div className="flex items-center">
          {icon ? <FieldIcon>{icon}</FieldIcon> : null}
          <input
            id={inputId}
            className={`w-full bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted/60 ${className}`}
            {...props}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
    </div>
  );
}

interface FloatingSelectProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: Array<{ value: string | number; label: string }>;
  error?: string;
  containerClassName?: string;
}

export function FloatingSelect({
  label,
  value,
  onChange,
  options,
  error,
  containerClassName = "",
}: FloatingSelectProps) {
  const selectId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={containerClassName}>
      <div className={`input-shell ${error ? "input-shell--error" : ""}`}>
        <label htmlFor={selectId} className="input-label">
          {label}
        </label>
        <select
          id={selectId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none bg-transparent px-3 py-3 text-sm text-foreground outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
    </div>
  );
}
