"use client";

import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MiniToggle } from "@/components/ui/ToggleButton";
import { FloatingSelect } from "@/components/ui/FloatingInput";
import { PickupDateTimeFields } from "@/components/ui/DateTimeInput";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";
import type { BookingFormValues } from "@/lib/validation";
import type { PlaceLocation, RouteEstimate } from "@/lib/types";

interface LocationSectionProps {
  title: string;
  control: Control<BookingFormValues>;
  errors: FieldErrors<BookingFormValues>;
  watch: UseFormWatch<BookingFormValues>;
  setValue: UseFormSetValue<BookingFormValues>;
  showDateTime?: boolean;
  showStops?: boolean;
  showHourlyDuration?: boolean;
  routeEstimate?: RouteEstimate | null;
  routeLoading?: boolean;
  routeError?: string | null;
}

export function LocationSection({
  title,
  control,
  errors,
  watch,
  setValue,
  showDateTime = false,
  showStops = false,
  showHourlyDuration = false,
  routeEstimate,
  routeLoading,
  routeError,
}: LocationSectionProps) {
  const stops = watch("stops") ?? [];
  const locationTypeField =
    title === "Pickup" ? "pickupLocationType" : "dropoffLocationType";
  const locationField =
    title === "Pickup" ? "pickupLocation" : "dropoffLocation";
  const locationType = watch(locationTypeField);

  const addStop = () => {
    if (stops.length >= 2) {
      return;
    }

    setValue("stops", [...stops, { placeId: "", address: "" }], {
      shouldValidate: true,
    });
  };

  const updateStop = (index: number, location: PlaceLocation | null) => {
    const nextStops = [...stops];
    if (location) {
      nextStops[index] = location;
    } else {
      nextStops.splice(index, 1);
    }
    setValue("stops", nextStops, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <section className="space-y-4">
      <SectionHeading>{title}</SectionHeading>

      {showDateTime ? (
        <PickupDateTimeFields control={control} errors={errors} />
      ) : null}

      {showHourlyDuration ? (
        <Controller
          name="hourlyDuration"
          control={control}
          render={({ field }) => (
            <FloatingSelect
              label="Hours needed"
              value={field.value ?? 1}
              onChange={(value) => field.onChange(Number(value))}
              options={Array.from({ length: 12 }, (_, index) => ({
                value: index + 1,
                label: `${index + 1} hour${index === 0 ? "" : "s"}`,
              }))}
              error={errors.hourlyDuration?.message}
            />
          )}
        />
      ) : (
        <>
          <Controller
            name={locationTypeField}
            control={control}
            render={({ field }) => (
              <MiniToggle
                options={[
                  { value: "location", label: "Location" },
                  { value: "airport", label: "Airport" },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name={locationField}
            control={control}
            render={({ field }) => (
              <LocationAutocomplete
                value={field.value}
                onChange={field.onChange}
                locationType={locationType}
                error={
                  locationField === "pickupLocation"
                    ? errors.pickupLocation?.message
                    : errors.dropoffLocation?.message
                }
              />
            )}
          />
        </>
      )}

      {showStops ? (
        <div className="space-y-3">
          {stops.map((stop, index) => (
            <div key={`stop-${index}`} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">Stop {index + 1}</span>
                <button
                  type="button"
                  onClick={() => updateStop(index, null)}
                  className="text-xs text-muted hover:text-foreground"
                >
                  Remove
                </button>
              </div>
              <LocationAutocomplete
                label="Stop location"
                value={stop.placeId ? stop : null}
                onChange={(location) => updateStop(index, location)}
                locationType="location"
                error={errors.stops?.[index]?.message}
              />
            </div>
          ))}

          {stops.length < 2 ? (
            <button
              type="button"
              onClick={addStop}
              className="text-sm font-medium text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline"
            >
              + Add a stop
            </button>
          ) : null}
        </div>
      ) : null}

      {routeEstimate || routeLoading || routeError ? (
        <div className="route-chip text-sm">
          {routeLoading ? <p className="text-muted">Calculating route...</p> : null}
          {routeError ? <p className="text-error">{routeError}</p> : null}
          {routeEstimate ? (
            <p className="text-foreground">
              Estimated route:{" "}
              <span className="font-medium">
                {routeEstimate.distanceText} · {routeEstimate.durationText}
              </span>
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
