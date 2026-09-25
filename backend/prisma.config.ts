import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 CLI config (not Prisma 8 Composer contracts).
// DATABASE_URL is read from backend/.env
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
