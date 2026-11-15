// What: the one place that reads environment variables.
// Why: every other file imports `config` instead of touching process.env,
// so settings are checked once at startup and a missing value fails fast.

const nodeEnv = process.env.NODE_ENV ?? "development";

export const config = Object.freeze({
  nodeEnv,
  isDev: nodeEnv === "development",
  host: process.env.HOST ?? "127.0.0.1",
  port: Number(process.env.PORT ?? 3000),
  logLevel: process.env.LOG_LEVEL ?? "info",
  databaseUrl: process.env.DATABASE_URL,
});

if (Number.isNaN(config.port)) {
  throw new Error("PORT must be a number");
}

if (!config.databaseUrl) {
  throw new Error("DATABASE_URL is missing. Add it to your .env file.");
}
