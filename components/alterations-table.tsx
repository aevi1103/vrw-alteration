import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Switch,
  ListItem,
  UnorderedList,
  TableContainer,
} from "@chakra-ui/react";
import React from "react";
import supabase from "@/lib/supabase-client";
import numeral from "numeral";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/utils/fetcher";

export const AlterationTable = () => {
  const toast = useToast();
  const { data: alterations } = useSWR("/api/alterations", fetcher);

  const onPaid = async (id: number, checked: boolean) => {
    console.log({ id, checked });

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

    mutate("/api/alterations");
    toast({
      title: "Ticket updated.",
      description: "We've updated your ticket.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <TableContainer>
      <Table variant="simple" size={"sm"}>
        <Thead>
          <Tr>
            <Th>Paid</Th>
            <Th>Ticker #</Th>
            <Th>Sales Person</Th>
            <Th>Customer</Th>
            <Th isNumeric>Qty</Th>
            <Th>Item</Th>
            <Th isNumeric>Alterations</Th>
            <Th isNumeric>Total Unit Price</Th>
            <Th isNumeric>Total Amount</Th>
            <Th>Remarks</Th>
            <Th>Date Created</Th>
            <Th>Date Updated</Th>
          </Tr>
        </Thead>
        <Tbody>
          {alterations?.map((data: any, index: number) => {
            const services = data.alteration_services.map(
              (item: any, i: number) => (
                <ListItem key={i}>
                  {item.prices.service}:{" "}
                  {numeral(item.prices.price).format("$0,0.00")}
                </ListItem>
              )
            );

            const totalUnitPrice = data.alteration_services.reduce(
              (acc: number, item: any) => acc + item.prices.price,
              0
            );

            const totalAmount = totalUnitPrice * data.qty;

            return (
              <Tr key={index} bg={data.paid ? "green.200" : ""}>
                <Td>
                  <Switch
                    defaultChecked={data.paid}
                    onChange={async (e) => {
                      await onPaid(data.id, e.target.checked);
                    }}
                  />
                </Td>
                <Td>{data.ticket_num}</Td>
                <Td>{data.sales_person}</Td>
                <Td>{data.customer_name}</Td>
                <Td isNumeric>{data.qty}</Td>
                <Td>{data.alteration_items.description}</Td>
                <Td>
                  <UnorderedList>{services}</UnorderedList>
                </Td>
                <Td isNumeric>{numeral(totalUnitPrice).format("$0,0.00")}</Td>
                <Td isNumeric>{numeral(totalAmount).format("$0,0.00")}</Td>
                <Td>{data.remarks}</Td>
                <Td>{new Date(data.created_at).toLocaleString()}</Td>
                <Td>
                  {data.updated_at &&
                    new Date(data.updated_at).toLocaleString()}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
