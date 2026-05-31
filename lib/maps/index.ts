import type { PlaceLocation, RouteEstimate } from "@/lib/types";
import { getGoogleRouteEstimate } from "./google";
import { getOsmRouteEstimate, hasCoordinates } from "./osm";
import { getServerMapsProvider } from "./provider";

export { getClientMapsProvider, getServerMapsProvider } from "./provider";
export type { MapsProvider } from "./provider";
export { hasCoordinates } from "./osm";

export async function getRouteEstimate(
  pickup: PlaceLocation,
  dropoff: PlaceLocation,
  stops: PlaceLocation[] = [],
): Promise<RouteEstimate | null> {
  const provider = getServerMapsProvider();

  if (provider === "google") {
    return getGoogleRouteEstimate(pickup, dropoff, stops);
  }

  return getOsmRouteEstimate(pickup, dropoff, stops);
}

export function validateLocationsForProvider(
  pickup: PlaceLocation,
  dropoff: PlaceLocation,
  stops: PlaceLocation[] = [],
): string | null {
  const provider = getServerMapsProvider();

  if (provider === "google") {
    if (!pickup.placeId || !dropoff.placeId) {
      return "Pickup and drop-off locations are required";
    }

    return null;
  }

  const points = [pickup, ...stops, dropoff];

  for (const point of points) {
    if (!hasCoordinates(point)) {
      return "All locations must include coordinates when using OpenStreetMap";
    }
  }

  return null;
}
