// What: JSON Schemas for the properties module: what requests must look
// like, and what responses are allowed to contain.
// Why:
// - Request schemas: Fastify rejects bad input with a 400 BEFORE your
//   handler runs, so handlers only ever see clean, typed data.
// - Response schemas: Fastify sends ONLY the fields listed here and turns
//   objects into JSON faster. A field you forget to list is never leaked.
// - Shared pieces (propertyFields, the "Property" schema) are written once
//   and reused, so create, update and responses can't drift apart.

const CURRENCIES = ["PKR", "USD"];

// Field rules shared by create and update. No `required` and no defaults
// here: each schema below decides those for itself.
const propertyFields = {
  title: { type: "string", minLength: 3, maxLength: 120 },
  description: { type: ["string", "null"], maxLength: 2000 },
  city: { type: "string", minLength: 2, maxLength: 60 },
  address: { type: "string", minLength: 5, maxLength: 200 },
  price: { type: "integer", minimum: 0 },
  currency: { type: "string", enum: CURRENCIES },
  bedrooms: { type: "integer", minimum: 0, maximum: 50 },
  bathrooms: { type: "integer", minimum: 0, maximum: 50 },
  isAvailable: { type: "boolean" },
};

// Shared response schema. Registered with app.addSchema() and reused
// anywhere with { $ref: "Property#" }.
export const propertySchema = {
  $id: "Property",
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: ["string", "null"] },
    city: { type: "string" },
    address: { type: "string" },
    price: { type: "integer" },
    currency: { type: "string" },
    bedrooms: { type: "integer" },
    bathrooms: { type: "integer" },
    isAvailable: { type: "boolean" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const idParams = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string", format: "uuid" },
  },
};

const notFoundResponse = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
};

const singlePropertyResponse = {
  type: "object",
  properties: {
    data: { $ref: "Property#" },
  },
};

// GET /properties?city=Lahore&limit=10
export const listPropertiesSchema = {
  querystring: {
    type: "object",
    properties: {
      city: { type: "string", minLength: 2 },
      limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: { type: "array", items: { $ref: "Property#" } },
      },
    },
  },
};

// GET /properties/:id
export const getPropertySchema = {
  params: idParams,
  response: {
    200: singlePropertyResponse,
    404: notFoundResponse,
  },
};

// POST /properties
export const createPropertySchema = {
  body: {
    type: "object",
    required: ["title", "city", "address", "price", "bedrooms", "bathrooms"],
    additionalProperties: false,
    properties: {
      ...propertyFields,
      currency: { ...propertyFields.currency, default: "PKR" },
    },
  },
  response: {
    201: singlePropertyResponse,
  },
};

// PATCH /properties/:id (send only the fields you want to change)
export const updatePropertySchema = {
  params: idParams,
  body: {
    type: "object",
    minProperties: 1,
    additionalProperties: false,
    properties: propertyFields,
  },
  response: {
    200: singlePropertyResponse,
    404: notFoundResponse,
  },
};

// DELETE /properties/:id
export const deletePropertySchema = {
  params: idParams,
  response: {
    404: notFoundResponse,
  },
};
