"use client";

import dynamic from "next/dynamic";
import { getClientMapsProvider } from "@/lib/maps/provider";
import { canShowTripMap } from "@/lib/maps/trip-points";
import type { PlaceLocation, RouteEstimate } from "@/lib/types";

const GoogleTripMap = dynamic(
  () => import("./GoogleTripMap").then((mod) => mod.GoogleTripMap),
  { ssr: false, loading: () => <TripMapSkeleton /> },
);

const OsmTripMap = dynamic(
  () => import("./OsmTripMap").then((mod) => mod.OsmTripMap),
  { ssr: false, loading: () => <TripMapSkeleton /> },
);

interface TripMapProps {
  pickup: PlaceLocation;
  dropoff: PlaceLocation;
  stops?: PlaceLocation[];
  routeEstimate: RouteEstimate | null;
  routeLoading?: boolean;
}

function TripMapSkeleton() {
  return (
    <div
      className="flex h-[280px] items-center justify-center rounded-md bg-accent-light text-sm text-muted"
      aria-hidden="true"
    >
      Loading map...
    </div>
  );
}

export function TripMap({
  pickup,
  dropoff,
  stops = [],
  routeEstimate,
  routeLoading = false,
}: TripMapProps) {
  if (!canShowTripMap(pickup, dropoff)) {
    return null;
  }

  const provider = getClientMapsProvider();
  const validStops = stops.filter((stop) => stop.placeId);

  if (provider === "google" && !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="rounded-md border border-border bg-accent-light px-4 py-3 text-sm text-muted">
        Trip map requires NEXT_PUBLIC_GOOGLE_MAPS_API_KEY when using the Google
        maps provider.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-foreground">Trip map</h3>
      <div className="relative overflow-hidden rounded-md border border-border">
        {provider === "google" ? (
          <GoogleTripMap
            pickup={pickup}
            dropoff={dropoff}
            stops={validStops}
            routeEstimate={routeEstimate}
          />
        ) : (
          <OsmTripMap
            pickup={pickup}
            dropoff={dropoff}
            stops={validStops}
            routeEstimate={routeEstimate}
          />
        )}
        {routeLoading ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/60 text-sm text-muted">
            Updating route...
          </div>
        ) : null}
      </div>
      {routeEstimate ? (
        <p className="text-xs text-muted">
          {routeEstimate.distanceText} · {routeEstimate.durationText}
        </p>
      ) : null}
    </div>
  );
}
