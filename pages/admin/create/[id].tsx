import AdminLayout from "@/components/admin-layout";
import { AlterationForm } from "@/components/alteration-form";
import { ItemOption, PriceCategoryOption } from "@/lib/types/alteration";
import {
  Alteration,
  getAlterations,
  getItems,
  getPrices,
} from "@/supabase/data/alteration";
import { GetServerSideProps } from "next";
import React from "react";

export const getServerSideProps = (async (context) => {
  const id = context.params?.id;

  const prices = await getPrices();
  const items = await getItems();
  const alterations = await getAlterations({
    id: id as string,
  });

  if (alterations.length === 0) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  const alteration = alterations?.[0] || {};

  return {
    props: {
      prices,
      items,
      alteration,
    },
  };
}) satisfies GetServerSideProps<{
  prices: PriceCategoryOption[];
  items: ItemOption[];
  alteration: Alteration;
}>;

export default function AlterationPage({
  prices,
  items,
  alteration,
}: {
  prices: PriceCategoryOption[];
  items: ItemOption[];
  alteration: Alteration;
}) {
  return (
    <AdminLayout>
      <AlterationForm prices={prices} items={items} alteration={alteration} />
    </AdminLayout>
  );
}
