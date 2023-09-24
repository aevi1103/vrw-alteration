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
} from "@chakra-ui/react";
import numeral from "numeral";
import sumBy from "lodash.sumby";
import { getTotalAmount } from ".";

export default function UpPaid() {
  const { data: alterations } = useSWR<Alteration[]>(
    "/api/alterations",
    fetcher
  );

  const unpaidItems = alterations?.filter((alteration) => !alteration.paid);
  const total = getTotalAmount(unpaidItems || []);

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Unpaid Report</Heading>
      </CardHeader>

      <CardBody paddingTop={0}>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Stat>
              <StatLabel>Total</StatLabel>
              <StatNumber color={"red.500"}>
                {numeral(total).format("$0,0.00")}
              </StatNumber>
            </Stat>
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
                <Heading size="md" textTransform="uppercase" marginBottom={2}>
                  <Flex>
                    <Text color={alteration.paid ? "green.500" : ""}>
                      {alteration.customer_name} {alteration.paid && "- PAID"}
                    </Text>
                    <Spacer />
                    <Text fontStyle={"italic"}> {alteration.ticket_num}</Text>
                  </Flex>
                </Heading>

                {
                  <Stack spacing="2">
                    {alteration.alteration_items.map((item, i) => (
                      <Box key={i} marginBottom={3}>
                        <Text fontWeight={"semibold"}>
                          {item.items.description}: {item.qty} pc(s)
                        </Text>
                        <Box marginLeft={2}>
                          {item.alteration_services.map((service) => (
                            <Text
                              key={service.prices.service}
                              fontSize={13}
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
