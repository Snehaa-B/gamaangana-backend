import { PrismaClient } from "@prisma/client";

// Create a single shared PrismaClient instance for the whole app.
// Re-creating PrismaClient on every request is expensive and exhausts
// the database connection pool.

const prisma = new PrismaClient({
  log: ["query", "warn", "error"],
});

export default prisma;
