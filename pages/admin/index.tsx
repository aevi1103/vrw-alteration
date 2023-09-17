import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Select,
  Spacer,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { faker } from "@faker-js/faker";

import AdminLayout from "@/components/admin-layout";
import { AddIcon } from "@chakra-ui/icons";

const generateData = (count: number) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      ticket: faker.number.int,
      salesPerson: faker.person.fullName(),
      customer: faker.company.name(),
      qty: faker.number.int,
      itemDesc: faker.commerce.productName(),
      alterationDesc: faker.lorem.sentence(),
      unitPrice: faker.commerce.price(),
      totalAmount: faker.commerce.price(),
      remarks: faker.lorem.sentence(),
      notes: faker.lorem.paragraph(),
    });
  }
  return data;
};

export default function Admin() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();

  const samepleData = generateData(10);

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <Flex>
            <Heading size="md">History</Heading>
            <Spacer />
            <Button leftIcon={<AddIcon />} variant={"brand"} onClick={onOpen}>
              Add
            </Button>
          </Flex>
        </CardHeader>

        <CardBody>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Ticker #</Th>
                  <Th>Sales Person</Th>
                  <Th>Customer</Th>
                  <Th isNumeric>Qty</Th>
                  <Th>Item Desc.</Th>
                  <Th>Alteration Desc.</Th>
                  <Th isNumeric>Unit Price</Th>
                  <Th isNumeric>Total Amount</Th>
                  <Th>Remarks</Th>
                  <Th>Notes</Th>
                </Tr>
              </Thead>
              <Tbody>
                {samepleData.map((data, index) => (
                  <Tr key={index}>
                    <Td>{data.ticket(10000)}</Td>
                    <Td>{data.salesPerson}</Td>
                    <Td>{data.customer}</Td>
                    <Td isNumeric>{data.qty(10)}</Td>
                    <Td>{data.itemDesc}</Td>
                    <Td>{data.alterationDesc}</Td>
                    <Td isNumeric>{data.unitPrice}</Td>
                    <Td isNumeric>{data.totalAmount}</Td>
                    <Td>{data.remarks}</Td>
                    <Td>{data.notes}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
      <Drawer
        isOpen={isOpen}
        placement="right"
        initialFocusRef={firstField as any}
        onClose={onClose}
        size={"lg"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Create a new alteration
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="ticketNum">Ticket #</FormLabel>
                <Input ref={firstField as any} id="ticketNum" />
              </Box>

              <Box>
                <FormLabel htmlFor="salesPerson">Sales Person</FormLabel>
                <Input id="salesPerson" />
              </Box>

              <Box>
                <FormLabel htmlFor="customer">Customer</FormLabel>
                <Input id="customer" />
              </Box>

              <Box>
                <FormLabel htmlFor="qty">Qty</FormLabel>
                <Input id="qty" type="number" />
              </Box>

              <Box>
                <FormLabel htmlFor="item">Item Description</FormLabel>
                <Input id="item" />
              </Box>

              <Box>
                <FormLabel htmlFor="alteration">
                  Alteration Description
                </FormLabel>
                <Input id="alteration" />
              </Box>

              <Box>
                <FormLabel htmlFor="unitPrice">Unit Price</FormLabel>
                {/* <Input id="unitPrice" type="number" /> */}
              </Box>

              <Box>
                <FormLabel htmlFor="total">Total Amount</FormLabel>
                {/* <Input id="total" type="number" /> */}
              </Box>

              <Box>
                <FormLabel htmlFor="remarks">Remarks</FormLabel>
                <Textarea id="remarks" />
              </Box>

              <Box>
                <FormLabel htmlFor="notes">Notes</FormLabel>
                <Textarea id="notes" />
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Submit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </AdminLayout>
  );
}
