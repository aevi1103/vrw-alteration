import { ItemOption, PriceCategoryOption } from "@/pages/admin";
import { useAlterationsStore } from "@/store/useAlterationsStore";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Checkbox,
  Textarea,
  DrawerFooter,
  Button,
  Box,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { FormikHelpers, useFormik } from "formik";
import numeral from "numeral";
import React from "react";
import * as Yup from "yup";
import useSWR, { mutate } from "swr";

export const AleterationDrawer = ({
  prices,
  items,
}: {
  prices: PriceCategoryOption[];
  items: ItemOption[];
}) => {
  const toggle = useAlterationsStore((state) => state.toggle);
  const visible = useAlterationsStore((state) => state.visible);
  const toast = useToast();

  const validationSchema = Yup.object().shape({
    ticket_num: Yup.number(),
    sales_person: Yup.string(),
    customer_name: Yup.string().required("Customer is required"),
    qty: Yup.number().required("Qty is required"),
    item_id: Yup.object().shape({
      label: Yup.string().required("Item is required"),
      value: Yup.string().required("Item is required"),
    }),
    price_id: Yup.array()
      .of(
        Yup.object().shape({
          label: Yup.string().required("Item is required"),
          value: Yup.string().required("Item is required"),
          price: Yup.number().required("Item is required"),
        })
      )
      .min(1, "Must have at least one item")
      .required("Alteration is required"),
    remarks: Yup.string().required("Remarks is required"),
    paid: Yup.boolean().default(false),
  });

  type FormValues = Yup.InferType<typeof validationSchema>;

  const onSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    console.log({ values });

    // const { data, error } = await supabase
    //   .from("alterations")
    //   .insert({
    //     created_at: new Date().toISOString(),
    //     ticket_num: values.ticket_num,
    //     sales_person: values.sales_person,
    //     customer_name: values.customer_name,
    //     qty: values.qty,
    //     item_id: values.item_id.value,
    //     remarks: values.remarks,
    //     paid: values.paid,
    //   })
    //   .select("id");

    // if (error) {
    //   toast({
    //     title: "Error creating ticket.",
    //     description: "There was an error creating your ticket.",
    //     status: "error",
    //     duration: 9000,
    //     isClosable: true,
    //   });
    //   return;
    // }

    // const [first] = data || [];
    // const { id = 0 } = first || {};

    // const alterations = values.price_id.map((item) => ({
    //   created_at: new Date().toISOString(),
    //   alteration_id: id,
    //   price_id: item.value,
    // }));

    // const { error: error2 } = await supabase
    //   .from("alteration_services")
    //   .insert(alterations)
    //   .select("id");

    // if (error2) {
    //   toast({
    //     title: "Error creating ticket.",
    //     description: "There was an error creating your ticket.",
    //     status: "error",
    //     duration: 9000,
    //     isClosable: true,
    //   });
    //   return;
    // }

    mutate("/api/alterations");
    // resetForm();
    // onClose();

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
    item_id: {
      label: "",
      value: "",
    },
    price_id: [],
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
    <Drawer isOpen={visible} placement="right" onClose={toggle} size={"lg"}>
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
                <FormControl isInvalid={(errors.qty && touched.qty) as boolean}>
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
                    (errors.item_id?.value && touched.item_id?.value) as boolean
                  }
                >
                  <FormLabel htmlFor="item">Item</FormLabel>
                  <Select
                    options={items}
                    onBlur={handleBlur}
                    name="item_id"
                    value={values.item_id}
                    onChange={(value) => {
                      setFieldValue("item_id", value);
                    }}
                  />

                  <FormErrorMessage>{errors.item_id?.value}</FormErrorMessage>
                </FormControl>
              </Box>

              <Box>
                <FormControl
                  isInvalid={
                    (errors.price_id &&
                      errors.price_id?.length > 0 &&
                      touched.price_id) as boolean
                  }
                >
                  <FormLabel htmlFor="item">Alteration</FormLabel>
                  <Select
                    options={prices}
                    onBlur={handleBlur}
                    name="price_id"
                    value={values.price_id}
                    isMulti
                    onChange={(value) => {
                      console.log({ value });
                      setFieldValue("price_id", value);
                    }}
                  />

                  <FormErrorMessage>
                    {errors.price_id as string}
                  </FormErrorMessage>
                </FormControl>
              </Box>

              {/* <Box>
                <FormLabel>TotalUnit Price</FormLabel>
                <Text>{numeral(totalUnitPrice).format("$0,0.00")}</Text>
              </Box>

              <Box>
                <FormLabel>Total Amount</FormLabel>
                <Text>{numeral(totalAmount).format("$0,0.00")}</Text>
              </Box> */}

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
              toggle();
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
  );
};
