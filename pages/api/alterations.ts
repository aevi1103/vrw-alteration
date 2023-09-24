import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/lib/supabase-client";
import { DbResult } from "@/database.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { paid } = req.query;

      const data = await getAlterations({
        paid: paid === "true" ? true : paid === "false" ? false : undefined,
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

async function getAlterations({ paid }: { paid?: boolean }) {
  const query = supabase
    .from("alterations")
    .select(
      `*, 
          alteration_items(qty,
            items(description),
             alteration_services(
              prices(service, price))
          )`
    )
    .order("paid", { ascending: true })
    .order("created_at", { ascending: true });

  if (paid !== undefined) {
    query.eq("paid", paid);
  }

  const result: DbResult<typeof query> = await query;

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

interface Price {
  service: string;
  price: number;
}

interface Item {
  description: string;
}

interface AlterationService {
  prices: Price;
}

interface AlterationItem {
  qty: number;
  items: Item;
  alteration_services: AlterationService[];
}

export interface Alteration {
  id: number;
  created_at: string;
  ticket_num: number;
  sales_person: string;
  customer_name: string;
  customer_user_id: null | string;
  remarks: string;
  paid: boolean;
  updated_at: null | string;
  created_by: string;
  alteration_items: AlterationItem[];
  totalUnitPrice?: number;
  totalQty?: number;
  totalAmount?: number;
}
