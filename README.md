# Limo Booking Skills Test Demo

A full-stack booking form demo for airport transportation and limousine reservations. Built with **Next.js**, **TypeScript**, **Tailwind CSS**, **SQLite**, and switchable maps providers (**OpenStreetMap** or **Google Maps**).

![ExampleIQ booking form](public/logo.svg)

## Features

- Booking form UI matching the provided design (gold accent, floating labels, segmented toggles)
- Responsive layout (mobile-first)
- Client and server-side validation with **Zod** + **react-hook-form**
- Switchable maps provider via env (`MAPS_PROVIDER=google|osm`)
- **OpenStreetMap (default):** Photon geocoding + OSRM routing — no billing required
- **Google Maps (optional):** Places Autocomplete + Directions API
- Phone lookup with SQLite persistence
  - Known numbers: greet returning customers by first name
  - Unknown numbers: collect first name, last name, and email
- Mock booking API with persisted records

## Prerequisites

- Node.js 20+
- npm

## Quick Start (OpenStreetMap — default, free)

```bash
git clone https://github.com/top1st/limo-booking-demo.git
cd limo-booking-demo
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_MAPS_PROVIDER=osm
MAPS_PROVIDER=osm
NOMINATIM_USER_AGENT=limo-booking-demo/1.0 (your-email@example.com)
PHOTON_BASE_URL=https://photon.komoot.io
OSRM_BASE_URL=https://router.project-osrm.org
```

Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No Google Cloud billing is required for the default OSM setup.

## Switch to Google Maps

Set in `.env.local`:

```env
NEXT_PUBLIC_MAPS_PROVIDER=google
MAPS_PROVIDER=google
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
GOOGLE_MAPS_API_KEY=your_key_here
```

Enable in Google Cloud Console:

1. [Places API (New)](https://developers.google.com/maps/documentation/places/web-service/overview)
2. [Directions API](https://developers.google.com/maps/documentation/directions/overview)

Restart the dev server after changing providers.

## Demo Phone Numbers

| Phone | Result |
|---|---|
| `+1 555 123 4567` | Known customer — greeted as **Jane** |
| `+1 617 555 1234` | Known customer — greeted as **Michael** |
| Any other valid US number | Unknown — shows extra contact fields |

After submitting a booking with a new phone number, that number is saved. A second booking with the same number will greet the customer by name.

## API Reference

### `GET /api/places/search?q=...&type=location|airport`

OpenStreetMap place search via **Photon** (Komoot). Used when `MAPS_PROVIDER=osm`.

**Response:**

```json
{
  "results": [
    {
      "placeId": "osm:relation:2315704",
      "address": "Boston, Massachusetts, USA",
      "lat": 42.3588336,
      "lng": -71.0578303
    }
  ]
}
```

### `GET /api/customers/lookup?phone=+15551234567`

Look up a customer by phone number.

**Response (found):**

```json
{
  "found": true,
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com"
}
```

**Response (not found):**

```json
{
  "found": false
}
```

### `POST /api/route/estimate`

Calculate driving distance and duration using **OSRM** (default) or **Google Directions**.

**Request:**

```json
{
  "pickup": { "placeId": "...", "address": "...", "lat": 42.36, "lng": -71.01 },
  "dropoff": { "placeId": "...", "address": "...", "lat": 42.37, "lng": -71.02 },
  "stops": []
}
```

**Response:**

```json
{
  "estimate": {
    "distanceMeters": 67500,
    "durationSeconds": 3480,
    "distanceText": "41.9 mi",
    "durationText": "58 min"
  }
}
```

### `POST /api/bookings`

Submit a validated booking.

**Response:**

```json
{
  "success": true,
  "bookingId": "bk_a1b2c3d4",
  "message": "Booking received",
  "summary": { "...": "..." }
}
```

## Project Structure

```
app/
  api/places/search/      # Photon geocoding (OSM)
  api/customers/lookup/   # Phone lookup
  api/route/estimate/     # OSRM or Google Directions
  api/bookings/           # Booking submission
components/
  LocationAutocomplete.tsx    # picks google | osm from env
  GooglePlacesAutocomplete.tsx
  OsmPlacesAutocomplete.tsx
lib/maps/
  provider.ts             # google | osm switch
  photon.ts               # OSM place search
  osm.ts                  # OSRM routing
  google.ts               # Google Directions
  index.ts
data/seed.json            # Pre-seeded customers
```

## Tech Choices

- **Next.js App Router** — single repo with API routes for a clean full-stack demo
- **SQLite (better-sqlite3)** — zero-config local persistence for customers and bookings
- **Zod** — shared validation on client and server
- **OpenStreetMap stack** — Photon (search) + OSRM (routing), free for local demo
- **Google Maps** — optional provider when billing/API keys are available


## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (uses webpack on Windows) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Notes

- **Photon** (`photon.komoot.io`) provides OSM-based geocoding; configure `PHOTON_BASE_URL` if you self-host.
- **OSRM** public demo server (`router.project-osrm.org`) is for non-production use; configure `OSRM_BASE_URL` for production.
- **`NOMINATIM_USER_AGENT`** is sent as a contact `User-Agent` header on geocoding requests (good practice for public OSM services).
- Location search requires at least **3 characters** before suggestions appear.
- SQLite is intended for local development. For cloud deployment, swap to a hosted database (e.g. Turso/libSQL).
- Hourly trips hide the drop-off section and require a duration (1–12 hours).

## License

MIT
