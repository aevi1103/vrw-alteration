import {
  Item,
  ItemFormValues,
  ItemOption,
  PriceCategoryOption,
} from "@/lib/types/alteration";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Heading,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import { FormikHelpers, useFormik } from "formik";
import React, { useEffect } from "react";
import { Select } from "chakra-react-select";
import * as Yup from "yup";
import { AlterationItemsTable } from "./alterations-items-table";
import { useAlterationsStore } from "@/store/useAlterationsStore";
import { v4 as uuidv4 } from "uuid";

const size = "sm";
const gap = 3;

interface ItemsFormProps {
  prices: PriceCategoryOption[];
  items: ItemOption[];
}

export const ItemsForm = ({ prices, items }: ItemsFormProps) => {
  const setAlterationItems = useAlterationsStore((state) => state.setItems);
  const alterationItemsDraft = useAlterationsStore((state) => state.items);
  const setSelectedFormItem = useAlterationsStore(
    (state) => state.setSelectedFormItem
  );
  const selectedFormItem = useAlterationsStore(
    (state) => state.selectedFormItem
  );

  useEffect(() => {
    return () => {
      setSelectedFormItem(null);
    };
  }, [setSelectedFormItem]);

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

  const initialValues: ItemFormValues = {
    qty: 1,
    item_id: {
      label: "",
      value: "",
    },
    price_id: [],
  };

  const onSubmit = async (
    values: ItemFormValues,
    { resetForm }: FormikHelpers<ItemFormValues>
  ) => {
    if (selectedFormItem) {
      const newItems = alterationItemsDraft.map((item) => {
        if (item.id === selectedFormItem.id) {
          return {
            ...item,
            qty: values.qty,
            item: values.item_id,
            prices: values.price_id,
          };
        }

        return item;
      });

      setAlterationItems(newItems);

      resetForm();
      setSelectedFormItem(null);
      return;
    }

    const item: Item = {
      id: uuidv4(),
      qty: values.qty,
      item: values.item_id,
      prices: values.price_id,
    };

    setAlterationItems([...alterationItemsDraft, item]);

    resetForm();
    setSelectedFormItem(null);
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
  } = useFormik<ItemFormValues>({
    initialValues,
    onSubmit,
    validationSchema,
  });

  useEffect(() => {
    if (!selectedFormItem) {
      return;
    }

    setFieldValue("qty", selectedFormItem.qty);
    setFieldValue("item_id", selectedFormItem.item_id);
    setFieldValue("price_id", selectedFormItem.price_id);
  }, [selectedFormItem, setFieldValue]);

  return (
    <Card
      borderColor={alterationItemsDraft.length === 0 ? "red.500" : "green.500"}
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
                  <Flex gap={2}>
                    <Button
                      size={"sm"}
                      colorScheme={selectedFormItem ? "yellow" : "green"}
                      isLoading={isSubmitting}
                      onClick={() => handleSubmit()}
                    >
                      {selectedFormItem ? "Update Item" : "Add Item"}
                    </Button>
                    <Button
                      variant="outline"
                      size={"sm"}
                      onClick={() => {
                        resetForm();
                        setSelectedFormItem(null);
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="outline"
                      size={"sm"}
                      onClick={() => {
                        resetForm();
                        setAlterationItems([]);
                        setSelectedFormItem(null);
                      }}
                    >
                      Reset
                    </Button>
                  </Flex>
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
