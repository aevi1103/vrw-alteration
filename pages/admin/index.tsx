import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Spacer,
} from "@chakra-ui/react";
import React from "react";
import AdminLayout from "@/components/admin-layout";
import { AddIcon } from "@chakra-ui/icons";
import supabase from "@/lib/supabase-client";
import { DbResult } from "@/database.types";
import { useAlterationsStore } from "@/store/useAlterationsStore";
import { AleterationDrawer } from "@/components/alterations-drawer";
import { AlterationTable } from "@/components/alterations-table";

export type ItemOption = {
  label: string;
  value: string;
};

type PriceOption = {
  label: string;
  value: string;
  price: number;
};

export type PriceCategoryOption = {
  label: string;
  options: PriceOption[];
};

export default function Admin({
  prices,
  items,
}: {
  prices: PriceCategoryOption[];
  items: ItemOption[];
}) {
  const toggle = useAlterationsStore((state) => state.toggle);

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <Flex>
            <Heading size="md">History</Heading>
            <Spacer />
            <Button leftIcon={<AddIcon />} variant={"brand"} onClick={toggle}>
              Add
            </Button>
          </Flex>
        </CardHeader>

        <CardBody>
          <AlterationTable />
        </CardBody>
      </Card>
      <AleterationDrawer prices={prices} items={items} />
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

async function getPrices() {
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

async function getItems() {
  const query = supabase.from("alteration_items").select("*");
  const items: DbResult<typeof query> = await query;

  const res =
    items.data?.map(({ id, description }: any) => ({
      label: description,
      value: id,
    })) || [];

  return res;
}
