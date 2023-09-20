import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/lib/supabase-client";
import { DbResult } from "@/database.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const query = supabase
        .from("alterations")
        .select("*, price:price_id(*)")
        .order("created_at", { ascending: false });
      const result: DbResult<typeof query> = await query;

      res.status(200).json(result.data);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }

    return;
  }

  res.status(405).end(); // Method Not Allowed
}
