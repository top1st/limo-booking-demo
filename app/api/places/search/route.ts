import { NextRequest, NextResponse } from "next/server";
import { getServerMapsProvider } from "@/lib/maps/provider";
import { searchPhotonPlaces } from "@/lib/maps/photon";

export async function GET(request: NextRequest) {
  if (getServerMapsProvider() !== "osm") {
    return NextResponse.json(
      { error: "Place search is only available for the OpenStreetMap provider" },
      { status: 400 },
    );
  }

  const query = request.nextUrl.searchParams.get("q")?.trim();
  const locationType = request.nextUrl.searchParams.get("type") ?? "location";

  if (!query || query.length < 3) {
    return NextResponse.json(
      { error: "Search query must be at least 3 characters" },
      { status: 400 },
    );
  }

  try {
    const results = await searchPhotonPlaces(
      query,
      locationType === "airport" ? "airport" : "location",
    );

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to search locations right now",
      },
      { status: 502 },
    );
  }
}
