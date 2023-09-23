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
  Text,
  OrderedList,
  Flex,
  Box,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import supabase from "@/lib/supabase-client";
import numeral from "numeral";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/utils/fetcher";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Alteration } from "@/pages/api/alterations";

const columnHelper = createColumnHelper<Alteration>();

export const AlterationTable = ({
  alterations,
}: {
  alterations: Alteration[];
}) => {
  const toast = useToast();

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

    mutate("/api/alterations");
    toast({
      title: "Ticket updated.",
      description: "We've updated your ticket.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const columns = [
    columnHelper.accessor("paid", {
      header: "Item",
      id: "item",
      cell: (info) => (
        <Switch
          defaultChecked={info.getValue()}
          onChange={() => {
            const { id } = info.row.original;
            onPaid(id, !info.getValue());
          }}
        />
      ),
      footer: (row) => <Text>Total</Text>,
    }),
    columnHelper.accessor("ticket_num", {
      header: "Ticket #",
      cell: (row) => <Text>{row.getValue()}</Text>,
    }),
    columnHelper.accessor("sales_person", {
      header: "Sales Person",
      cell: (row) => <Text>{row.getValue()}</Text>,
    }),
    columnHelper.accessor("customer_name", {
      header: "Customer",
      cell: (row) => <Text>{row.getValue()}</Text>,
    }),
    columnHelper.accessor("totalQty", {
      header: "Total Qty",
      cell: (info) => {
        const total = info.row.original.alteration_items.reduce(
          (acc, item) => acc + item.qty,
          0
        );
        return <Text>{numeral(total).format("0,0")}</Text>;
      },
    }),
    columnHelper.accessor("totalUnitPrice", {
      header: "Total Unit Price",
      cell: (info) => {
        const unitPrices = info.row.original.alteration_items
          .map((item) =>
            item.alteration_services.map((service) => service.prices.price)
          )
          .flat();

        const total = unitPrices.reduce((acc, price) => acc + price, 0);
        return <Text>{numeral(total).format("0,0")}</Text>;
      },
    }),
    columnHelper.accessor("totalAmount", {
      header: "Total Amount",
      cell: (info) => {
        const unitPrices = info.row.original.alteration_items
          .map((item) =>
            item.alteration_services.map((service) => service.prices.price)
          )
          .flat();

        const totalQty = info.row.original.alteration_items.reduce(
          (acc, item) => acc + item.qty,
          0
        );

        const total = unitPrices.reduce((acc, price) => acc + price, 0);
        const totalAmount = total * totalQty;
        return <Text>{numeral(totalAmount).format("$0,0.00")}</Text>;
      },
    }),
    columnHelper.accessor("alteration_items", {
      header: "Alterations",
      cell: (row) => (
        <OrderedList>
          {row.getValue().map((item, i) => (
            <ListItem key={i} marginBottom={3}>
              <Text marginBottom={2}>
                {item.items.description}: {item.qty}
              </Text>
              <UnorderedList>
                {item.alteration_services.map((price, i) => (
                  <ListItem key={i}>
                    {price.prices.service}:{" "}
                    {numeral(price.prices.price).format("$0,0.00")}
                  </ListItem>
                ))}
              </UnorderedList>
            </ListItem>
          ))}
        </OrderedList>
      ),
    }),
    columnHelper.accessor("created_at", {
      header: "Created At",
      cell: (row) => <Text>{new Date(row.getValue()).toLocaleString()}</Text>,
    }),
    columnHelper.accessor("updated_at", {
      header: "Updated At",
      cell: (row) => {
        const date = row.getValue();

        return date && <Text>{new Date(date).toLocaleString()}</Text>;
      },
    }),
  ];

  const table = useReactTable({
    data: alterations || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableContainer>
      <Table variant="simple" size={"sm"}>
        <Thead bg={"gray.100"}>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>

        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id} bg={row.original.paid ? "green.100" : ""}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
