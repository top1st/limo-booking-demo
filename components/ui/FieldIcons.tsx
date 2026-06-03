import { ReactNode } from "react";

const ICON_VIEW = "0 0 20 20";

/** Gold accent icon slot for floating inputs — matches client mock. */
export function FieldIcon({
  children,
  trailing = false,
}: {
  children: ReactNode;
  trailing?: boolean;
}) {
  return (
    <span className={trailing ? "field-icon field-icon--trailing" : "field-icon"}>
      {children}
    </span>
  );
}

function GlyphIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox={ICON_VIEW} aria-hidden="true">
      {children}
    </svg>
  );
}

export function PersonIcon() {
  return (
    <GlyphIcon>
      <circle cx="10" cy="5.75" r="3.25" fill="currentColor" />
      <path
        fill="currentColor"
        d="M3.75 16.25c0-3.45 2.8-6.25 6.25-6.25s6.25 2.8 6.25 6.25v.75H3.75v-.75Z"
      />
    </GlyphIcon>
  );
}

/** At-sign icon (client design uses @, not envelope). */
export function EmailAtIcon() {
  return (
    <GlyphIcon>
      <text
        x="10"
        y="14.5"
        textAnchor="middle"
        fill="currentColor"
        fontSize="14.5"
        fontWeight="700"
        fontFamily="var(--font-inter), system-ui, sans-serif"
      >
        @
      </text>
    </GlyphIcon>
  );
}

/** Bold typographic # — clearest at small UI sizes. */
export function HashIcon() {
  return (
    <GlyphIcon>
      <text
        x="10"
        y="14.75"
        textAnchor="middle"
        fill="currentColor"
        fontSize="15"
        fontWeight="800"
        fontFamily="var(--font-inter), system-ui, sans-serif"
      >
        #
      </text>
    </GlyphIcon>
  );
}

export function LocationPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
  );
}

export function CalendarIcon() {
  return (
    <GlyphIcon>
      <path
        fill="currentColor"
        d="M4.25 4.5A1.65 1.65 0 0 1 5.9 2.85h1.2V1.65h1.4v1.2h3.55V1.65h1.4v1.2h1.2a1.65 1.65 0 0 1 1.65 1.65v10.2a1.65 1.65 0 0 1-1.65 1.65h-8.5A1.65 1.65 0 0 1 4.25 14.7V4.5Zm1.6 1.4v1.15h7.3V5.9h-7.3Zm0 3.55v5.25h7.3V9.45h-7.3Z"
      />
    </GlyphIcon>
  );
}

/** Simple clock face — reads clearly at 22px (no muddy combined path). */
export function ClockIcon() {
  return (
    <GlyphIcon>
      <circle
        cx="10"
        cy="10"
        r="7.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="10" cy="10" r="1.1" fill="currentColor" />
      <path
        fill="currentColor"
        d="M10 5.25a.85.85 0 0 1 .85.85v3.35l2.65 1.55a.85.85 0 1 1-.85 1.47l-3.1-1.8A.85.85 0 0 1 9.15 10V6.1a.85.85 0 0 1 .85-.85Z"
      />
    </GlyphIcon>
  );
}

export function PickerChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" className="datetime-picker-chevron" aria-hidden="true">
      <path
        d="M4.5 6 8 9.5 11.5 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
