// What: fills the database with sample properties for development.
// Why: you need data to test GET /properties. Run it with `npm run db:seed`.
// It deletes existing properties first, so running it twice doesn't create duplicates.
// It's a standalone script, not part of the server, so it creates its own client.

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const properties = [
  {
    title: "Luxury House",
    description: "Five-bedroom house with a garden",
    city: "Islamabad",
    address: "F-7/2, Street 12",
    price: 350000,
    bedrooms: 5,
    bathrooms: 4,
  },
  {
    title: "City Apartment",
    city: "Lahore",
    address: "Gulberg III, Main Boulevard",
    price: 120000,
    bedrooms: 2,
    bathrooms: 2,
  },
  {
    title: "Sea View Flat",
    description: "Third floor flat near the beach",
    city: "Karachi",
    address: "DHA Phase 8, Khayaban-e-Ittehad",
    price: 180000,
    bedrooms: 3,
    bathrooms: 2,
    isAvailable: false,
  },
];

async function main() {
  await prisma.property.deleteMany();
  const result = await prisma.property.createMany({ data: properties });
  console.log(`Seeded ${result.count} properties`);
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
