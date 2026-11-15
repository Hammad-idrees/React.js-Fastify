import Fasify from "fastify";
import { config } from "./config/env.js";
import appInfo from "./plugins/app-info.js";
import healthRoutes from "./modules/health/health.routes.js";
import propertyRoutes from "./modules/properties/properties.routes.js";

function loggerOptions() {
  if (config.isDev) {
    return {
      level: config.logLevel,
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    };
  }
  return {
    level: config.logLevel,
  };
}

export function buildApp(options = {}) {
  const app = Fasify({
    logger: loggerOptions(),
    ...options,
  });
  app.register(appInfo, {
    name: "rentify",
    version: "1.0.0",
  });
  app.register(healthRoutes);
  app.register(propertyRoutes, { prefix: "/properties" });
  return app;
}
