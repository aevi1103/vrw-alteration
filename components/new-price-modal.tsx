import { useAlterationsStore } from "@/store/useAlterationsStore";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Stack,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { FormikHelpers, useFormik } from "formik";
import React, { useEffect } from "react";
import supabase from "@/supabase/supabase-client";
import { DbResult } from "@/database.types";
import { Select } from "chakra-react-select";
import { mutate } from "swr";

type Category = {
  value: string;
  label: string;
};

export const NewPriceModal = () => {
  const toast = useToast();

  const [catergories, setCategories] = React.useState<Category[]>();

  useEffect(() => {
    const fetchCategories = async () => {
      const query = supabase.from("categories").select("*");
      const result: DbResult<typeof query> = await query;

      const data: Category[] =
        result?.data?.map((category) => ({
          value: category.id,
          label: category.category || "n/a",
        })) || [];

      setCategories(data);
    };

    fetchCategories();
  }, []);

  const showNewPriceModal = useAlterationsStore(
    (state) => state.showNewPriceModal
  );
  const toggleNewPriceModal = useAlterationsStore(
    (state) => state.toggleShowNewPriceModal
  );

  const validationSchema = Yup.object().shape({
    category_id: Yup.object().shape({
      value: Yup.string().required("Category is required"),
      label: Yup.string().required("Category is required"),
    }),
    service: Yup.string().required("Alteration is required"),
    price: Yup.number().min(1).required("Price is required"),
  });

  type FormValues = Yup.InferType<typeof validationSchema>;

  const onSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    const record = await supabase
      .from("prices")
      .select("*")
      .eq("category_id", values.category_id.value)
      .eq("service", values.service);

    if (record.error) {
      toast({
        title: "Error",
        description: record.error.message,
        status: "error",
        duration: 9000,
      });
      return;
    }

    if (record.data.length > 0) {
      toast({
        title: "Error",
        description: "Alteration already exists",
        status: "error",
        duration: 9000,
      });
      return;
    }

    const { data, error } = await supabase.from("prices").insert([
      {
        category_id: values.category_id.value,
        service: values.service.trim(),
        price: values.price,
        other: true,
      },
    ]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
      });
      return;
    }

    mutate("/api/prices");

    toast({
      title: "Success",
      description: "Alteration created",
      status: "success",
      duration: 9000,
    });
  };

  const [initialValues] = React.useState<FormValues>({
    category_id: {
      value: "",
      label: "",
    },
    service: "",
    price: 1,
  });

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
    submitForm,
  } = useFormik<FormValues>({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <Modal
      isOpen={showNewPriceModal}
      onClose={() => {
        toggleNewPriceModal();
        resetForm();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Alteration</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form
            onSubmit={handleSubmit}
            style={{
              width: "100%",
            }}
          >
            <Stack spacing={4}>
              <FormControl
                isInvalid={
                  (errors.category_id?.value &&
                    touched.category_id?.value) as boolean
                }
              >
                <FormLabel htmlFor="category_id">Category</FormLabel>

                <Select
                  options={catergories}
                  onBlur={handleBlur}
                  name="category_id"
                  value={values.category_id}
                  onChange={(value) => {
                    setFieldValue("category_id", value);
                  }}
                />

                <FormErrorMessage>{errors.category_id?.value}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={(errors.service && touched.service) as boolean}
              >
                <FormLabel htmlFor="service">Alteration</FormLabel>
                <Input
                  name="service"
                  value={values.service}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormErrorMessage>{errors.service}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={(errors.price && touched.price) as boolean}
              >
                <FormLabel htmlFor="price">Price</FormLabel>
                <Input
                  type="number"
                  name="price"
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormErrorMessage>{errors.price}</FormErrorMessage>
              </FormControl>
            </Stack>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={toggleNewPriceModal}>
            Close
          </Button>
          <Button
            colorScheme="green"
            onClick={() => submitForm()}
            isLoading={isSubmitting}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
