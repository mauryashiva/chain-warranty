import { PrismaClient } from "@prisma/client";

// Extend global type to avoid multiple instances in dev
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 🛡️ Optimized for Supabase + Slow Internet
// We add "connect_timeout" and "pool_timeout" to the URL dynamically
const connectionString = `${process.env.DATABASE_URL}${
  process.env.DATABASE_URL?.includes("?") ? "&" : "?"
}connect_timeout=30&pool_timeout=30&socket_timeout=30`;

// Create Prisma client (singleton pattern)
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
    datasources: {
      db: {
        url: connectionString,
      },
    },
  });

// Save instance in global (only in development)
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
