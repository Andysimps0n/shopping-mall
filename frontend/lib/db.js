import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../backend/generated/prisma/client.js";

const globalForPrisma = globalThis;

function createPrisma() {

  // create connection to Postgres
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}


// This lets to run JS with prisma
export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

