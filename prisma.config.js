// What: settings for the Prisma CLI (migrate, generate, seed, studio).
// Why: Prisma 7 moved the database URL out of schema.prisma into this file.
// Prisma 7 does NOT read .env by itself, so we load it here with dotenv.
// Only the CLI uses this file. The running app gets the URL from src/config/env.js.

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

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
