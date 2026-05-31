import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import type { BookingPayload, CustomerLookupResult, RouteEstimate } from "./types";
import { normalizePhone } from "./phone";

let db: Database.Database | null = null;

function getDatabasePath() {
  const configured = process.env.DATABASE_PATH;
  if (configured) {
    return path.isAbsolute(configured)
      ? configured
      : path.join(process.cwd(), configured);
  }

  return path.join(process.cwd(), "data", "booking.db");
}

function seedCustomers(database: Database.Database) {
  const seedPath = path.join(process.cwd(), "data", "seed.json");

  if (!fs.existsSync(seedPath)) {
    return;
  }

  const seedData = JSON.parse(fs.readFileSync(seedPath, "utf-8")) as Array<{
    phone: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;

  const insert = database.prepare(`
    INSERT OR IGNORE INTO customers (phone, first_name, last_name, email)
    VALUES (@phone, @firstName, @lastName, @email)
  `);

  for (const customer of seedData) {
    insert.run({
      phone: normalizePhone(customer.phone),
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
    });
  }
}

export function getDb() {
  if (db) {
    return db;
  }

  const dbPath = getDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      phone TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      service_type TEXT NOT NULL,
      pickup_date TEXT NOT NULL,
      pickup_time TEXT NOT NULL,
      pickup_address TEXT NOT NULL,
      dropoff_address TEXT,
      stops_json TEXT NOT NULL DEFAULT '[]',
      hourly_duration INTEGER,
      phone TEXT NOT NULL,
      customer_name TEXT,
      email TEXT,
      passengers INTEGER NOT NULL,
      distance_meters INTEGER,
      duration_seconds INTEGER,
      payload_json TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedCustomers(db);
  return db;
}

export function lookupCustomer(phone: string): CustomerLookupResult {
  const database = getDb();
  const normalized = normalizePhone(phone);

  const row = database
    .prepare(
      `SELECT first_name, last_name, email FROM customers WHERE phone = ?`,
    )
    .get(normalized) as
    | { first_name: string; last_name: string; email: string }
    | undefined;

  if (!row) {
    return { found: false };
  }

  return {
    found: true,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
  };
}

export function upsertCustomer(input: {
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
}) {
  const database = getDb();
  const normalized = normalizePhone(input.phone);

  database
    .prepare(
      `
      INSERT INTO customers (phone, first_name, last_name, email)
      VALUES (@phone, @firstName, @lastName, @email)
      ON CONFLICT(phone) DO UPDATE SET
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        email = excluded.email
    `,
    )
    .run({
      phone: normalized,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
    });
}

export function saveBooking(
  payload: BookingPayload & { routeEstimate?: RouteEstimate },
  bookingId: string,
) {
  const database = getDb();
  const normalizedPhone = normalizePhone(payload.phone);
  const customerName =
    payload.firstName && payload.lastName
      ? `${payload.firstName} ${payload.lastName}`
      : lookupCustomer(normalizedPhone).firstName ?? undefined;

  database
    .prepare(
      `
      INSERT INTO bookings (
        id,
        service_type,
        pickup_date,
        pickup_time,
        pickup_address,
        dropoff_address,
        stops_json,
        hourly_duration,
        phone,
        customer_name,
        email,
        passengers,
        distance_meters,
        duration_seconds,
        payload_json
      ) VALUES (
        @id,
        @serviceType,
        @pickupDate,
        @pickupTime,
        @pickupAddress,
        @dropoffAddress,
        @stopsJson,
        @hourlyDuration,
        @phone,
        @customerName,
        @email,
        @passengers,
        @distanceMeters,
        @durationSeconds,
        @payloadJson
      )
    `,
    )
    .run({
      id: bookingId,
      serviceType: payload.serviceType,
      pickupDate: payload.pickupDate,
      pickupTime: payload.pickupTime,
      pickupAddress: payload.pickupLocation.address,
      dropoffAddress: payload.dropoffLocation?.address ?? null,
      stopsJson: JSON.stringify(payload.stops),
      hourlyDuration: payload.hourlyDuration ?? null,
      phone: normalizedPhone,
      customerName: customerName ?? null,
      email: payload.email ?? null,
      passengers: payload.passengers,
      distanceMeters: payload.routeEstimate?.distanceMeters ?? null,
      durationSeconds: payload.routeEstimate?.durationSeconds ?? null,
      payloadJson: JSON.stringify(payload),
    });
}
