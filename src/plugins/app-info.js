// What: a shared plugin that adds `app.appInfo` (name, version, start time).
// Why: wrapped in fastify-plugin (fp) so the decorator is visible to every
// module, not just inside this plugin.

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
