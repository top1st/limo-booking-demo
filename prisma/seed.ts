import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";
import path from "path";
import { normalizePhone } from "../lib/phone";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  const seedPath = path.join(process.cwd(), "data", "seed.json");
  const seedData = JSON.parse(fs.readFileSync(seedPath, "utf-8")) as Array<{
    phone: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;

  for (const customer of seedData) {
    const phone = normalizePhone(customer.phone);

    await prisma.customer.upsert({
      where: { phone },
      create: {
        phone,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
      },
      update: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
      },
    });
  }

  console.log(`Seeded ${seedData.length} customers`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
