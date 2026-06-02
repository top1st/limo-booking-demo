"use client";

import { ReactNode, useEffect, useId, useRef } from "react";

interface PickerPopoverProps {
  open: boolean;
  onClose: () => void;
  labelId: string;
  children: ReactNode;
  className?: string;
  align?: "left" | "right";
}

export function PickerPopover({
  open,
  onClose,
  labelId,
  children,
  className = "",
  align = "left",
}: PickerPopoverProps) {
  const popoverId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (panelRef.current?.contains(target)) {
        return;
      }

      const trigger = document.getElementById(labelId)?.closest("[data-picker-root]");

      if (trigger?.contains(target)) {
        return;
      }

      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, labelId]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      id={popoverId}
      role="dialog"
      aria-labelledby={labelId}
      className={`picker-popover picker-popover--${align} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
