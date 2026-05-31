"use client";

import {
  GooglePlacesAutocomplete,
  type LocationAutocompleteProps,
} from "@/components/GooglePlacesAutocomplete";
import { OsmPlacesAutocomplete } from "@/components/OsmPlacesAutocomplete";
import { getClientMapsProvider } from "@/lib/maps/provider";

export function LocationAutocomplete(props: LocationAutocompleteProps) {
  const provider = getClientMapsProvider();

  if (provider === "google") {
    return <GooglePlacesAutocomplete {...props} />;
  }

  return <OsmPlacesAutocomplete {...props} />;
}
