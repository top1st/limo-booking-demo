import { ReactNode } from "react";

interface StatusBannerProps {
  variant: "success" | "error" | "info";
  title?: string;
  children: ReactNode;
}

export function StatusBanner({ variant, title, children }: StatusBannerProps) {
  const styles = {
    success: "status-banner status-banner--success",
    error: "status-banner status-banner--error",
    info: "status-banner status-banner--info",
  };

  const icons = {
    success: (
      <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M6.5 10 8.5 12 13.5 7.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 6.5v4M10 13.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 9v4M10 7h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <div className={styles[variant]} role={variant === "error" ? "alert" : "status"}>
      {icons[variant]}
      <div className="min-w-0 flex-1 text-sm">
        {title ? <p className="font-medium">{title}</p> : null}
        <div className={title ? "mt-0.5 text-muted" : ""}>{children}</div>
      </div>
    </div>
  );
}
