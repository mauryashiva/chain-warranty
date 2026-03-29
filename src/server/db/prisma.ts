// src/server/db/prisma.ts

import { PrismaClient } from "@prisma/client";

// Extend global type to avoid multiple instances in dev
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create Prisma client (singleton pattern)
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"], // helpful for debugging
  });

// Save instance in global (only in development)
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
