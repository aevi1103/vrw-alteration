import supabase from "@/lib/supabase-client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { useEffect } from "react";
import { Alteration } from "../api/alterations";
import { DbResult } from "@/database.types";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Spacer,
  Stack,
  StackDivider,
  Switch,
  Text,
  VStack,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import numeral from "numeral";
import sumby from "lodash.sumby";
import Image from "next/image";
import QRCode from "react-qr-code";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

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
  const toast = useToast();
  const { role } = useAuth();

  const isAdmin = role === "admin";

  const router = useRouter();
  const [isLarge] = useMediaQuery("(min-width: 768px)");

  const [isPaid, setIsPaid] = React.useState(data.paid);

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

  const onPaid = async (id: number, checked: boolean) => {
    const { error } = await supabase
      .from("alterations")
      .update({ paid: checked, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating ticket.",
        description: "There was an error updating your ticket.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    setIsPaid(checked);

    toast({
      title: "Ticket updated.",
      description: "We've updated your ticket.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <Container marginTop={10}>
      <Stack>
        <Box>
          <VStack>
            <Box marginBottom={4}>
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  style={{
                    objectFit: "contain",
                  }}
                  height={200}
                  width={200}
                />
              </Link>
            </Box>

            <Box>
              <QRCode size={qrCodeSize} value={url} />
            </Box>

            <Heading
              color={isPaid ? "green.500" : "red.500"}
              marginBottom={4}
              size={"sm"}
            >
              {isPaid ? "PAID" : "UNPAID"}
            </Heading>
          </VStack>
          <Flex>
            <Heading size="md">{data.customer_name}</Heading>
            <Spacer />
            <Heading size="md">{data.ticket_num}</Heading>
          </Flex>
        </Box>

        <Box>
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

            <Box color={isPaid ? "green.500" : "red.500"}>
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

          {data.updated_at && isAdmin && (
            <Box marginTop={3}>
              <Flex
                fontStyle={"italic"}
                fontWeight={"normal"}
                fontSize={12}
                color={"gray.400"}
              >
                <Text>Date Updated</Text>
                <Spacer />
                <Text>{new Date(data.updated_at).toLocaleString()}</Text>
              </Flex>
            </Box>
          )}

          {isAdmin && (
            <FormControl display="flex" alignItems="center" marginTop={5}>
              <FormLabel htmlFor="paid" mb="0">
                Paid?
              </FormLabel>
              <Switch
                id="paid"
                defaultChecked={isPaid}
                onChange={(e) => onPaid(data.id, e.target.checked)}
              />
            </FormControl>
          )}
        </Box>
      </Stack>
    </Container>
  );
}
