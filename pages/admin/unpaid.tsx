import React from "react";
import useSWR from "swr";
import { Alteration } from "../api/alterations";
import { fetcher } from "@/lib/utils/fetcher";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Box,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  Flex,
  Spacer,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import numeral from "numeral";
import sumBy from "lodash.sumby";
import { getTotalAmount } from ".";
import { useRouter } from "next/router";

export default function UpPaid() {
  const router = useRouter();
  const { paid } = router.query;
  const { data: alterations } = useSWR<Alteration[]>(
    `/api/alterations?paid=${paid}`,
    fetcher
  );

  const paidItems = alterations?.filter((alteration) => alteration.paid);
  const unpaidItems = alterations?.filter((alteration) => !alteration.paid);
  const total = getTotalAmount(unpaidItems || []);
  const totalPaid = getTotalAmount(paidItems || []);

  return (
    <Card>
      <CardHeader>
        <Flex gap={2} alignItems={"center"}>
          <Heading size="md">
            {paid === "true" ? "Paid" : paid === "false" ? "Unpaid" : "All"}{" "}
            Report
          </Heading>
          <RadioGroup
            size={"sm"}
            onChange={(val) =>
              router.push({
                pathname: router.pathname,
                query: { paid: val },
              })
            }
          >
            <Stack direction="row">
              <Radio value="true">Paid</Radio>
              <Radio value="false">Unpaid</Radio>
              <Radio value="">All</Radio>
            </Stack>
          </RadioGroup>
        </Flex>
      </CardHeader>

      <CardBody paddingTop={0}>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Flex>
              <Stat>
                <StatLabel>Total Updaid</StatLabel>
                <StatNumber color={"red.500"}>
                  {numeral(total).format("$0,0.00")}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Total Paid</StatLabel>
                <StatNumber color={"green.500"}>
                  {numeral(totalPaid).format("$0,0.00")}
                </StatNumber>
              </Stat>
            </Flex>
          </Box>

          {alterations?.map((alteration) => {
            const amounts = alteration.alteration_items.map((item) => {
              const qty = item.qty;
              const totalUnitPrice = sumBy(
                item.alteration_services,
                "prices.price"
              );
              const totalAmount = totalUnitPrice * qty;
              return totalAmount;
            });

            const totalAmount = sumBy(amounts);

            return (
              <Box key={alteration.id}>
                <Heading size="xs" textTransform="uppercase" marginBottom={2}>
                  <Flex>
                    <Text
                      size={"sm"}
                      color={alteration.paid ? "green.500" : ""}
                    >
                      {alteration.customer_name} {alteration.paid && "- PAID"}
                    </Text>
                    <Spacer />
                    <Text size={"sm"} fontStyle={"italic"}>
                      {" "}
                      {alteration.ticket_num}
                    </Text>
                  </Flex>
                </Heading>

                {
                  <Stack spacing="2">
                    {alteration.alteration_items.map((item, i) => (
                      <Box key={i}>
                        <Text fontSize={13} fontWeight={"semibold"}>
                          {item.items.description}: {item.qty} pc(s)
                        </Text>
                        <Box marginLeft={2}>
                          {item.alteration_services.map((service) => (
                            <Text
                              key={service.prices.service}
                              fontSize={12}
                              fontStyle={"italic"}
                            >
                              {service.prices.service} -{" "}
                              {numeral(service.prices.price).format("$0,0.00")}
                            </Text>
                          ))}
                        </Box>
                      </Box>
                    ))}

                    <Text
                      size={"sm"}
                      color={alteration.paid ? "green.500" : "red.500"}
                      fontWeight={"semibold"}
                    >
                      Total Amount: {numeral(totalAmount).format("$0,0.00")}
                    </Text>
                  </Stack>
                }
              </Box>
            );
          })}
        </Stack>
      </CardBody>
    </Card>
  );
}
