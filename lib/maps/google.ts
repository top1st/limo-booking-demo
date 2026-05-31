import type { PlaceLocation, RouteEstimate } from "@/lib/types";
import { formatDistance, formatDuration } from "./format";

interface DirectionsLeg {
  distance?: { value: number; text: string };
  duration?: { value: number; text: string };
}

interface DirectionsRoute {
  legs: DirectionsLeg[];
}

interface DirectionsResponse {
  status: string;
  routes?: DirectionsRoute[];
  error_message?: string;
}

function getApiKey() {
  return (
    process.env.GOOGLE_MAPS_API_KEY ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  );
}

export async function getGoogleRouteEstimate(
  pickup: PlaceLocation,
  dropoff: PlaceLocation,
  stops: PlaceLocation[] = [],
): Promise<RouteEstimate | null> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return null;
  }

  const params = new URLSearchParams({
    origin: `place_id:${pickup.placeId}`,
    destination: `place_id:${dropoff.placeId}`,
    mode: "driving",
    units: "imperial",
    key: apiKey,
  });

  if (stops.length > 0) {
    params.set(
      "waypoints",
      stops.map((stop) => `place_id:${stop.placeId}`).join("|"),
    );
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch route estimate");
  }

  const data = (await response.json()) as DirectionsResponse;

  if (data.status !== "OK") {
    throw new Error(data.error_message ?? "Directions request failed");
  }

  const legs = data.routes?.[0]?.legs ?? [];
  const distanceMeters = legs.reduce(
    (total, leg) => total + (leg.distance?.value ?? 0),
    0,
  );
  const durationSeconds = legs.reduce(
    (total, leg) => total + (leg.duration?.value ?? 0),
    0,
  );

  if (!distanceMeters || !durationSeconds) {
    throw new Error("Unable to calculate route for the selected locations");
  }

  return {
    distanceMeters,
    durationSeconds,
    distanceText: formatDistance(distanceMeters),
    durationText: formatDuration(durationSeconds),
  };
}
