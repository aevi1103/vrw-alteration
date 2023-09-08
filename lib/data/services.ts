import { Prisma } from "@prisma/client";
import prisma from "@/lib/client";

export const getPrices = async () => {
  const services = await prisma.categories.findMany({
    select: {
      category: true,
      prices: {
        select: {
          price: true,
          service: true,
        },
        orderBy: {
          service: "asc",
        },
      },
    },
  });

  return services;
};

export type PricesResult = Prisma.PromiseReturnType<typeof getPrices>;
