import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-3.5 text-sm font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60";
  const variants = {
    primary: "btn-primary text-white",
    ghost:
      "bg-transparent text-accent hover:bg-accent-light hover:text-accent-hover",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
