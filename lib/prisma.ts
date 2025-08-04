// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // agar tidak instansi ulang di development
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;