import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils/fetcher";
import {
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
  Center,
  Spinner,
  Input,
  FormControl,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import numeral from "numeral";
import sumBy from "lodash.sumby";
import { getTotalAmount } from ".";
import { useRouter } from "next/router";
import QRCode from "react-qr-code";
import AdminLayout from "@/components/admin-layout";
import { Alteration } from "@/supabase/data/alteration";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default function Report() {
  const router = useRouter();
  const query = router.query;
  const { paid, start, end } = router.query;

  const { data: alterations, isLoading } = useSWR<Alteration[]>(
    `/api/alterations?paid=${paid}&startDate=${start ?? ""}&endDate=${
      end ?? ""
    }`,
    fetcher
  );

  const paidItems = alterations?.filter((alteration) => alteration.paid);
  const unpaidItems = alterations?.filter((alteration) => !alteration.paid);
  const total = getTotalAmount(unpaidItems || []);
  const totalPaid = getTotalAmount(paidItems || []);

  const qrCodeSize = 90;

  const getUrl = (uuid: string) => {
    if (!window) {
      return "";
    }

    const origin = window?.location?.origin;
    const res = `${origin}${router.basePath}/alteration/${uuid}`;

    return res;
  };

  return (
    <AdminLayout>
      <Stack spacing={5}>
        <Box>
          <Flex gap={2} alignItems={"center"}>
            <Box>
              <Heading size="md">
                {paid === "true" ? "Paid" : paid === "false" ? "Unpaid" : "All"}{" "}
                Report
              </Heading>
            </Box>
            <Spacer />
            <Box>
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
            </Box>
          </Flex>
        </Box>

        <Box>
          <HStack alignItems={"center"}>
            <FormControl>
              <HStack alignItems={"center"}>
                <FormLabel size={"md"} fontSize={"xs"} margin={0}>
                  From
                </FormLabel>
                <Input
                  size="sm"
                  type="date"
                  defaultValue={start as string}
                  onChange={(e) => {
                    router.push({
                      pathname: router.pathname,
                      query: { ...query, start: e.target.value },
                    });
                  }}
                />
              </HStack>
            </FormControl>
            <FormControl>
              <HStack alignItems={"center"}>
                <FormLabel size={"md"} fontSize={"xs"} margin={0}>
                  To
                </FormLabel>
                <Input
                  size="sm"
                  type="date"
                  defaultValue={end as string}
                  onChange={(e) => {
                    router.push({
                      pathname: router.pathname,
                      query: { ...query, end: e.target.value },
                    });
                  }}
                />
              </HStack>
            </FormControl>
          </HStack>
        </Box>

        <Box>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Flex gap={5}>
                <Box>
                  <Stat>
                    <StatLabel>Total Unpaid</StatLabel>
                    <StatNumber color={"red.500"}>
                      {numeral(total).format("$0,0.00")}
                    </StatNumber>
                  </Stat>
                </Box>
                <Box>
                  <Stat>
                    <StatLabel>Total Paid</StatLabel>
                    <StatNumber color={"green.500"}>
                      {numeral(totalPaid).format("$0,0.00")}
                    </StatNumber>
                  </Stat>
                </Box>
              </Flex>
            </Box>

            {isLoading ? (
              <Spinner />
            ) : (
              <Flex wrap={"wrap"}>
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
                    <Box
                      key={alteration.id}
                      flexGrow={1}
                      flexBasis={"250px"}
                      padding={4}
                      m={1}
                      border="1px solid #e2e8f0"
                      borderRadius="md"
                      bg={"gray.50"}
                      position={"relative"}
                    >
                      <Center marginY={4}>
                        <Box width={qrCodeSize}>
                          <QRCode
                            onClick={() =>
                              router.push(`/alteration/${alteration.uuid}`)
                            }
                            size={qrCodeSize}
                            style={{
                              height: "auto",
                              maxWidth: "100%",
                              width: "100%",
                              cursor: "pointer",
                            }}
                            value={getUrl(alteration.uuid || "")}
                            viewBox={`0 0 ${qrCodeSize} ${qrCodeSize}`}
                          />
                        </Box>
                      </Center>

                      {alteration.paid && (
                        <Center marginTop={2}>
                          <Heading size={"lg"}>PAID</Heading>
                        </Center>
                      )}

                      <Flex gap={5}>
                        <Box width={"100%"}>
                          <Heading
                            size="xs"
                            textTransform="uppercase"
                            marginBottom={2}
                          >
                            <Flex>
                              <Text
                                size={"sm"}
                                color={alteration.paid ? "green.500" : ""}
                              >
                                {alteration.customer_name}
                              </Text>
                              <Spacer />
                              <Text size={"sm"} fontStyle={"italic"}>
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
                                        {numeral(service.prices.price).format(
                                          "$0,0.00"
                                        )}
                                      </Text>
                                    ))}
                                  </Box>
                                </Box>
                              ))}

                              <Text
                                size={"sm"}
                                color={
                                  alteration.paid ? "green.500" : "red.500"
                                }
                                fontWeight={"semibold"}
                              >
                                Total Amount:{" "}
                                {numeral(totalAmount).format("$0,0.00")}
                              </Text>
                            </Stack>
                          }
                        </Box>
                      </Flex>
                      <Box
                        position={"absolute"}
                        right={2}
                        top={-2}
                        zIndex={999}
                      >
                        <Text
                          fontSize={10}
                          fontStyle={"italic"}
                          marginTop={4}
                          color={"gray.400"}
                        >
                          {dayjs(alteration.created_at)
                            .utc()
                            .format("MM/DD/YYYY h:mm A")}{" "}
                          UTC
                        </Text>
                      </Box>
                    </Box>
                  );
                })}
              </Flex>
            )}
          </Stack>
        </Box>
      </Stack>
    </AdminLayout>
  );
}
