import {
  Flex,
  Heading,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  Box,
  Input,
  Stack,
  SimpleGrid,
  useMediaQuery,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import AdminLayout from "@/components/admin-layout";
import { AlterationTable } from "@/components/alterations-table";
import useSWR from "swr";
import { fetcher } from "@/lib/utils/fetcher";
import numeral from "numeral";
import sumBy from "lodash.sumby";
import { Alteration } from "@/supabase/data/alteration";

export const getTotalAmount = (alterations: Alteration[]) => {
  const itemsAmount = alterations.map((alteration) => {
    const items = alteration.alteration_items.map((item) => {
      const qty = item.qty;
      const totalUnitPrice = sumBy(
        item.alteration_services,
        (p) => p.prices.price
      );
      const totalAmount = totalUnitPrice * qty;
      return totalAmount;
    });

    const totalAmount = sumBy(items);
    return totalAmount;
  });

  return sumBy(itemsAmount);
};

export default function Admin() {
  const { data: alterations, isLoading } = useSWR<Alteration[]>(
    "/api/alterations",
    fetcher
  );

  const [isLarge] = useMediaQuery("(min-width: 768px)");

  const [dataSource, setDataSource] = React.useState<Alteration[]>(
    alterations || []
  );

  useEffect(() => {
    setDataSource(alterations || []);
  }, [alterations]);

  const paidItems = alterations?.filter((alteration) => alteration.paid);
  const unpaidItems = alterations?.filter((alteration) => !alteration.paid);

  const paidAmount = getTotalAmount(paidItems || []);
  const unpaidAmount = getTotalAmount(unpaidItems || []);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filtered = alterations?.filter(
      (alteration) =>
        alteration.customer_name.toLowerCase().includes(value) ||
        alteration.sales_person.toLowerCase().includes(value) ||
        alteration.ticket_num.toString().toLowerCase().includes(value)
    );

    if (!value) {
      setDataSource(alterations || []);
      return;
    }

    setDataSource(filtered || []);
  };

  return (
    <AdminLayout>
      <SimpleGrid columns={1} gap={3}>
        <Box>
          <Flex alignItems={"center"}>
            <Stack>
              <Heading size={isLarge ? "md" : "xl"}>History</Heading>
              {isLarge && (
                <Input size={"sm"} placeholder="Search" onChange={onSearch} />
              )}
            </Stack>

            <Spacer />
            <Flex gap={5} marginBottom={3}>
              <Box>
                <Stat>
                  <StatLabel>Paid</StatLabel>
                  <StatNumber color={"green.500"}>
                    {numeral(paidAmount).format("$0,0.00")}
                  </StatNumber>
                </Stat>
              </Box>
              <Box>
                <Stat>
                  <StatLabel>Un-Paid</StatLabel>
                  <StatNumber color={"red.500"}>
                    {numeral(unpaidAmount).format("$0,0.00")}
                  </StatNumber>
                </Stat>
              </Box>
            </Flex>
          </Flex>
        </Box>

        {!isLarge && (
          <Box>
            <Input size={"sm"} placeholder="Search" onChange={onSearch} />
          </Box>
        )}

        <Box>
          {isLoading ? (
            <Spinner />
          ) : (
            <AlterationTable alterations={dataSource} />
          )}
        </Box>
      </SimpleGrid>
    </AdminLayout>
  );
}
