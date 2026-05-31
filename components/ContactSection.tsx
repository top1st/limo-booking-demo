"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { FloatingInput } from "@/components/ui/FloatingInput";
import type { BookingFormValues } from "@/lib/validation";
import { formatPhoneDisplay } from "@/lib/phone";

interface ContactSectionProps {
  control: Control<BookingFormValues>;
  errors: FieldErrors<BookingFormValues>;
  customerFound: boolean;
  knownFirstName?: string;
  lookupMessage?: string | null;
  lookupLoading?: boolean;
  onPhoneBlur: () => void;
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.5 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M3 5.5 8 9l5-3.5M3 5.5h10v5H3v-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlagIcon() {
  return (
    <span className="text-base leading-none" aria-hidden="true">
      🇺🇸
    </span>
  );
}

export function ContactSection({
  control,
  errors,
  customerFound,
  knownFirstName,
  lookupMessage,
  lookupLoading,
  onPhoneBlur,
}: ContactSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-foreground">Contact Information</h2>

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <div>
            <div
              className={`relative rounded-md border bg-white ${
                errors.phone
                  ? "border-error"
                  : "border-border focus-within:border-accent"
              }`}
            >
              <label
                htmlFor="phone"
                className="absolute -top-2 left-3 bg-white px-1 text-xs text-muted"
              >
                Phone
              </label>
              <div className="flex items-center">
                <span className="pl-3 text-muted">{FlagIcon()}</span>
                <span className="pr-1 text-sm text-foreground">+1</span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  value={field.value}
                  onChange={(event) => {
                    const digits = event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    field.onChange(formatPhoneDisplay(digits));
                  }}
                  onBlur={() => {
                    field.onBlur();
                    onPhoneBlur();
                  }}
                  placeholder="774 415 3244"
                  className="w-full bg-transparent py-3 pr-3 text-sm text-foreground outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
            {errors.phone ? (
              <p className="mt-1 text-xs text-error">{errors.phone.message}</p>
            ) : null}
          </div>
        )}
      />

      {lookupLoading ? (
        <p className="text-sm text-muted">Checking phone number...</p>
      ) : null}

      {customerFound && knownFirstName ? (
        <p className="text-sm font-medium text-accent">
          Welcome back, {knownFirstName}!
        </p>
      ) : null}

      {!customerFound && lookupMessage ? (
        <p className="text-sm text-muted">{lookupMessage}</p>
      ) : null}

      {!customerFound ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <FloatingInput
                  label="First name"
                  icon={<PersonIcon />}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.firstName?.message}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <FloatingInput
                  label="Last name"
                  icon={<PersonIcon />}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.lastName?.message}
                />
              )}
            />
          </div>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FloatingInput
                label="Email"
                icon={<EmailIcon />}
                type="email"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="name@example.com"
                error={errors.email?.message}
              />
            )}
          />
        </>
      ) : null}
    </section>
  );
}
