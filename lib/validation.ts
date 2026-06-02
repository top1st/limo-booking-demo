import { z } from "zod";
import { isValidPhone, normalizePhone } from "./phone";

function clientUsesOsmProvider() {
  return (process.env.NEXT_PUBLIC_MAPS_PROVIDER ?? "osm") !== "google";
}

function hasCoordinates(location: {
  lat?: number;
  lng?: number;
}): boolean {
  return (
    typeof location.lat === "number" &&
    typeof location.lng === "number" &&
    Number.isFinite(location.lat) &&
    Number.isFinite(location.lng)
  );
}

function requireCoordinates(
  location: { lat?: number; lng?: number } | null | undefined,
  path: string[],
  ctx: z.RefinementCtx,
) {
  if (location && !hasCoordinates(location)) {
    ctx.addIssue({
      code: "custom",
      message: "Please select a location from the suggestions",
      path,
    });
  }
}

export const placeLocationSchema = z.object({
  placeId: z.string().min(1, "Please select a location from the suggestions"),
  address: z.string().min(1, "Address is required"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const bookingFormSchema = z
  .object({
    serviceType: z.enum(["one-way", "hourly"]),
    pickupDate: z.string().min(1, "Pickup date is required"),
    pickupTime: z.string().min(1, "Pickup time is required"),
    pickupLocationType: z.enum(["location", "airport"]),
    pickupLocation: placeLocationSchema.nullable(),
    stops: z.array(placeLocationSchema).max(2, "Maximum 2 stops allowed"),
    dropoffLocationType: z.enum(["location", "airport"]),
    dropoffLocation: placeLocationSchema.nullable(),
    hourlyDuration: z.number().int().min(1).max(12).optional(),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .refine(isValidPhone, "Enter a valid phone number"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    passengers: z
      .number({ error: "Passenger count is required" })
      .int("Passengers must be a whole number")
      .min(1, "At least 1 passenger required")
      .max(14, "Maximum 14 passengers"),
    customerFound: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (data.pickupDate) {
      const pickupDate = new Date(`${data.pickupDate}T00:00:00`);
      if (Number.isNaN(pickupDate.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid pickup date",
          path: ["pickupDate"],
        });
      } else if (pickupDate < today) {
        ctx.addIssue({
          code: "custom",
          message: "Pickup date cannot be in the past",
          path: ["pickupDate"],
        });
      }
    }

    if (!data.pickupLocation) {
      ctx.addIssue({
        code: "custom",
        message: "Pickup location is required",
        path: ["pickupLocation"],
      });
    } else if (clientUsesOsmProvider()) {
      requireCoordinates(data.pickupLocation, ["pickupLocation"], ctx);
    }

    data.stops.forEach((stop, index) => {
      if (!stop.placeId || !stop.address) {
        ctx.addIssue({
          code: "custom",
          message: "Please select a stop location from the suggestions",
          path: ["stops", index],
        });
      } else if (clientUsesOsmProvider() && !hasCoordinates(stop)) {
        ctx.addIssue({
          code: "custom",
          message: "Please select a stop location from the suggestions",
          path: ["stops", index],
        });
      }
    });

    if (data.serviceType === "one-way") {
      if (!data.dropoffLocation) {
        ctx.addIssue({
          code: "custom",
          message: "Drop-off location is required",
          path: ["dropoffLocation"],
        });
      } else if (clientUsesOsmProvider()) {
        requireCoordinates(data.dropoffLocation, ["dropoffLocation"], ctx);
      }
    }

    if (data.serviceType === "hourly") {
      if (!data.hourlyDuration) {
        ctx.addIssue({
          code: "custom",
          message: "Hours needed is required for hourly trips",
          path: ["hourlyDuration"],
        });
      }
    }

    if (!data.customerFound) {
      if (!data.firstName?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "First name is required",
          path: ["firstName"],
        });
      }
      if (!data.lastName?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Last name is required",
          path: ["lastName"],
        });
      }
      if (!data.email?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Email is required",
          path: ["email"],
        });
      } else if (!z.string().email().safeParse(data.email.trim()).success) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a valid email address",
          path: ["email"],
        });
      }
    }
  });

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export function normalizeBookingPayload(values: BookingFormValues) {
  const validStops = values.stops.filter((stop) => stop.placeId && stop.address);

  return {
    ...values,
    phone: normalizePhone(values.phone),
    pickupLocation: values.pickupLocation!,
    stops: validStops,
    dropoffLocation: values.dropoffLocation ?? undefined,
    firstName: values.customerFound ? undefined : values.firstName?.trim(),
    lastName: values.customerFound ? undefined : values.lastName?.trim(),
    email: values.customerFound ? undefined : values.email?.trim(),
  };
}
