-- CreateTable
CREATE TABLE "customers" (
    "phone" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("phone")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "service_type" TEXT NOT NULL,
    "pickup_date" TEXT NOT NULL,
    "pickup_time" TEXT NOT NULL,
    "pickup_address" TEXT NOT NULL,
    "dropoff_address" TEXT,
    "stops_json" TEXT NOT NULL DEFAULT '[]',
    "hourly_duration" INTEGER,
    "phone" TEXT NOT NULL,
    "customer_name" TEXT,
    "email" TEXT,
    "passengers" INTEGER NOT NULL,
    "distance_meters" INTEGER,
    "duration_seconds" INTEGER,
    "payload_json" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_phone_fkey" FOREIGN KEY ("phone") REFERENCES "customers"("phone") ON DELETE RESTRICT ON UPDATE CASCADE;
