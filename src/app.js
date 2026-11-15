// What: builds the Fastify app (plugins, then modules) but does NOT start it.
// Why: server.js starts it for real, and tests (Milestone 5) will call
// buildApp() and send fake requests without opening a port.
// Order matters: shared plugins first, so modules can use what they add.

import Fastify from "fastify";
import { config } from "./config/env.js";
import appInfo from "./plugins/app-info.js";
import prisma from "./plugins/prisma.js";
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
  const app = Fastify({
    logger: loggerOptions(),
    ...options,
  });

  // 1. Shared plugins
  app.register(appInfo, {
    name: "rentify",
    version: "1.0.0",
  });
  app.register(prisma, { connectionString: config.databaseUrl });

  // 2. Feature modules
  app.register(healthRoutes);
  app.register(propertyRoutes, { prefix: "/properties" });

  return app;
}
