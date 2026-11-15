import fp from "fastify-plugin";

async function appInfoPlugin(app, options) {
  app.decorate("appInfo", {
    name: options.name,
    version: options.version,
    startedAt: new Date().toISOString(),
  });

  app.addHook("onClose", async () => {
    app.log.info("app-info plugin is closing");
  });
}

export default fp(appInfoPlugin, {
  name: "app-info",
  fastify: "5.x",
});
