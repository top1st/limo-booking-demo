export type MapsProvider = "google" | "osm";

const DEFAULT_PROVIDER: MapsProvider = "osm";

function parseProvider(value: string | undefined): MapsProvider | null {
  if (value === "google" || value === "osm") {
    return value;
  }

  return null;
}

export function getClientMapsProvider(): MapsProvider {
  return (
    parseProvider(process.env.NEXT_PUBLIC_MAPS_PROVIDER) ?? DEFAULT_PROVIDER
  );
}

export function getServerMapsProvider(): MapsProvider {
  return (
    parseProvider(process.env.MAPS_PROVIDER) ??
    parseProvider(process.env.NEXT_PUBLIC_MAPS_PROVIDER) ??
    DEFAULT_PROVIDER
  );
}
