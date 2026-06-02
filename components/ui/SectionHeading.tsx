interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionHeading({ children, className = "" }: SectionHeadingProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-4 w-0.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
      <h2 className="font-display text-lg font-medium tracking-tight text-foreground sm:text-xl">
        {children}
      </h2>
    </div>
  );
}
