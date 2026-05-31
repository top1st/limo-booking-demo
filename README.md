# Limo Booking Skills Test Demo

A full-stack booking form demo for airport transportation and limousine reservations. Built with **Next.js**, **TypeScript**, **Tailwind CSS**, **PostgreSQL**, **Prisma**, and switchable maps providers (**OpenStreetMap** or **Google Maps**).

![ExampleIQ booking form](public/logo.svg)

## Features

- Booking form UI matching the provided design (gold accent, floating labels, segmented toggles)
- Responsive layout (mobile-first)
- Client and server-side validation with **Zod** + **react-hook-form**
- Switchable maps provider via env (`MAPS_PROVIDER=google|osm`)
- **OpenStreetMap (default):** Photon geocoding + OSRM routing — no billing required
- **Google Maps (optional):** Places Autocomplete + Directions API
- Phone lookup with PostgreSQL persistence via **Prisma**
  - Known numbers: greet returning customers by first name
  - Unknown numbers: collect first name, last name, and email
- Mock booking API with persisted records

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL database (local or hosted)

## Quick Start

```bash
git clone https://github.com/top1st/limo-booking-demo.git
cd limo-booking-demo
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/limo_booking?schema=public

NEXT_PUBLIC_MAPS_PROVIDER=osm
MAPS_PROVIDER=osm
NOMINATIM_USER_AGENT=limo-booking-demo/1.0 (your-email@example.com)
PHOTON_BASE_URL=https://photon.komoot.io
OSRM_BASE_URL=https://router.project-osrm.org
```

Install, migrate, seed, and run:

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If you prefer pushing schema without migration history:

```bash
npm run db:push
npm run db:seed
```

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

### `GET /api/customers/lookup?phone=+15551234567`

Look up a customer by phone number.

### `POST /api/route/estimate`

Calculate driving distance and duration using **OSRM** (default) or **Google Directions**.

### `POST /api/bookings`

Submit a validated booking.

## Project Structure

```
app/
  api/places/search/      # Photon geocoding (OSM)
  api/customers/lookup/   # Phone lookup
  api/route/estimate/     # OSRM or Google Directions
  api/bookings/           # Booking submission
components/
  LocationAutocomplete.tsx
  GooglePlacesAutocomplete.tsx
  OsmPlacesAutocomplete.tsx
lib/
  prisma.ts               # Prisma client singleton
  db.ts                   # Customer/booking data access
  maps/                   # Maps providers
prisma/
  schema.prisma           # PostgreSQL schema
  seed.ts                 # Seed script
data/seed.json            # Demo customer seed data
```

## Tech Choices

- **Next.js App Router** — single repo with API routes for a clean full-stack demo
- **PostgreSQL + Prisma** — typed ORM with migrations for customers and bookings
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
| `npm run test` | Run all tests (API + frontend) |
| `npm run test:api` | Run API route tests only |
| `npm run test:frontend` | Run frontend/component tests only |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations (dev) |
| `npm run db:push` | Push schema without migration files |
| `npm run db:seed` | Seed demo customers |

## Testing

The project uses **Vitest** + **Testing Library** and is split into two suites:

- **API tests** (`tests/api`) for route handlers:
  - `GET /api/customers/lookup`
  - `POST /api/bookings`
- **Frontend tests** (`tests/frontend`) for key UI behavior:
  - Home page render
  - Service type toggle interactions
  - Floating input error rendering

Run commands:

```bash
npm run test:api
npm run test:frontend
npm run test
```

Latest local verification:

- `test:api` passed (`5/5`)
- `test:frontend` passed (`3/3`)
- `test` passed (`8/8`)

## Notes

- **Photon** (`photon.komoot.io`) provides OSM-based geocoding; configure `PHOTON_BASE_URL` if you self-host.
- **OSRM** public demo server (`router.project-osrm.org`) is for non-production use; configure `OSRM_BASE_URL` for production.
- **`NOMINATIM_USER_AGENT`** is sent as a contact `User-Agent` header on geocoding requests.
- Location search requires at least **3 characters** before suggestions appear.
- Hourly trips hide the drop-off section and require a duration (1–12 hours).

## License

MIT
