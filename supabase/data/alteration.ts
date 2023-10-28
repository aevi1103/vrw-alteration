import { DbResult } from "@/database.types";
import { PriceCategoryOption } from "@/lib/types/alteration";
import supabase from "../supabase-client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

interface Price {
  id: string;
  created_at: string;
  category_id: string;
  service: string;
  price: number;
}

interface Item {
  created_at: string;
  description: string;
  id: string;
}

interface AlterationService {
  id: number;
  created_at: string;
  alteration_item_id: string;
  price_id: string;
  prices: Price;
}

export interface AlterationItem {
  created_at: string;
  alteration_id: number;
  id: string;
  item_id: string;
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
  uuid?: string;
}

export async function getPrices() {
  const query = supabase
    .from("categories")
    .select("*, prices(id, price, service))");

  const prices: DbResult<typeof query> = await query;
  const result = prices?.data || [];

  const categories: PriceCategoryOption[] = result.map(
    ({ category, prices }: any) => ({
      label: category,
      options: prices.map(({ service, id, price }: any) => ({
        label: `${service} - $${price}`,
        value: id,
        price,
      })),
    })
  );

  return categories;
}

export async function getItems() {
  const query = supabase.from("items").select("*");
  const items: DbResult<typeof query> = await query;

  const res =
    items.data?.map(({ id, description }: any) => ({
      label: description,
      value: id,
    })) || [];

  return res;
}

interface GetAlterationsProps {
  uuid?: string;
  paid?: boolean;
  id?: string;
  startDate?: string;
  endDate?: string;
}

export async function getAlterations({
  uuid,
  paid,
  id,
  startDate,
  endDate,
}: GetAlterationsProps): Promise<Alteration[]> {
  const query = supabase
    .from("alterations")
    .select(
      `*, 
          alteration_items(*,
            items(*),
             alteration_services(*,
              prices(*))
          )`
    )
    // .order("paid", { ascending: true })
    .order("created_at", { ascending: false });

  if (uuid) {
    query.eq("uuid", uuid);
  }

  if (id) {
    query.eq("id", +id);
  }

  if (paid !== undefined) {
    query.eq("paid", paid);
  }

  console.log({
    startDate,
    endDate,
  });

  if (startDate && endDate) {
    const startStr = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");
    const endStr = dayjs(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss");

    console.log(startStr, endStr);

    query.gte("created_at", startStr).lte("created_at", endStr);
  }

  const result: DbResult<typeof query> = await query;

  if (result.error) {
    throw result.error;
  }

  const data = (result.data || []) as Alteration[];

  return data;
}
