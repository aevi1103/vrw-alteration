import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  Text,
  Switch,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import AdminLayout from "@/components/admin-layout";
import { AddIcon } from "@chakra-ui/icons";
import supabase from "@/lib/supabase-client";
import { DbResult } from "@/database.types";
import { Select } from "chakra-react-select";
import * as Yup from "yup";
import { FormikHelpers, useFormik } from "formik";
import numeral from "numeral";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/utils/fetcher";

type PriceOption = {
  label: string;
  value: string;
  price: number;
};

type PriceCategoryOption = {
  label: string;
  options: PriceOption[];
};

export default function Admin({ prices }: { prices: PriceCategoryOption[] }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();
  const toast = useToast();

  const { data: alterations, isLoading } = useSWR("/api/alterations", fetcher);

  console.log({ alterations, isLoading });

  const allPrices = useMemo(
    () => prices.flatMap((item) => item.options),
    [prices]
  );

  const validationSchema = Yup.object().shape({
    ticket_num: Yup.number(),
    sales_person: Yup.string(),
    customer_name: Yup.string().required("Customer is required"),
    qty: Yup.number().required("Qty is required"),
    price_id: Yup.object().shape({
      label: Yup.string().required("Item is required"),
      value: Yup.string().required("Item is required"),
      price: Yup.number().required("Item is required"),
    }),
    remarks: Yup.string().required("Remarks is required"),
    paid: Yup.boolean().default(false),
  });

  type FormValues = Yup.InferType<typeof validationSchema>;

  const onSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    const { error } = await supabase.from("alterations").insert({
      created_at: new Date().toISOString(),
      ticket_num: values.ticket_num,
      sales_person: values.sales_person,
      customer_name: values.customer_name,
      qty: values.qty,
      price_id: values.price_id.value,
      remarks: values.remarks,
      paid: values.paid,
    });

    if (error) {
      toast({
        title: "Error creating ticket.",
        description: "There was an error creating your ticket.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    mutate("/api/alterations");
    resetForm();
    onClose();

    toast({
      title: "Ticket created.",
      description: "We've created your ticket for you.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const initialValues: FormValues = {
    ticket_num: 0,
    sales_person: "",
    customer_name: "",
    qty: 1,
    price_id: {
      label: "",
      value: "",
      price: 0,
    },
    remarks: "",
    paid: false,
  };

  const {
    handleSubmit,
    handleBlur,
    errors,
    touched,
    values,
    handleChange,
    isSubmitting,
    setFieldValue,
    resetForm,
  } = useFormik<FormValues>({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const unitPrice = useMemo(
    () =>
      allPrices.find(
        (item: PriceOption) => item.value === values.price_id.value
      )?.price || 0,
    [values, allPrices]
  );

  const onPaid = async (id: number, checked: boolean) => {
    console.log({ id, checked });

    const { error } = await supabase
      .from("alterations")
      .update({ paid: checked, created_at: new Date().toISOString() })
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
            <Table variant="simple" size={"sm"}>
              <Thead>
                <Tr>
                  <Th>Paid</Th>
                  <Th>Ticker #</Th>
                  <Th>Sales Person</Th>
                  <Th>Customer</Th>
                  <Th isNumeric>Qty</Th>
                  <Th>Alteration Desc.</Th>
                  <Th isNumeric>Unit Price</Th>
                  <Th isNumeric>Total Amount</Th>
                  <Th>Remarks</Th>
                  <Th>Date Created</Th>
                </Tr>
              </Thead>
              <Tbody>
                {alterations?.map((data: any, index: number) => (
                  <Tr key={index}>
                    <Td>
                      <Switch
                        defaultChecked={data.paid}
                        onChange={async (e) => {
                          await onPaid(data.id, e.target.checked);
                        }}
                      />
                      {/* {data.paid ? (
                        <Badge colorScheme="green">PAID</Badge>
                      ) : (
                        <Badge colorScheme="red">UNPAID</Badge>
                      )} */}
                    </Td>
                    <Td>{data.ticket_num}</Td>
                    <Td>{data.sales_person}</Td>
                    <Td>{data.customer_name}</Td>
                    <Td isNumeric>{data.qty}</Td>
                    <Td>{data.price.service}</Td>
                    <Td isNumeric>${data.price.price}</Td>
                    <Td isNumeric>${data.price.price * data.qty}</Td>
                    <Td>{data.remarks}</Td>
                    <Td>{new Date(data.created_at).toLocaleString()}</Td>
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
            <form
              onSubmit={handleSubmit}
              style={{
                width: "100%",
              }}
            >
              <Stack spacing="24px">
                <Box>
                  <FormControl
                    isInvalid={
                      (errors.ticket_num && touched.ticket_num) as boolean
                    }
                  >
                    <FormLabel htmlFor="ticket_num">Ticket #</FormLabel>
                    <Input
                      ref={firstField as any}
                      type="number"
                      name="ticket_num"
                      value={values.ticket_num}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormErrorMessage>{errors.ticket_num}</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box>
                  <FormControl
                    isInvalid={
                      (errors.sales_person && touched.sales_person) as boolean
                    }
                  >
                    <FormLabel htmlFor="sales_person">Sales Person</FormLabel>
                    <Input
                      name="sales_person"
                      value={values.sales_person}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <FormErrorMessage>{errors.sales_person}</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box>
                  <FormControl
                    isInvalid={
                      (errors.customer_name && touched.customer_name) as boolean
                    }
                  >
                    <FormLabel htmlFor="customer_name">Customer</FormLabel>
                    <Input
                      name="customer_name"
                      value={values.customer_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <FormErrorMessage>{errors.customer_name}</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box>
                  <FormControl
                    isInvalid={(errors.qty && touched.qty) as boolean}
                  >
                    <FormLabel htmlFor="qty">Qty</FormLabel>
                    <Input
                      name="qty"
                      value={values.qty}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="number"
                      min={1}
                    />

                    <FormErrorMessage>{errors.qty}</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box>
                  <FormControl
                    isInvalid={
                      (errors.price_id?.value &&
                        touched.price_id?.value) as boolean
                    }
                  >
                    <FormLabel htmlFor="item">Alteration</FormLabel>
                    <Select<PriceOption, false, PriceCategoryOption>
                      options={prices}
                      onBlur={handleBlur}
                      name="price_id"
                      value={values.price_id}
                      onChange={(value) => {
                        setFieldValue("price_id", value);
                      }}
                    />
                  </FormControl>
                </Box>

                <Box>
                  <FormLabel>Unit Price</FormLabel>
                  <Text>{numeral(unitPrice).format("$0,0.00")}</Text>
                </Box>

                <Box>
                  <FormLabel>Total Amount</FormLabel>
                  <Text>
                    {numeral(unitPrice * values.qty).format("$0,0.00")}
                  </Text>
                </Box>

                <Box>
                  <FormControl
                    isInvalid={(errors.paid && touched.paid) as boolean}
                  >
                    <FormLabel htmlFor="paid">Paid</FormLabel>
                    <Checkbox
                      name="paid"
                      isChecked={values.paid}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormErrorMessage>{errors.paid}</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box>
                  <FormControl
                    isInvalid={(errors.remarks && touched.remarks) as boolean}
                  >
                    <FormLabel htmlFor="remarks">Remarks</FormLabel>
                    <Textarea
                      name="remarks"
                      value={values.remarks}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <FormErrorMessage>{errors.remarks}</FormErrorMessage>
                  </FormControl>
                </Box>
              </Stack>
            </form>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              marginRight={2}
            >
              Cancel
            </Button>
            <Button
              colorScheme="green"
              isLoading={isSubmitting}
              type="submit"
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  const prices = await getPrices();
  return {
    props: {
      prices,
    },
  };
}

async function getPrices() {
  const query = supabase
    .from("categories")
    .select("*, prices(id, price, service))");

  const prices: DbResult<typeof query> = await query;
  const result = prices?.data || [];

  const categories: PriceCategoryOption[] = result.map(
    ({ category, prices }: any) => ({
      label: category,
      options: prices.map(({ service, id, price }: any) => ({
        label: `${service} - $${price}`,
        value: id,
        price,
      })),
    })
  );

  return categories;
}

async function getAlterations() {
  const query = supabase.from("alterations").select("*");
  const alterations: DbResult<typeof query> = await query;
  return alterations.data;
}
