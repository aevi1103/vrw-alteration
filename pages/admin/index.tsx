import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  Box,
  Input,
  Stack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import AdminLayout from "@/components/admin-layout";
import { AlterationTable } from "@/components/alterations-table";
import useSWR from "swr";
import { Alteration } from "../api/alterations";
import { fetcher } from "@/lib/utils/fetcher";
import numeral from "numeral";

const getTotalAmount = (alterations: Alteration[]) => {
  const qtys = alterations
    .map((alteration) => alteration.alteration_items.map((item) => item.qty))
    .flat();
  const prices = alterations
    .map((alteration) =>
      alteration.alteration_items
        .map((item) => item.alteration_services.map((p) => p.prices.price))
        .flat()
    )
    .flat();

  const totalQty = qtys.reduce((a, b) => a + b, 0);
  const total = prices.reduce((a, b) => a + b, 0);
  const totalAmount = total * totalQty;

  return totalAmount;
};

export default function Admin() {
  const { data: alterations } = useSWR<Alteration[]>(
    "/api/alterations",
    fetcher
  );

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
      <Card>
        <CardHeader paddingBottom={0}>
          <Flex>
            <Stack>
              <Heading size="md">History</Heading>
              <Input size={"sm"} placeholder="Search" onChange={onSearch} />
            </Stack>

            <Spacer />
            <Flex gap={5} marginBottom={3}>
              <Box>
                <Stat>
                  <StatLabel>Total Paid</StatLabel>
                  <StatNumber color={"green.500"}>
                    {numeral(paidAmount).format("$0,0.0")}
                  </StatNumber>
                </Stat>
              </Box>
              <Box>
                <Stat>
                  <StatLabel>Total Un-Paid</StatLabel>
                  <StatNumber color={"red.500"}>
                    {numeral(unpaidAmount).format("$0,0.0")}
                  </StatNumber>
                </Stat>
              </Box>
            </Flex>
          </Flex>
        </CardHeader>

        <CardBody paddingTop={2}>
          <AlterationTable alterations={dataSource} />
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
