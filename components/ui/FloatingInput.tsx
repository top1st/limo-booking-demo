"use client";

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
      <div
        className={`relative rounded-md border bg-white ${
          error ? "border-error" : "border-border focus-within:border-accent"
        }`}
      >
        <label
          htmlFor={inputId}
          className="absolute -top-2 left-3 bg-white px-1 text-xs text-muted"
        >
          {label}
        </label>
        <div className="flex items-center">
          {icon ? (
            <span className="pl-3 text-muted [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
          ) : null}
          <input
            id={inputId}
            className={`w-full bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-gray-400 ${className}`}
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
      <div
        className={`relative rounded-md border bg-white ${
          error ? "border-error" : "border-border focus-within:border-accent"
        }`}
      >
        <label
          htmlFor={selectId}
          className="absolute -top-2 left-3 bg-white px-1 text-xs text-muted"
        >
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
