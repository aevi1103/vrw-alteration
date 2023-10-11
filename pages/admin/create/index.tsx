import React from "react";
import { ItemOption } from "@/lib/types/alteration";
import AdminLayout from "@/components/admin-layout";
import { AlterationForm } from "@/components/alteration-form";
import { getItems } from "@/supabase/data/alteration";
import useSWR from "swr";
import { fetcher } from "@/lib/utils/fetcher";

export default function Create({ items }: { items: ItemOption[] }) {
  const { data: prices } = useSWR(`/api/prices`, fetcher);

  return (
    <AdminLayout>
      <AlterationForm prices={prices} items={items} />
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  const items = await getItems();
  return {
    props: {
      items,
    },
  };
}
