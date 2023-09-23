import { useAlterationsStore } from "@/store/useAlterationsStore";
import React, { useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Item } from "@/lib/types/alteration";
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
} from "@chakra-ui/react";
import numeral from "numeral";
import sumby from "lodash.sumby";

const columnHelper = createColumnHelper<Item>();

export const AlterationItemsTable = () => {
  // const table = useReactTable();
  const items = useAlterationsStore((state) => state.items);

  const totalQty = sumby(items, "qty");
  const totalUnitPrice = sumby(items, (item) => sumby(item.prices, "price"));
  const totalAmount = totalUnitPrice * totalQty;

  const columns = [
    columnHelper.accessor("item.label", {
      header: "Item",
      id: "item",
      cell: (row) => <Text>{row.getValue()}</Text>,
      footer: (row) => <Text>Total</Text>,
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
            <ListItem key={price.value}>{price.label}</ListItem>
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

  useEffect(() => {
    console.log(items);
  }, [items]);

  return (
    <TableContainer>
      <Table variant="simple" size={"sm"}>
        <Thead>
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
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}>
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
                <Th key={column.id}>
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
            <Th>
              <Text>Total Amount</Text>
            </Th>
            <Th colSpan={3}>
              <Text>{numeral(totalAmount).format("$0,0.00")}</Text>
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};
