import { prisma } from "@/lib/prisma";
import type { BookingPayload, CustomerLookupResult, RouteEstimate } from "./types";
import { normalizePhone } from "./phone";

export async function lookupCustomer(
  phone: string,
): Promise<CustomerLookupResult> {
  const normalized = normalizePhone(phone);

  const customer = await prisma.customer.findUnique({
    where: { phone: normalized },
  });

  if (!customer) {
    return { found: false };
  }

  return {
    found: true,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
  };
}

export async function upsertCustomer(input: {
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
}) {
  const normalized = normalizePhone(input.phone);

  await prisma.customer.upsert({
    where: { phone: normalized },
    create: {
      phone: normalized,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
    },
    update: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
    },
  });
}

export async function saveBooking(
  payload: BookingPayload & { routeEstimate?: RouteEstimate },
  bookingId: string,
) {
  const normalizedPhone = normalizePhone(payload.phone);
  const customerName =
    payload.firstName && payload.lastName
      ? `${payload.firstName} ${payload.lastName}`
      : (await lookupCustomer(normalizedPhone)).firstName ?? undefined;

  await prisma.booking.create({
    data: {
      id: bookingId,
      serviceType: payload.serviceType,
      pickupDate: payload.pickupDate,
      pickupTime: payload.pickupTime,
      pickupAddress: payload.pickupLocation.address,
      dropoffAddress: payload.dropoffLocation?.address ?? null,
      stopsJson: JSON.stringify(payload.stops),
      hourlyDuration: payload.hourlyDuration ?? null,
      phone: normalizedPhone,
      customerName: customerName ?? null,
      email: payload.email ?? null,
      passengers: payload.passengers,
      distanceMeters: payload.routeEstimate?.distanceMeters ?? null,
      durationSeconds: payload.routeEstimate?.durationSeconds ?? null,
      payloadJson: JSON.stringify(payload),
    },
  });
}
