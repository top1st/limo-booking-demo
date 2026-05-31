import type { PlaceLocation, RouteEstimate } from "@/lib/types";
import { formatDistance, formatDuration } from "./format";

interface OsrmRoute {
  distance: number;
  duration: number;
}

interface OsrmResponse {
  code: string;
  routes?: OsrmRoute[];
  message?: string;
}

function getOsrmBaseUrl() {
  return process.env.OSRM_BASE_URL ?? "https://router.project-osrm.org";
}

export function hasCoordinates(location: PlaceLocation): boolean {
  return (
    typeof location.lat === "number" &&
    typeof location.lng === "number" &&
    Number.isFinite(location.lat) &&
    Number.isFinite(location.lng)
  );
}

function toCoordinate(location: PlaceLocation): string {
  if (!hasCoordinates(location)) {
    throw new Error(`Missing coordinates for location: ${location.address}`);
  }

  return `${location.lng},${location.lat}`;
}

export async function getOsmRouteEstimate(
  pickup: PlaceLocation,
  dropoff: PlaceLocation,
  stops: PlaceLocation[] = [],
): Promise<RouteEstimate> {
  const points = [pickup, ...stops, dropoff];

  for (const point of points) {
    if (!hasCoordinates(point)) {
      throw new Error(
        "OpenStreetMap routing requires latitude and longitude for all locations",
      );
    }
  }

  const coordinates = points.map(toCoordinate).join(";");
  const baseUrl = getOsrmBaseUrl().replace(/\/$/, "");
  const response = await fetch(
    `${baseUrl}/route/v1/driving/${coordinates}?overview=false`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch route estimate from OSRM");
  }

  const data = (await response.json()) as OsrmResponse;

  if (data.code !== "Ok" || !data.routes?.[0]) {
    throw new Error(data.message ?? "OSRM route request failed");
  }

  const route = data.routes[0];

  return {
    distanceMeters: route.distance,
    durationSeconds: Math.round(route.duration),
    distanceText: formatDistance(route.distance),
    durationText: formatDuration(Math.round(route.duration)),
  };
}
