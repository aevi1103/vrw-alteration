import { useAlterationsStore } from "@/store/useAlterationsStore";
import React, { useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Item, ItemFormValues } from "@/lib/types/alteration";
import {
  ListItem,
  Table,
  TableContainer,
  Text,
  Thead,
  Tr,
  Th,
  Td,
  UnorderedList,
  Tbody,
  Tfoot,
  Button,
  Flex,
} from "@chakra-ui/react";
import numeral from "numeral";
import sumby from "lodash.sumby";
import { EditIcon, SmallCloseIcon } from "@chakra-ui/icons";

const columnHelper = createColumnHelper<Item>();

export const AlterationItemsTable = () => {
  // const table = useReactTable();
  const items = useAlterationsStore((state) => state.items);
  const setItems = useAlterationsStore((state) => state.setItems);

  useEffect(() => {
    return () => {
      setItems([]);
    };
  }, [setItems]);

  const setSelectedFormItem = useAlterationsStore(
    (state) => state.setSelectedFormItem
  );

  const totalUnitPrice = sumby(items, (item) => sumby(item.prices, "price"));
  const totalQty = sumby(items, "qty");

  const itemsAmount = items.map((item) => {
    const qty = item.qty;
    const totalUnitPrice = sumby(item.prices, "price");
    const totalAmount = totalUnitPrice * qty;
    return totalAmount;
  });
  const totalAmount = sumby(itemsAmount);

  const onEditItem = (item: Item) => {
    const formValues: ItemFormValues = {
      id: item.id,
      qty: item.qty,
      item_id: item.item,
      price_id: item.prices,
    };
    setSelectedFormItem(formValues);
  };

  const onDeleteItem = (original: Item) => {
    const newItems = items.filter((item) => item.id !== original.id);
    setItems(newItems);
  };

  const columns = [
    columnHelper.display({
      header: "Edit",
      id: "edit",
      cell: (info) => (
        <Flex gap={2} alignItems={"center"}>
          <Button
            size={"xs"}
            variant={"ghost"}
            onClick={() => onEditItem(info.row.original)}
            color={"yellow.500"}
          >
            <EditIcon />
          </Button>
          <Button
            // size={"xs"}
            variant={"ghost"}
            onClick={() => onDeleteItem(info.row.original)}
            colorScheme="red"
          >
            <SmallCloseIcon />
          </Button>
        </Flex>
      ),
      footer: (row) => <Text>Total</Text>,
    }),
    columnHelper.accessor("item.label", {
      header: "Item",
      id: "item",
      cell: (row) => <Text>{row.getValue()}</Text>,
      footer: (row) => null,
    }),
    columnHelper.accessor("qty", {
      header: "Qty",
      cell: (row) => <Text>{row.getValue()}</Text>,
      aggregationFn: "sum",
      footer: (row) => <Text>{numeral(totalQty).format("0,0")}</Text>,
    }),
    columnHelper.accessor("prices", {
      header: "Alterations",
      cell: (row) => (
        <UnorderedList>
          {row.getValue().map((price) => (
            <ListItem key={price.value}>
              {price.label}{" "}
              <Text color={"gray.400"} as={"span"} fontStyle={"italic"}>
                ({numeral(price.price).format("$0,0.00")})
              </Text>
            </ListItem>
          ))}
        </UnorderedList>
      ),
      footer: (row) => <Text>{numeral(totalUnitPrice).format("$0,0.00")}</Text>,
    }),
  ];

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableContainer>
      <Table variant="simple" size={"sm"}>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id} bg={"gray.100"}>
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
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id} borderColor={"gray.200"} borderWidth={"thin"}>
                  <Text maxWidth={10}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Text>
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>

        <Tfoot bg={"gray.100"}>
          {table.getFooterGroups().map((footerGroup) => (
            <Tr key={footerGroup.id}>
              {footerGroup.headers.map((column) => (
                <Th
                  key={column.id}
                  borderColor={"gray.200"}
                  borderWidth={"thin"}
                >
                  {column.isPlaceholder
                    ? null
                    : flexRender(
                        column.column.columnDef.footer,
                        column.getContext()
                      )}
                </Th>
              ))}
            </Tr>
          ))}

          <Tr>
            <Th colSpan={3} borderColor={"gray.200"} borderWidth={"thin"}>
              <Text>Total Amount</Text>
            </Th>
            <Th borderColor={"gray.200"} borderWidth={"thin"}>
              <Text>{numeral(totalAmount).format("$0,0.00")}</Text>
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};
