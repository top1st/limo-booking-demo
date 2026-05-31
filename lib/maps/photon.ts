import type { PlaceLocation } from "@/lib/types";

interface PhotonProperties {
  osm_type?: string;
  osm_id?: number;
  osm_key?: string;
  osm_value?: string;
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  countrycode?: string;
  type?: string;
}

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: PhotonProperties;
}

interface PhotonResponse {
  features: PhotonFeature[];
}

function getPhotonBaseUrl() {
  return process.env.PHOTON_BASE_URL ?? "https://photon.komoot.io";
}

function osmTypeToKey(osmType?: string): string {
  switch (osmType?.toUpperCase()) {
    case "N":
      return "node";
    case "W":
      return "way";
    case "R":
      return "relation";
    default:
      return "node";
  }
}

function formatAddress(properties: PhotonProperties): string {
  const parts = [
    properties.name,
    properties.street,
    properties.city,
    properties.state,
    properties.country === "United States" ? "USA" : properties.country,
  ].filter(Boolean);

  return parts.join(", ");
}

function isAirportResult(properties: PhotonProperties): boolean {
  const haystack =
    `${properties.osm_key ?? ""} ${properties.osm_value ?? ""} ${properties.name ?? ""} ${properties.type ?? ""}`.toLowerCase();

  return (
    properties.osm_key === "aeroway" ||
    properties.osm_value === "aerodrome" ||
    haystack.includes("airport")
  );
}

function toPlaceLocation(feature: PhotonFeature): PlaceLocation | null {
  const { properties } = feature;
  const [lng, lat] = feature.geometry.coordinates;

  if (!properties.osm_id || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  const address = formatAddress(properties);

  if (!address) {
    return null;
  }

  return {
    placeId: `osm:${osmTypeToKey(properties.osm_type)}:${properties.osm_id}`,
    address,
    lat,
    lng,
  };
}

export async function searchPhotonPlaces(
  query: string,
  locationType: "location" | "airport",
): Promise<PlaceLocation[]> {
  const searchQuery =
    locationType === "airport" && !query.toLowerCase().includes("airport")
      ? `${query} airport`
      : query;

  const params = new URLSearchParams({
    q: searchQuery,
    limit: "8",
    lang: "en",
  });

  const baseUrl = getPhotonBaseUrl().replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/api/?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        process.env.NOMINATIM_USER_AGENT ??
        "limo-booking-demo/1.0 (local-dev@example.com)",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Photon search failed with status ${response.status}`);
  }

  const data = (await response.json()) as PhotonResponse;

  const usFeatures = data.features.filter(
    (feature) => feature.properties.countrycode?.toUpperCase() === "US",
  );

  const filtered =
    locationType === "airport"
      ? usFeatures.filter((feature) => isAirportResult(feature.properties))
      : usFeatures.filter(
          (feature) =>
            !isAirportResult(feature.properties) || usFeatures.length === 1,
        );

  const candidates = filtered.length > 0 ? filtered : usFeatures;

  return candidates
    .map(toPlaceLocation)
    .filter((result): result is PlaceLocation => result !== null)
    .slice(0, 5);
}
