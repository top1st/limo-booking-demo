"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServiceTypeToggle } from "@/components/ServiceTypeToggle";
import { LocationSection } from "@/components/LocationSection";
import { ContactSection } from "@/components/ContactSection";
import { HashIcon } from "@/components/ui/FieldIcons";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { TripMap } from "@/components/TripMap";
import {
  bookingFormSchema,
  normalizeBookingPayload,
  type BookingFormValues,
} from "@/lib/validation";
import { isValidPhone, normalizePhone } from "@/lib/phone";
import type { BookingResponse, RouteEstimate } from "@/lib/types";

function getDefaultDate() {
  const date = new Date();
  return date.toISOString().split("T")[0];
}

export function BookingForm() {
  const [routeEstimate, setRouteEstimate] = useState<RouteEstimate | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);
  const [knownFirstName, setKnownFirstName] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<BookingResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    mode: "onBlur",
    defaultValues: {
      serviceType: "one-way",
      pickupDate: getDefaultDate(),
      pickupTime: "15:00",
      pickupLocationType: "location",
      pickupLocation: null,
      stops: [],
      dropoffLocationType: "airport",
      dropoffLocation: null,
      hourlyDuration: 2,
      phone: "",
      firstName: "",
      lastName: "",
      email: "",
      passengers: 1,
      customerFound: false,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = form;

  const serviceType = watch("serviceType");
  const pickupLocation = watch("pickupLocation");
  const dropoffLocation = watch("dropoffLocation");
  const stops = watch("stops");
  const customerFound = watch("customerFound") ?? false;

  const lookupPhone = useCallback(async () => {
    const phone = getValues("phone");

    if (!isValidPhone(phone)) {
      setLookupMessage(null);
      setKnownFirstName(undefined);
      setValue("customerFound", false, { shouldValidate: true });
      return;
    }

    setLookupLoading(true);
    setLookupMessage(null);

    try {
      const normalized = normalizePhone(phone);
      const response = await fetch(
        `/api/customers/lookup?phone=${encodeURIComponent(normalized)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Lookup failed");
      }

      if (data.found) {
        setValue("customerFound", true, { shouldValidate: true });
        setKnownFirstName(data.firstName);
        setLookupMessage(null);
        setValue("firstName", data.firstName ?? "", { shouldValidate: true });
        setValue("lastName", data.lastName ?? "", { shouldValidate: true });
        setValue("email", data.email ?? "", { shouldValidate: true });
      } else {
        setValue("customerFound", false, { shouldValidate: true });
        setKnownFirstName(undefined);
        setLookupMessage(
          "We don't have that phone number on file. Please provide additional contact information.",
        );
      }
    } catch {
      setLookupMessage("Unable to verify phone number right now.");
      setValue("customerFound", false, { shouldValidate: true });
    } finally {
      setLookupLoading(false);
    }
  }, [getValues, setValue]);

  useEffect(() => {
    if (serviceType !== "one-way") {
      setRouteEstimate(null);
      setRouteError(null);
      return;
    }

    if (!pickupLocation?.placeId || !dropoffLocation?.placeId) {
      setRouteEstimate(null);
      setRouteError(null);
      return;
    }

    const validStops = (stops ?? []).filter((stop) => stop.placeId);

    const timer = window.setTimeout(async () => {
      setRouteLoading(true);
      setRouteError(null);

      try {
        const response = await fetch("/api/route/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pickup: pickupLocation,
            dropoff: dropoffLocation,
            stops: validStops,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Route estimate failed");
        }

        setRouteEstimate(data.estimate ?? null);
      } catch (error) {
        setRouteEstimate(null);
        setRouteError(
          error instanceof Error ? error.message : "Unable to calculate route",
        );
      } finally {
        setRouteLoading(false);
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [serviceType, pickupLocation, dropoffLocation, stops]);

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const payload = normalizeBookingPayload(values);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          routeEstimate: routeEstimate ?? undefined,
        }),
      });

      const data = (await response.json()) as BookingResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Booking submission failed");
      }

      setSubmitSuccess(data);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to submit booking",
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-9">
      <div className="pb-1">
      <ServiceTypeToggle
        value={serviceType}
        onChange={(value) => {
          setValue("serviceType", value, { shouldValidate: true });
          if (value === "hourly") {
            setRouteEstimate(null);
            setRouteError(null);
          }
        }}
      />
      </div>

      <hr className="border-0 border-t border-border/80" aria-hidden="true" />

      <LocationSection
        title="Pickup"
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        showDateTime
        showStops={serviceType === "one-way"}
      />

      {serviceType === "one-way" ? (
        <>
          <LocationSection
            title="Drop off"
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            routeEstimate={routeEstimate}
            routeLoading={routeLoading}
            routeError={routeError}
          />
          {pickupLocation && dropoffLocation ? (
            <TripMap
              pickup={pickupLocation}
              dropoff={dropoffLocation}
              stops={(stops ?? []).filter((stop) => stop.placeId)}
              routeEstimate={routeEstimate}
              routeLoading={routeLoading}
            />
          ) : null}
        </>
      ) : (
        <LocationSection
          title="Hourly service"
          control={control}
          errors={errors}
          watch={watch}
          setValue={setValue}
          showHourlyDuration
        />
      )}

      <hr className="border-0 border-t border-border/80" aria-hidden="true" />

      <ContactSection
        control={control}
        errors={errors}
        customerFound={customerFound}
        knownFirstName={knownFirstName}
        lookupMessage={lookupMessage}
        lookupLoading={lookupLoading}
        onPhoneBlur={lookupPhone}
      />

      <section className="space-y-4">
        <SectionHeading>
          How many passengers are expected for the trip?
        </SectionHeading>
        <FloatingInput
          label="# Passengers"
          icon={<HashIcon />}
          type="number"
          min={1}
          max={14}
          value={watch("passengers") ?? ""}
          onChange={(event) =>
            setValue("passengers", Number(event.target.value), {
              shouldValidate: true,
            })
          }
          error={errors.passengers?.message}
          containerClassName="max-w-[220px]"
        />
      </section>

      {submitError ? (
        <StatusBanner variant="error">{submitError}</StatusBanner>
      ) : null}

      {submitSuccess ? (
        <StatusBanner variant="success" title={submitSuccess.message}>
          Booking ID: {submitSuccess.bookingId}
        </StatusBanner>
      ) : null}

      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Continue"}
      </Button>
    </form>
  );
}
