import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    "info" | "warn" | "error" | "query"
  >;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient<
    Prisma.PrismaClientOptions,
    "query" | "info" | "warn" | "error"
  >({
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: "stdout",
        level: "error",
      },
      {
        emit: "stdout",
        level: "info",
      },
      {
        emit: "stdout",
        level: "warn",
      },
    ],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// if (process.env.NODE_ENV !== "production") {
//   prisma.$on("query", (e: Prisma.QueryEvent) => {
//     console.info("------------------------------------------------------");
//     console.info("Query: " + e.query + "\n");
//     console.info("Params: " + e.params + "\n");
//     console.info("Duration: " + e.duration + "ms");
//     console.info("------------------------------------------------------");
//   });
// }
