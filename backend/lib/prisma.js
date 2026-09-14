import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { postgresConnectionString } from "./postgresUrl.js";

// Prisma 7 talks to Postgres through the `pg` driver adapter.
// This is still the ORM client — not Prisma 8 Composer contracts.
const adapter = new PrismaPg({
  connectionString: postgresConnectionString(process.env.DATABASE_URL),
});

export const prisma = new PrismaClient({ adapter });
