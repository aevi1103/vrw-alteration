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
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import supabase from "@/supabase/supabase-client";
import numeral from "numeral";
import { mutate } from "swr";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import sumby from "lodash.sumby";
import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { Alteration } from "@/supabase/data/alteration";
import { DeleteDialog } from "./delete-dialog";

const columnHelper = createColumnHelper<Alteration>();

export const AlterationTable = ({
  alterations,
}: {
  alterations: Alteration[];
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [id, setId] = React.useState<number>(0);

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
    columnHelper.display({
      header: "Edit",
      id: "edit",
      cell: (info) => (
        <Flex alignItems={"center"}>
          <Link href={`/admin/create/${info.row.original.id}`}>
            <EditIcon fontSize={"xl"} color={"yellow.500"} />
          </Link>
          <Button
            variant={"ghost"}
            colorScheme="red"
            onClick={() => {
              setId(info.row.original.id);
              onOpen();
            }}
          >
            <CloseIcon />
          </Button>
        </Flex>
      ),
    }),

    columnHelper.accessor("paid", {
      header: "Paid",
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
    columnHelper.accessor("customer_name", {
      header: "Customer",
      cell: (row) => <Text>{row.getValue()}</Text>,
    }),
    columnHelper.accessor("sales_person", {
      header: "Sales Person",
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
    columnHelper.accessor("totalAmount", {
      header: "Total Amount",
      cell: (info) => {
        const amounts = info.row.original.alteration_items.map((item) => {
          const qty = item.qty;
          const totalUnitPrice = sumby(
            item.alteration_services,
            (p) => p.prices.price
          );
          const totalAmount = totalUnitPrice * qty;
          return totalAmount;
        });

        const totalAmount = sumby(amounts);
        return <Text>{numeral(totalAmount).format("$0,0.00")}</Text>;
      },
    }),
    columnHelper.accessor("alteration_items", {
      header: "Alterations",
      cell: (row) => (
        <OrderedList fontSize={"xs"}>
          {row.getValue().map((item, i) => (
            <ListItem key={i}>
              <Text>
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
    <>
      <TableContainer>
        <Table variant="simple" size={"md"}>
          <Thead bg={"gray.100"}>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    borderColor={"gray.200"}
                    borderWidth={"thin"}
                  >
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
                  <Td
                    key={cell.id}
                    borderColor={"gray.200"}
                    borderWidth={"thin"}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <DeleteDialog isOpen={isOpen} onClose={onClose} id={id} />
    </>
  );
};
