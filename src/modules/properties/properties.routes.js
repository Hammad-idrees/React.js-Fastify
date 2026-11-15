// What: the HTTP side of the properties module: 5 routes for full CRUD.
// Why: each route connects a URL + method to a schema (validation and
// response shape) and a short handler that calls the service.
// This is a module plugin, NOT wrapped in fp, so its schemas, hook and
// decorator stay private to /properties.

import { createPropertyService } from "./properties.service.js";
import {
  propertySchema,
  listPropertiesSchema,
  getPropertySchema,
  createPropertySchema,
  updatePropertySchema,
  deletePropertySchema,
} from "./properties.schemas.js";

export default async function propertyRoutes(app) {
  const properties = createPropertyService(app.prisma);

  // Makes { $ref: "Property#" } work inside this module.
  app.addSchema(propertySchema);

  app.decorate("moduleName", "properties");

  app.addHook("onRequest", async (request, reply) => {
    reply.header("X-Module-Name", app.moduleName);
  });

  // GET /properties
  app.get("/", { schema: listPropertiesSchema }, async (request) => {
    const data = await properties.list(request.query);
    return { data };
  });

  // GET /properties/:id
  app.get("/:id", { schema: getPropertySchema }, async (request, reply) => {
    const property = await properties.findById(request.params.id);

    if (!property) {
      return reply.code(404).send({ message: "Property not found" });
    }

    return { data: property };
  });

  // POST /properties
  app.post("/", { schema: createPropertySchema }, async (request, reply) => {
    const property = await properties.create(request.body);
    return reply.code(201).send({ data: property });
  });

  // PATCH /properties/:id
  app.patch(
    "/:id",
    { schema: updatePropertySchema },
    async (request, reply) => {
      const property = await properties.update(request.params.id, request.body);

      if (!property) {
        return reply.code(404).send({ message: "Property not found" });
      }

      return { data: property };
    },
  );

  // DELETE /properties/:id
  app.delete(
    "/:id",
    { schema: deletePropertySchema },
    async (request, reply) => {
      const deleted = await properties.remove(request.params.id);

      if (!deleted) {
        return reply.code(404).send({ message: "Property not found" });
      }

      return reply.code(204).send();
    },
  );
}
