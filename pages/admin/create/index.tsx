import React from "react";
import { ItemOption, PriceCategoryOption } from "@/lib/types/alteration";
import AdminLayout from "@/components/admin-layout";
import { AlterationForm } from "@/components/alteration-form";
import { getItems, getPrices } from "@/supabase/data/alteration";

export default function Create({
  prices,
  items,
}: {
  prices: PriceCategoryOption[];
  items: ItemOption[];
}) {
  return (
    <AdminLayout>
      <AlterationForm prices={prices} items={items} />
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  const prices = await getPrices();
  const items = await getItems();
  return {
    props: {
      prices,
      items,
    },
  };
}
