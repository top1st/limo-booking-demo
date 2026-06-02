"use client";

import { useEffect, useRef } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import type { LatLng, PlaceLocation, RouteEstimate } from "@/lib/types";
import { collectTripStops, type TripStop } from "@/lib/maps/trip-points";

const STOP_COLORS: Record<TripStop["kind"], string> = {
  pickup: "#c5a059",
  stop: "#666666",
  dropoff: "#333333",
};

interface GoogleTripMapProps {
  pickup: PlaceLocation;
  dropoff: PlaceLocation;
  stops: PlaceLocation[];
  routeEstimate: RouteEstimate | null;
}

function fitMapToContent(
  map: google.maps.Map,
  stops: TripStop[],
  path: LatLng[] | undefined,
) {
  const bounds = new google.maps.LatLngBounds();

  for (const stop of stops) {
    bounds.extend(stop.position);
  }

  if (path) {
    for (const point of path) {
      bounds.extend(point);
    }
  }

  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
  }
}

export function GoogleTripMap({
  pickup,
  dropoff,
  stops,
  routeEstimate,
}: GoogleTripMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !containerRef.current) {
      return;
    }

    let cancelled = false;

    setOptions({ key: apiKey });

    importLibrary("maps")
      .then((mapsLib) => {
        if (cancelled || !containerRef.current) {
          return;
        }

        const tripStops = collectTripStops(pickup, dropoff, stops);
        const path = routeEstimate?.path;

        if (!mapRef.current) {
          mapRef.current = new mapsLib.Map(containerRef.current, {
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
          });
        }

        const map = mapRef.current;

        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        for (const stop of tripStops) {
          const marker = new google.maps.Marker({
            map,
            position: stop.position,
            title: stop.label,
            label: {
              text: stop.kind === "stop" ? "S" : stop.kind === "pickup" ? "A" : "B",
              color: "#ffffff",
              fontWeight: "600",
              fontSize: "11px",
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: STOP_COLORS[stop.kind],
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
              scale: 12,
            },
          });
          markersRef.current.push(marker);
        }

        if (polylineRef.current) {
          polylineRef.current.setMap(null);
        }

        if (path && path.length > 0) {
          polylineRef.current = new google.maps.Polyline({
            map,
            path,
            strokeColor: "#c5a059",
            strokeOpacity: 0.9,
            strokeWeight: 4,
          });
        } else {
          polylineRef.current = null;
        }

        fitMapToContent(map, tripStops, path);
      })
      .catch(() => {
        /* map load errors surface via empty state in parent if needed */
      });

    return () => {
      cancelled = true;
    };
  }, [pickup, dropoff, stops, routeEstimate]);

  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      polylineRef.current?.setMap(null);
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[280px] w-full rounded-md"
      role="img"
      aria-label="Trip route map"
    />
  );
}
