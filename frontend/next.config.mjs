import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This app lives in frontend/. Without this, Next may pick a lockfile
  // outside the mall repo (home folder) as the workspace root and mix
  // in a different React version.
  outputFileTracingRoot: path.join(__dirname, ".."),
};

export default nextConfig;
