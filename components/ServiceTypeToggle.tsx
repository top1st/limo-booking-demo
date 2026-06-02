"use client";

import { ToggleButton } from "@/components/ui/ToggleButton";
import type { ServiceType } from "@/lib/types";

interface ServiceTypeToggleProps {
  value: ServiceType;
  onChange: (value: ServiceType) => void;
}

function OneWayIcon() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden="true">
        <path d="M3 8h8M8 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    </span>
  );
}

function HourlyIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M8 3v5l3 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ServiceTypeToggle({ value, onChange }: ServiceTypeToggleProps) {
  return (
    <div className="flex gap-3" role="group" aria-label="Service type">
      <ToggleButton
        selected={value === "one-way"}
        onClick={() => onChange("one-way")}
        icon={<OneWayIcon />}
      >
        One-way
      </ToggleButton>
      <ToggleButton
        selected={value === "hourly"}
        onClick={() => onChange("hourly")}
        icon={<HourlyIcon />}
      >
        Hourly
      </ToggleButton>
    </div>
  );
}
