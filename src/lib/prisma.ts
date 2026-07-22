import { PrismaClient } from "@prisma/client";

// Instantiate a single PrismaClient and reuse it across hot reloads in dev,
// otherwise Next.js's fast refresh spawns a new client (and connection pool)
// on every change and exhausts the database's connection limit.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
