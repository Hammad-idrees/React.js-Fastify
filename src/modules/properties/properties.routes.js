export default async function propertyRoutes(app) {
  app.decorate("moduleName", "properties");

  app.addHook("onRequest", async (request, reply) => {
    reply.header("X-Module-Name", app.moduleName);
  });

  app.get("/", async () => {
    return { data: [] };
  });
}
