// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/db", () => ({
  lookupCustomer: vi.fn(),
  upsertCustomer: vi.fn(),
  saveBooking: vi.fn(),
}));

vi.mock("@/lib/maps", () => ({
  getRouteEstimate: vi.fn(),
}));

import { POST } from "@/app/api/bookings/route";
import {
  lookupCustomer,
  saveBooking,
  upsertCustomer,
} from "@/lib/db";
import { getRouteEstimate } from "@/lib/maps";

function createValidPayload() {
  return {
    serviceType: "one-way",
    pickupDate: "2099-12-31",
    pickupTime: "15:00",
    pickupLocationType: "location",
    pickupLocation: {
      placeId: "osm:relation:1",
      address: "Boston, MA, USA",
      lat: 42.36,
      lng: -71.06,
    },
    stops: [],
    dropoffLocationType: "airport",
    dropoffLocation: {
      placeId: "osm:relation:2",
      address: "Logan Airport, Boston, MA, USA",
      lat: 42.3656,
      lng: -71.0096,
    },
    phone: "+15551234567",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    passengers: 2,
    customerFound: false,
  };
}

describe("POST /api/bookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for invalid payload", async () => {
    const request = new NextRequest("http://localhost/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Validation failed");
  });

  it("creates booking and upserts new customer", async () => {
    vi.mocked(lookupCustomer).mockResolvedValue({ found: false });
    vi.mocked(getRouteEstimate).mockResolvedValue({
      distanceMeters: 1000,
      durationSeconds: 600,
      distanceText: "0.6 mi",
      durationText: "10 min",
    });

    const request = new NextRequest("http://localhost/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(createValidPayload()),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(upsertCustomer).toHaveBeenCalledTimes(1);
    expect(saveBooking).toHaveBeenCalledTimes(1);
    expect(getRouteEstimate).toHaveBeenCalledTimes(1);
  });
});
