import { NextApiRequest, NextApiResponse } from "next";
import { getAlterations } from "@/supabase/data/alteration";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { paid, uuid, id } = req.query;

      const data = await getAlterations({
        paid: paid === "true" ? true : paid === "false" ? false : undefined,
        uuid: uuid as string,
        id: id as string,
      });

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }

    return;
  }

  res.status(405).end(); // Method Not Allowed
}
