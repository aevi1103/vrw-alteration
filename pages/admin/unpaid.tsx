import React from "react";
import useSWR from "swr";
import { Alteration } from "../api/alterations";
import { fetcher } from "@/lib/utils/fetcher";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  StackDivider,
  Box,
  Text,
} from "@chakra-ui/react";
import numeral from "numeral";
import sumBy from "lodash.sumby";

export default function UpPaid() {
  const { data: alterations } = useSWR<Alteration[]>(
    "/api/alterations?paid=false",
    fetcher
  );

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Unpaid Report</Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
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
                <Heading size="md" textTransform="uppercase" marginBottom={3}>
                  {alteration.customer_name}
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

                    <Text color={"red.500"} fontWeight={"semibold"}>
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
