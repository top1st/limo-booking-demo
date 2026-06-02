"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { EmailAtIcon, PersonIcon } from "@/components/ui/FieldIcons";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { InternationalPhoneInput } from "@/components/ui/InternationalPhoneInput";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { BookingFormValues } from "@/lib/validation";

interface ContactSectionProps {
  control: Control<BookingFormValues>;
  errors: FieldErrors<BookingFormValues>;
  customerFound: boolean;
  knownFirstName?: string;
  lookupMessage?: string | null;
  lookupLoading?: boolean;
  onPhoneBlur: () => void;
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
      <SectionHeading>Contact Information</SectionHeading>

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <div>
            <div
              className={`input-shell ${errors.phone ? "input-shell--error" : ""}`}
            >
              <label htmlFor="phone" className="input-label">
                Phone
              </label>
              <InternationalPhoneInput
                id="phone"
                value={field.value}
                onChange={field.onChange}
                onBlur={() => {
                  field.onBlur();
                  onPhoneBlur();
                }}
                placeholder="774 415 3244"
              />
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
        <p className="welcome-badge">
          <span aria-hidden="true">✦</span>
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
                icon={<EmailAtIcon />}
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
