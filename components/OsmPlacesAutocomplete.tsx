"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FieldIcon, LocationPinIcon } from "@/components/ui/FieldIcons";
import type { LocationAutocompleteProps } from "@/components/GooglePlacesAutocomplete";
import type { PlaceLocation } from "@/lib/types";

export function OsmPlacesAutocomplete({
  label = "Location",
  value,
  onChange,
  locationType,
  error,
  placeholder = "Search for an address",
}: LocationAutocompleteProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<PlaceLocation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const displayValue = value?.placeId ? value.address : inputValue;

  useEffect(() => {
    if (value?.placeId) {
      return;
    }

    const query = inputValue.trim();

    if (query.length < 3) {
      return;
    }

    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      setSearchError(null);

      try {
        const params = new URLSearchParams({
          q: query,
          type: locationType,
        });

        const response = await fetch(`/api/places/search?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Search failed");
        }

        setResults(data.results ?? []);
        setIsOpen(true);
      } catch (fetchError) {
        setResults([]);
        setSearchError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to search locations",
        );
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [inputValue, locationType, value?.placeId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleManualChange = (nextValue: string) => {
    setInputValue(nextValue);
    setIsOpen(true);

    if (!nextValue.trim()) {
      onChange(null);
      setResults([]);
      setSearchError(null);
      return;
    }

    if (nextValue.trim().length < 3) {
      setResults([]);
      setSearchError(null);
    }

    if (value && nextValue !== value.address) {
      onChange(null);
    }
  };

  const handleSelect = (location: PlaceLocation) => {
    setInputValue(location.address);
    onChange(location);
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className={`input-shell ${error ? "input-shell--error" : ""}`}>
        <label className="input-label">{label}</label>
        <div className="flex items-center">
          <FieldIcon>
            <LocationPinIcon />
          </FieldIcon>
          <input
            value={displayValue}
            onChange={(event) => handleManualChange(event.target.value)}
            onFocus={() => {
              if (results.length > 0) {
                setIsOpen(true);
              }
            }}
            placeholder={placeholder}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            className="w-full bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted/60"
          />
        </div>
      </div>

      {isOpen && results.length > 0 ? (
        <ul
          id={listboxId}
          className="suggestions-panel absolute z-20 mt-1 max-h-56 w-full overflow-auto py-1"
        >
          {results.map((result) => (
            <li key={result.placeId}>
              <button
                type="button"
                onClick={() => handleSelect(result)}
                className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-accent-light"
              >
                {result.address}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
      {isLoading ? <p className="mt-1 text-xs text-muted">Searching...</p> : null}
      {searchError ? <p className="mt-1 text-xs text-muted">{searchError}</p> : null}
    </div>
  );
}
