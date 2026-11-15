const nodeEnv = process.env.NODE_ENV ?? "development";

export const config = Object.freeze({
  nodeEnv,
  isDev: nodeEnv === "development",
  host: process.env.HOST ?? "127.0.0.1",
  port: Number(process.env.PORT ?? 3000),
  logLevel: process.env.LOG_LEVEL ?? "info",
});

if (Number.isNaN(config.port)) {
  throw new Error("PORT must be a number");
}
