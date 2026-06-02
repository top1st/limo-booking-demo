import type { LatLng, PlaceLocation } from "@/lib/types";
import { hasCoordinates } from "./osm";

export type TripStopKind = "pickup" | "stop" | "dropoff";

export interface TripStop {
  kind: TripStopKind;
  label: string;
  location: PlaceLocation;
  position: LatLng;
}

export function collectTripStops(
  pickup: PlaceLocation,
  dropoff: PlaceLocation,
  stops: PlaceLocation[] = [],
): TripStop[] {
  const points: TripStop[] = [];

  if (hasCoordinates(pickup)) {
    points.push({
      kind: "pickup",
      label: "Pickup",
      location: pickup,
      position: { lat: pickup.lat!, lng: pickup.lng! },
    });
  }

  stops.forEach((stop, index) => {
    if (!hasCoordinates(stop)) {
      return;
    }

    points.push({
      kind: "stop",
      label: `Stop ${index + 1}`,
      location: stop,
      position: { lat: stop.lat!, lng: stop.lng! },
    });
  });

  if (hasCoordinates(dropoff)) {
    points.push({
      kind: "dropoff",
      label: "Drop-off",
      location: dropoff,
      position: { lat: dropoff.lat!, lng: dropoff.lng! },
    });
  }

  return points;
}

export function canShowTripMap(
  pickup: PlaceLocation | null,
  dropoff: PlaceLocation | null,
): boolean {
  return Boolean(
    pickup && dropoff && hasCoordinates(pickup) && hasCoordinates(dropoff),
  );
}
