import { existsSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// npm workspaces hoist @prisma/client to the repo root.
// `prisma generate` looks next to backend/package.json, so we point
// backend/node_modules/@prisma/client at the real installed package.
const require = createRequire(import.meta.url);
const backendRoot = fileURLToPath(new URL("..", import.meta.url));
const realClient = dirname(require.resolve("@prisma/client/package.json"));
const localClient = join(backendRoot, "node_modules/@prisma/client");

if (existsSync(join(localClient, "package.json"))) {
  process.exit(0);
}

mkdirSync(dirname(localClient), { recursive: true });
if (existsSync(localClient)) {
  rmSync(localClient, { recursive: true, force: true });
}

symlinkSync(realClient, localClient);
