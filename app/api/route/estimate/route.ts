import { NextRequest, NextResponse } from "next/server";
import {
  getRouteEstimate,
  validateLocationsForProvider,
} from "@/lib/maps";
import type { PlaceLocation } from "@/lib/types";

interface RouteEstimateRequest {
  pickup: PlaceLocation;
  dropoff: PlaceLocation;
  stops?: PlaceLocation[];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RouteEstimateRequest;

    if (!body.pickup || !body.dropoff) {
      return NextResponse.json(
        { error: "Pickup and drop-off locations are required" },
        { status: 400 },
      );
    }

    const validationError = validateLocationsForProvider(
      body.pickup,
      body.dropoff,
      body.stops ?? [],
    );

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const estimate = await getRouteEstimate(
      body.pickup,
      body.dropoff,
      body.stops ?? [],
    );

    if (!estimate) {
      return NextResponse.json(
        {
          error:
            "Google Maps API key missing. Add GOOGLE_MAPS_API_KEY to .env.local or switch MAPS_PROVIDER=osm",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ estimate });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to estimate route",
      },
      { status: 500 },
    );
  }
}
