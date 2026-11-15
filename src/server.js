import { buildApp } from "./app.js";
import { config } from "./config/env.js";

const app = buildApp();

async function start() {
  try {
    await app.listen({ host: config.host, port: config.port });

    if (config.isDev) {
      console.log(app.printRoutes());
      console.log(app.printPlugins());
    }
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

// Graceful shutdown: finish open requests, run onClose hooks, then exit.
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    app.log.info({ signal }, "Shutting down");
    await app.close();
    process.exit(0);
  });
}

start();
