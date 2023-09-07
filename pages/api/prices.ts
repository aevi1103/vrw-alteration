import { NextApiRequest, NextApiResponse } from "next";
import { getPrices } from "@/lib/data/services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const prices = await getPrices();
      // Return a success response
      res.status(200).json(prices);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
