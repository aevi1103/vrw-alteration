import { Item, ItemOption, PriceCategoryOption } from "@/lib/types/alteration";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Heading,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import { FormikHelpers, useFormik } from "formik";
import React, { useMemo } from "react";
import { Select } from "chakra-react-select";
import * as Yup from "yup";
import { AlterationItemsTable } from "./alterations-items-table";
import { useAlterationsStore } from "@/store/useAlterationsStore";
import { v4 as uuidv4 } from "uuid";

const size = "sm";
const gap = 3;

export const ItemsForm = ({
  prices,
  items,
}: {
  prices: PriceCategoryOption[];
  items: ItemOption[];
}) => {
  const setAlterationItems = useAlterationsStore((state) => state.setItems);
  const alterationItems = useAlterationsStore((state) => state.items);

  const validationSchema = Yup.object().shape({
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
  });

  type FormValues = Yup.InferType<typeof validationSchema>;

  const initialValues: FormValues = {
    qty: 1,
    item_id: {
      label: "",
      value: "",
    },
    price_id: [],
  };

  const onSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    const item: Item = {
      id: uuidv4(),
      qty: values.qty,
      item: values.item_id,
      prices: values.price_id,
    };

    setAlterationItems([...alterationItems, item]);

    resetForm();
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
    <Card
      borderColor={alterationItems.length === 0 ? "red.500" : "green.500"}
      borderWidth={2}
    >
      <CardHeader paddingBottom={0}>
        <Heading size="sm">Add Alteration</Heading>
      </CardHeader>
      <CardBody>
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
                    isInvalid={(errors.qty && touched.qty) as boolean}
                  >
                    <FormLabel htmlFor="qty">Qty</FormLabel>
                    <Input
                      size={size}
                      name="qty"
                      value={values.qty}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="number"
                      min={1}
                    />

                    <FormErrorMessage>{errors.qty}</FormErrorMessage>
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl
                    isInvalid={
                      (errors.item_id?.value &&
                        touched.item_id?.value) as boolean
                    }
                  >
                    <FormLabel htmlFor="item">Item</FormLabel>
                    <Select
                      size={size}
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
                </GridItem>

                <GridItem>
                  <FormControl
                    isInvalid={
                      (errors.price_id &&
                        errors.price_id?.length > 0 &&
                        touched.price_id) as boolean
                    }
                  >
                    <FormLabel htmlFor="item">Alteration</FormLabel>
                    <Select
                      size={size}
                      options={prices}
                      onBlur={handleBlur}
                      name="price_id"
                      value={values.price_id}
                      isMulti
                      onChange={(value) => {
                        setFieldValue("price_id", value);
                      }}
                    />

                    <FormErrorMessage>
                      {errors.price_id as string}
                    </FormErrorMessage>
                  </FormControl>
                </GridItem>

                <GridItem>
                  <Button
                    variant="outline"
                    size={"sm"}
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
                    colorScheme="green"
                    isLoading={isSubmitting}
                    onClick={() => handleSubmit()}
                  >
                    Add Item
                  </Button>
                </GridItem>
              </SimpleGrid>
            </form>
          </GridItem>
          <GridItem>
            <AlterationItemsTable />
          </GridItem>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};
