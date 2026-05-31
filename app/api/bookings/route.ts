import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { saveBooking, upsertCustomer, lookupCustomer } from "@/lib/db";
import { getRouteEstimate } from "@/lib/maps";
import {
  bookingFormSchema,
  normalizeBookingPayload,
} from "@/lib/validation";
import type { BookingPayload, RouteEstimate } from "@/lib/types";
import { normalizePhone } from "@/lib/phone";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bookingFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const payload = normalizeBookingPayload(parsed.data);
    const normalizedPhone = normalizePhone(payload.phone);
    const existingCustomer = await lookupCustomer(normalizedPhone);
    const customerFound = existingCustomer.found;

    let routeEstimate: RouteEstimate | undefined = body.routeEstimate;

    if (
      payload.serviceType === "one-way" &&
      payload.pickupLocation &&
      payload.dropoffLocation &&
      !routeEstimate
    ) {
      routeEstimate =
        (await getRouteEstimate(
          payload.pickupLocation,
          payload.dropoffLocation,
          payload.stops,
        )) ?? undefined;
    }

    if (!customerFound) {
      if (!payload.firstName || !payload.lastName || !payload.email) {
        return NextResponse.json(
          { error: "Contact information is required for new customers" },
          { status: 400 },
        );
      }

      await upsertCustomer({
        phone: normalizedPhone,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
      });
    }

    const bookingId = `bk_${randomUUID().slice(0, 8)}`;
    const bookingPayload: BookingPayload = {
      serviceType: payload.serviceType,
      pickupDate: payload.pickupDate,
      pickupTime: payload.pickupTime,
      pickupLocation: payload.pickupLocation,
      stops: payload.stops,
      dropoffLocation: payload.dropoffLocation,
      hourlyDuration: payload.hourlyDuration,
      phone: normalizedPhone,
      firstName: customerFound
        ? existingCustomer.firstName
        : payload.firstName,
      lastName: customerFound ? existingCustomer.lastName : payload.lastName,
      email: customerFound ? existingCustomer.email : payload.email,
      passengers: payload.passengers,
      routeEstimate,
    };

    await saveBooking(bookingPayload, bookingId);

    const customerName =
      bookingPayload.firstName && bookingPayload.lastName
        ? `${bookingPayload.firstName} ${bookingPayload.lastName}`
        : existingCustomer.firstName;

    return NextResponse.json({
      success: true,
      bookingId,
      message: "Booking received",
      summary: {
        serviceType: bookingPayload.serviceType,
        passengers: bookingPayload.passengers,
        pickupDate: bookingPayload.pickupDate,
        pickupTime: bookingPayload.pickupTime,
        pickupAddress: bookingPayload.pickupLocation.address,
        dropoffAddress: bookingPayload.dropoffLocation?.address,
        phone: normalizedPhone,
        customerName,
        routeEstimate,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to create booking",
      },
      { status: 500 },
    );
  }
}
