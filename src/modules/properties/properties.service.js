// What: all database work for properties (the "service" layer).
// Why: routes deal with HTTP (status codes, request, reply); the service
// deals with data. Keeping them apart means the same logic can later be
// reused (e.g. by the admin module) and tested without HTTP.
// It receives `prisma` as an argument instead of importing it, so tests
// can pass in a different database client.

// Prisma's error code for "the record you tried to update/delete doesn't exist".
const RECORD_NOT_FOUND = "P2025";

export function createPropertyService(prisma) {
  return {
    list({ city, limit }) {
      return prisma.property.findMany({
        where: city ? { city: { equals: city, mode: "insensitive" } } : {},
        orderBy: { createdAt: "desc" },
        take: limit,
      });
    },

    findById(id) {
      return prisma.property.findUnique({ where: { id } });
    },

    create(data) {
      return prisma.property.create({ data });
    },

    // Returns the updated property, or null if it doesn't exist.
    async update(id, data) {
      try {
        return await prisma.property.update({ where: { id }, data });
      } catch (error) {
        if (error.code === RECORD_NOT_FOUND) return null;
        throw error;
      }
    },

    // Returns true if deleted, false if it didn't exist.
    async remove(id) {
      try {
        await prisma.property.delete({ where: { id } });
        return true;
      } catch (error) {
        if (error.code === RECORD_NOT_FOUND) return false;
        throw error;
      }
    },
  };
}
