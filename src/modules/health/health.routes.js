export default async function healthRoutes(app) {
  app.get("/health", async () => {
    return {
      status: "ok",
      app: app.appInfo.name,
      version: app.appInfo.version,
      uptimeSeconds: Math.round(process.uptime()),
    };
  });
}
