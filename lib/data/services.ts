import { Prisma } from "@prisma/client";
import prisma from "@/lib/client";

export const getPrices = async () => {
  const services = await prisma.price_categories.findMany({
    select: {
      category: true,
      prices: {
        where: {
          outside_garment: false,
        },
        select: {
          price: true,
          service: true,
          outside_garment: true,
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
