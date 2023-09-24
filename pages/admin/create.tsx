import supabase from "@/lib/supabase-client";
import { useAlterationsStore } from "@/store/useAlterationsStore";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Input,
  SimpleGrid,
  Switch,
  Textarea,
  useToast,
  Button,
  Box,
} from "@chakra-ui/react";
import { FormikHelpers, useFormik } from "formik";
import React from "react";
import { mutate } from "swr";
import * as Yup from "yup";
import { ItemsForm } from "@/components/items-form";
import { ItemOption, PriceCategoryOption } from "@/lib/types/alteration";
import { DbResult } from "@/database.types";
import AdminLayout from "@/components/admin-layout";
import { useRouter } from "next/router";

const size = "sm";
const gap = 3;

export default function Create({
  prices,
  items,
}: {
  prices: PriceCategoryOption[];
  items: ItemOption[];
}) {
  const router = useRouter();
  const toast = useToast();
  const alterationItems = useAlterationsStore((state) => state.items);
  const setAlterationItems = useAlterationsStore((state) => state.setItems);

  const validationSchema = Yup.object().shape({
    ticket_num: Yup.number(),
    sales_person: Yup.string(),
    customer_name: Yup.string().required("Customer is required"),
    remarks: Yup.string().when("paid", ([paid], schema) =>
      !paid ? schema.required("Remarks is required") : schema
    ),
    paid: Yup.boolean().default(false),
  });

  type FormValues = Yup.InferType<typeof validationSchema>;

  const onSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    if (alterationItems.length === 0) {
      toast({
        title: "Error creating ticket.",
        description: "There must be at least one alteration item.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const now = new Date().toISOString();

    // insert alteration
    const { data, error } = await supabase
      .from("alterations")
      .insert({
        created_at: now,
        ticket_num: values.ticket_num,
        sales_person: values.sales_person,
        customer_name: values.customer_name,
        remarks: values.remarks,
        paid: values.paid,
      })
      .select("id");

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

    const [alteration] = data || [];
    const { id } = alteration || {};

    const { data: insertedItems, error: insertedItemsError } = await supabase
      .from("alteration_items")
      .insert(
        alterationItems.map((item) => ({
          id: item.id,
          alteration_id: id,
          item_id: item.item.value,
          qty: item.qty,
          created_at: now,
        }))
      )
      .select("*");

    if (insertedItemsError) {
      toast({
        title: "Error creating ticket.",
        description: "There was an error creating items",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const services = alterationItems
      .map((item) => {
        const price = item.prices.map((price) => ({
          alteration_item_id: item.id,
          price_id: price.value,
          created_at: now,
        }));

        return price;
      })
      .flat();

    // insert services
    const { error: insertedServicesError } = await supabase
      .from("alteration_services")
      .insert(services)
      .select("*");

    if (insertedServicesError) {
      toast({
        title: "Error creating ticket.",
        description: "There was an error creating services",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    mutate("/api/alterations");
    resetForm();
    setAlterationItems([]);

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

  return (
    <AdminLayout>
      <SimpleGrid columns={1} gap={3}>
        <Box>
          <Heading size="md">Create New Alteration</Heading>
        </Box>

        <Box>
          <SimpleGrid columns={1} gap={gap}>
            <GridItem>
              <form
                onSubmit={handleSubmit}
                style={{
                  width: "100%",
                }}
              >
                <SimpleGrid gap={gap}>
                  <GridItem>
                    <FormControl
                      isInvalid={
                        (errors.ticket_num && touched.ticket_num) as boolean
                      }
                    >
                      <FormLabel htmlFor="ticket_num">Ticket #</FormLabel>
                      <Input
                        size={size}
                        type="number"
                        name="ticket_num"
                        value={values.ticket_num}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <FormErrorMessage>{errors.ticket_num}</FormErrorMessage>
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl
                      isInvalid={
                        (errors.sales_person && touched.sales_person) as boolean
                      }
                    >
                      <FormLabel htmlFor="sales_person">Sales Person</FormLabel>
                      <Input
                        size={size}
                        name="sales_person"
                        value={values.sales_person}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      <FormErrorMessage>{errors.sales_person}</FormErrorMessage>
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl
                      isInvalid={
                        (errors.customer_name &&
                          touched.customer_name) as boolean
                      }
                    >
                      <FormLabel htmlFor="customer_name">Customer</FormLabel>
                      <Input
                        size={size}
                        name="customer_name"
                        value={values.customer_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      <FormErrorMessage>
                        {errors.customer_name}
                      </FormErrorMessage>
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl
                      isInvalid={(errors.remarks && touched.remarks) as boolean}
                    >
                      <FormLabel htmlFor="remarks">Remarks</FormLabel>
                      <Textarea
                        size={size}
                        name="remarks"
                        value={values.remarks}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      <FormErrorMessage>{errors.remarks}</FormErrorMessage>
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl
                      isInvalid={(errors.paid && touched.paid) as boolean}
                    >
                      <FormLabel htmlFor="paid">Paid</FormLabel>

                      <Switch
                        name="paid"
                        isChecked={values.paid}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <FormErrorMessage>{errors.paid}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </SimpleGrid>
              </form>
            </GridItem>

            <GridItem>
              <ItemsForm prices={prices} items={items} />
            </GridItem>
          </SimpleGrid>
        </Box>

        <Box>
          <Button
            size={"sm"}
            colorScheme="green"
            isLoading={isSubmitting}
            type="submit"
            onClick={() => handleSubmit()}
            marginRight={2}
          >
            Submit
          </Button>

          <Button
            size={"sm"}
            variant="outline"
            onClick={() => {
              resetForm();
              setAlterationItems([]);
            }}
            marginRight={2}
          >
            Reset
          </Button>

          <Button
            size={"sm"}
            variant="outline"
            onClick={() => {
              router.push("/admin");
            }}
            marginRight={2}
          >
            Cancel
          </Button>
        </Box>
      </SimpleGrid>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  const prices = await getPrices();
  const items = await getItems();
  return {
    props: {
      prices,
      items,
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

async function getItems() {
  const query = supabase.from("items").select("*");
  const items: DbResult<typeof query> = await query;

  const res =
    items.data?.map(({ id, description }: any) => ({
      label: description,
      value: id,
    })) || [];

  return res;
}
