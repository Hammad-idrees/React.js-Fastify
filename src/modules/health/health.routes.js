// What: GET /health, which reports whether the API and database are working.
// Why: monitoring tools and load balancers call this endpoint. It returns
// 503 when the database is down, so they know to stop sending traffic.

export default async function healthRoutes(app) {
  app.get("/health", async (request, reply) => {
    let database = "up";

    try {
      await app.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      request.log.error(error, "Database health check failed");
      database = "down";
    }

    reply.code(database === "up" ? 200 : 503);

    return {
      status: database === "up" ? "ok" : "degraded",
      app: app.appInfo.name,
      version: app.appInfo.version,
      database,
      uptimeSeconds: Math.round(process.uptime()),
    };
  });
}
