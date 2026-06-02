import { describe, expect, it } from "vitest";
import { canShowTripMap, collectTripStops } from "@/lib/maps/trip-points";
import type { PlaceLocation } from "@/lib/types";

const pickup: PlaceLocation = {
  placeId: "pickup",
  address: "Pickup address",
  lat: 40.7,
  lng: -74.0,
};

const dropoff: PlaceLocation = {
  placeId: "dropoff",
  address: "Dropoff address",
  lat: 40.8,
  lng: -73.9,
};

describe("trip-points", () => {
  it("collects pickup, stops, and dropoff in order", () => {
    const stops = collectTripStops(pickup, dropoff, [
      { placeId: "stop-1", address: "Stop", lat: 40.75, lng: -73.95 },
    ]);

    expect(stops.map((stop) => stop.kind)).toEqual(["pickup", "stop", "dropoff"]);
  });

  it("requires coordinates on both endpoints", () => {
    expect(canShowTripMap(pickup, dropoff)).toBe(true);
    expect(
      canShowTripMap(
        { placeId: "x", address: "No coords" },
        dropoff,
      ),
    ).toBe(false);
  });
});
