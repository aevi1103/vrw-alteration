import supabase from "@/lib/supabase-client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { useEffect } from "react";
import { Alteration } from "../api/alterations";
import { DbResult } from "@/database.types";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Heading,
  Spacer,
  Stack,
  StackDivider,
  Text,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
import numeral from "numeral";
import sumby from "lodash.sumby";
import Image from "next/image";
import QRCode from "react-qr-code";
import { useRouter } from "next/router";

export const getServerSideProps = (async (context) => {
  const { uuid } = context.params as { uuid: string };

  const query = supabase
    .from("alterations")
    .select(
      `*, 
          alteration_items(qty,
            items(description),
             alteration_services(
              prices(service, price))
          )`
    )
    .order("paid", { ascending: true })
    .eq("uuid", uuid);

  const result: DbResult<typeof query> = await query;
  const data = result.data;

  if (data?.length === 0 || !data) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const [first] = data || [];
  const res = first as Alteration;

  return { props: { data: res } };
}) satisfies GetServerSideProps<{
  data: Alteration;
}>;

export default function Alteration({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [isLarge] = useMediaQuery("(min-width: 768px)");

  const amounts = data.alteration_items.map((item) => {
    const qty = item.qty;
    const totalUnitPrice = sumby(
      item.alteration_services,
      (p) => p.prices.price
    );
    const totalAmount = totalUnitPrice * qty;
    return totalAmount;
  });
  const totalAmount = sumby(amounts);

  const [url, setUrl] = React.useState("");

  useEffect(() => {
    if (!window) {
      return;
    }

    const origin = window?.location?.origin;
    const res = `${origin}${router.basePath}/alteration/${data.uuid}}`;
    setUrl(res);
  }, [router, data]);

  const qrCodeSize = isLarge ? 150 : 120;

  return (
    <Container marginTop={10}>
      <Card>
        <CardHeader>
          <VStack>
            <Box marginBottom={4}>
              <Image
                src="/logo.png"
                alt="Logo"
                style={{
                  objectFit: "contain",
                }}
                height={200}
                width={200}
              />
            </Box>

            <Box>
              <QRCode
                size={qrCodeSize}
                style={{
                  height: "auto",
                  maxWidth: "100%",
                  width: "100%",
                }}
                value={url}
                viewBox={`0 0 ${qrCodeSize} ${qrCodeSize}`}
              />
            </Box>

            <Heading
              color={data?.paid ? "green.500" : "red.500"}
              marginBottom={4}
              size={"sm"}
            >
              {data.paid ? "PAID" : "UNPAID"}
            </Heading>
          </VStack>
          <Flex>
            <Heading size="md">{data.customer_name}</Heading>
            <Spacer />
            <Heading size="md">{data.ticket_num}</Heading>
          </Flex>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing={3}>
            {data.alteration_items.map((item, i) => (
              <Box key={i}>
                <Flex>
                  <Heading size="xs" textTransform="uppercase">
                    {item.items.description}
                  </Heading>
                  <Spacer />
                  <Heading size="xs">{item.qty}</Heading>
                </Flex>

                {item.alteration_services.map((service, i) => (
                  <Flex key={i} fontStyle={"italic"}>
                    <Text pt="2" fontSize="sm">
                      {service.prices.service}
                    </Text>
                    <Spacer />
                    <Text pt="2" fontSize="sm">
                      {numeral(service.prices.price).format("$0,0.00")}
                    </Text>
                  </Flex>
                ))}
              </Box>
            ))}

            <Box color={data?.paid ? "green.500" : "red.500"}>
              <Flex>
                <Heading size="md">Total Amount</Heading>
                <Spacer />
                <Heading size="md">
                  {numeral(totalAmount).format("$0,0.00")}
                </Heading>
              </Flex>
            </Box>
          </Stack>

          <Box marginTop={3}>
            <Flex
              fontStyle={"italic"}
              fontWeight={"normal"}
              fontSize={12}
              color={"gray.400"}
            >
              <Text>Date Entered</Text>
              <Spacer />
              <Text>{new Date(data.created_at).toLocaleString()}</Text>
            </Flex>
          </Box>
        </CardBody>
      </Card>
    </Container>
  );
}
