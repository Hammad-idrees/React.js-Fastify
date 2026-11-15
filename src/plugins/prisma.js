// What: the database plugin. It creates ONE Prisma client for the whole app
// and exposes it as `app.prisma`.
// Why:
// - One client means one connection pool. Creating a client per request
//   would open new connections every time and quickly exhaust Postgres.
// - fp() shares the decorator with every module.
// - The test query makes the server refuse to start if the database is
//   unreachable, instead of failing on the first real request.
// - onClose closes the connections when the server shuts down.

import fp from "fastify-plugin";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

async function prismaPlugin(app, options) {
  const adapter = new PrismaPg({ connectionString: options.connectionString });
  const prisma = new PrismaClient({ adapter });

  await prisma.$queryRaw`SELECT 1`;
  app.log.info("Database connected");

  app.decorate("prisma", prisma);

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
    app.log.info("Database disconnected");
  });
}

export default fp(prismaPlugin, {
  name: "prisma",
  fastify: "5.x",
});
