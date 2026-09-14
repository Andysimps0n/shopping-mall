import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Next.js only auto-loads frontend/.env*. OAuth and SESSION_SECRET live
// next to Prisma in backend/.env — load them into this process so API
// routes can read them. dotenv does not override vars that are already set.
loadEnv({ path: path.join(__dirname, "../backend/.env") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This app lives in frontend/. Without this, Next may pick a lockfile
  // outside the mall repo (home folder) as the workspace root and mix
  // in a different React version.
  outputFileTracingRoot: path.join(__dirname, ".."),
  // Keep a visited / prefetched product page for 30s so going
  // grid → PDP → back → same card does not wait on the server again.
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
