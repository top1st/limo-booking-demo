"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { LatLng, PlaceLocation, RouteEstimate } from "@/lib/types";
import {
  collectTripStops,
  type TripStop,
  type TripStopKind,
} from "@/lib/maps/trip-points";

const STOP_COLORS: Record<TripStopKind, string> = {
  pickup: "#c5a059",
  stop: "#666666",
  dropoff: "#333333",
};

interface OsmTripMapProps {
  pickup: PlaceLocation;
  dropoff: PlaceLocation;
  stops: PlaceLocation[];
  routeEstimate: RouteEstimate | null;
}

function fitLeafletBounds(
  map: import("leaflet").Map,
  L: typeof import("leaflet"),
  stops: TripStop[],
  path: LatLng[] | undefined,
) {
  const latLngs: [number, number][] = stops.map((stop) => [
    stop.position.lat,
    stop.position.lng,
  ]);

  if (path) {
    for (const point of path) {
      latLngs.push([point.lat, point.lng]);
    }
  }

  if (latLngs.length === 0) {
    return;
  }

  map.fitBounds(L.latLngBounds(latLngs), { padding: [32, 32] });
}

export function OsmTripMap({
  pickup,
  dropoff,
  stops,
  routeEstimate,
}: OsmTripMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerGroupRef = useRef<import("leaflet").LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let cancelled = false;

    void import("leaflet").then((leafletModule) => {
      if (cancelled || !containerRef.current) {
        return;
      }

      const L = leafletModule.default;
      const tripStops = collectTripStops(pickup, dropoff, stops);
      const path = routeEstimate?.path;

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, {
          zoomControl: true,
          attributionControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(mapRef.current);
      }

      const map = mapRef.current;

      if (layerGroupRef.current) {
        layerGroupRef.current.clearLayers();
      } else {
        layerGroupRef.current = L.layerGroup().addTo(map);
      }

      const layers = layerGroupRef.current;

      if (path && path.length > 0) {
        L.polyline(
          path.map((point) => [point.lat, point.lng] as [number, number]),
          { color: "#c5a059", weight: 4, opacity: 0.9 },
        ).addTo(layers);
      }

      for (const stop of tripStops) {
        L.circleMarker([stop.position.lat, stop.position.lng], {
          radius: 10,
          color: "#ffffff",
          weight: 2,
          fillColor: STOP_COLORS[stop.kind],
          fillOpacity: 1,
        })
          .bindTooltip(stop.label, { permanent: false, direction: "top" })
          .addTo(layers);
      }

      fitLeafletBounds(map, L, tripStops, path);

      requestAnimationFrame(() => {
        map.invalidateSize();
      });
    });

    return () => {
      cancelled = true;
    };
  }, [pickup, dropoff, stops, routeEstimate]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        layerGroupRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="z-0 h-[280px] w-full rounded-md"
      role="img"
      aria-label="Trip route map"
    />
  );
}
