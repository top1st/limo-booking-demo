"use client";

import { FieldIcon, LocationPinIcon } from "@/components/ui/FieldIcons";
import { useEffect, useRef, useState } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import type { LocationType, PlaceLocation } from "@/lib/types";

export interface LocationAutocompleteProps {
  label?: string;
  value: PlaceLocation | null;
  onChange: (location: PlaceLocation | null) => void;
  locationType: LocationType;
  error?: string;
  placeholder?: string;
}

export function GooglePlacesAutocomplete({
  label = "Location",
  value,
  onChange,
  locationType,
  error,
  placeholder = "Search for an address",
}: LocationAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const configError = apiKey
    ? null
    : "Google Maps API key missing. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local";

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [mapsReady, setMapsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const displayValue = value?.placeId ? value.address : inputValue;

  useEffect(() => {
    if (!apiKey) {
      return;
    }

    let cancelled = false;

    setOptions({
      key: apiKey,
      libraries: ["places"],
    });

    importLibrary("places")
      .then(() => {
        if (!cancelled) {
          setMapsReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError("Unable to load Google Maps. Check your API key.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  useEffect(() => {
    if (!mapsReady || !inputRef.current || autocompleteRef.current) {
      return;
    }

    const options: google.maps.places.AutocompleteOptions = {
      fields: ["place_id", "formatted_address", "geometry", "name", "types"],
      componentRestrictions: { country: "us" },
    };

    if (locationType === "airport") {
      options.types = ["airport"];
    }

    const autocomplete = new google.maps.places.Autocomplete(
      inputRef.current,
      options,
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.place_id || !place.formatted_address) {
        onChange(null);
        return;
      }

      const nextValue: PlaceLocation = {
        placeId: place.place_id,
        address: place.formatted_address,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
      };

      setInputValue(nextValue.address);
      onChange(nextValue);
    });

    autocompleteRef.current = autocomplete;
  }, [mapsReady, locationType, onChange]);

  useEffect(() => {
    if (autocompleteRef.current) {
      autocompleteRef.current.set(
        "types",
        locationType === "airport" ? ["airport"] : [],
      );
    }
  }, [locationType]);

  const handleManualChange = (nextValue: string) => {
    setInputValue(nextValue);
    if (!nextValue.trim()) {
      onChange(null);
    } else if (value && nextValue !== value.address) {
      onChange(null);
    }
  };

  const mapsError = configError ?? loadError;

  return (
    <div>
      <div className={`input-shell ${error ? "input-shell--error" : ""}`}>
        <label className="input-label">{label}</label>
        <div className="flex items-center">
          <FieldIcon>
            <LocationPinIcon />
          </FieldIcon>
          <input
            ref={inputRef}
            value={displayValue}
            onChange={(event) => handleManualChange(event.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted/60"
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
      {mapsError ? <p className="mt-1 text-xs text-muted">{mapsError}</p> : null}
    </div>
  );
}
