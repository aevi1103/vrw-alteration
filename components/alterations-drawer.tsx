import { useAlterationsStore } from "@/store/useAlterationsStore";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  DrawerFooter,
  Button,
  useToast,
  SimpleGrid,
  GridItem,
  Switch,
} from "@chakra-ui/react";
import { FormikHelpers, useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { mutate } from "swr";
import { ItemOption, PriceCategoryOption } from "@/lib/types/alteration";
import { ItemsForm } from "./items-form";
import supabase from "@/lib/supabase-client";

const size = "sm";
const gap = 3;

export const AleterationDrawer = ({
  prices,
  items,
}: {
  prices: PriceCategoryOption[];
  items: ItemOption[];
}) => {
  const toast = useToast();
  const toggle = useAlterationsStore((state) => state.toggle);
  const visible = useAlterationsStore((state) => state.visible);
  const expanded = useAlterationsStore((state) => state.expanded);
  const toggleExpanded = useAlterationsStore((state) => state.toggleExpanded);
  const alterationItems = useAlterationsStore((state) => state.items);
  const setAlterationItems = useAlterationsStore((state) => state.setItems);

  const validationSchema = Yup.object().shape({
    ticket_num: Yup.number(),
    sales_person: Yup.string(),
    customer_name: Yup.string().required("Customer is required"),
    remarks: Yup.string().required("Remarks is required"),
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
    toggle();
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
    <Drawer
      isOpen={visible}
      placement="right"
      onClose={toggle}
      size={expanded ? "full" : "lg"}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Create New Record</DrawerHeader>

        <DrawerBody>
          <SimpleGrid columns={1} gap={gap} marginTop={2}>
            <GridItem>
              <form
                onSubmit={handleSubmit}
                style={{
                  width: "100%",
                }}
              >
                <SimpleGrid columns={4} gap={gap} marginTop={5}>
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

                  <GridItem colSpan={3}>
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

                  <GridItem colSpan={2}>
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

                  <GridItem colSpan={4}>
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
                </SimpleGrid>
              </form>
            </GridItem>

            <GridItem>
              <ItemsForm prices={prices} items={items} />
            </GridItem>
          </SimpleGrid>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button
            size={"sm"}
            variant="outline"
            onClick={toggleExpanded}
            marginRight={2}
          >
            {expanded ? "Collapse" : "Expand"}
          </Button>
          <Button
            size={"sm"}
            variant="outline"
            onClick={() => {
              resetForm();
              toggle();
            }}
            marginRight={2}
          >
            Cancel
          </Button>
          <Button
            size={"sm"}
            variant="outline"
            onClick={() => resetForm()}
            marginRight={2}
          >
            Reset
          </Button>
          <Button
            size={"sm"}
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
  );
};
