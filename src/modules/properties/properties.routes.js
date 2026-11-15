// What: the properties module. For now it only lists properties from the database.
// Why: this is a module plugin, so it is NOT wrapped in fp. Its hook and
// decorator stay private to /properties routes. Full CRUD comes in Milestone 3.

export default async function propertyRoutes(app) {
  app.decorate("moduleName", "properties");

  app.addHook("onRequest", async (request, reply) => {
    reply.header("X-Module-Name", app.moduleName);
  });

  // GET /properties (the prefix comes from app.js)
  app.get("/", async () => {
    const properties = await app.prisma.property.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { data: properties };
  });
}
