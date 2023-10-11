import { NextApiRequest, NextApiResponse } from "next";
import { getPrices } from "@/supabase/data/alteration";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const prices = await getPrices();
      res.status(200).json(prices);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
