// components/ContactForm.tsx
import { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Heading,
  SimpleGrid,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { IContactFormData } from "@/lib/types/contact-form";

const initialState: IContactFormData = {
  name: "",
  email: "",
  message: "",
};

export function ContactForm() {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<IContactFormData>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here (e.g., send data to server)
    setIsSubmitting(true);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // Request was successful
      const data = await response.json();

      toast({
        title: "Contact form submitted.",
        description: "We've send your message to our team.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      setIsSubmitting(false);
      setFormData(initialState);

      console.log("Server response:", data);
    } else {
      // Handle error
      console.error("Error:", response.statusText);
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      id="contact"
      backgroundColor={"white"}
      shadow={"lg"}
      padding={10}
      marginBottom={10}
      borderRadius={10}
    >
      <SimpleGrid columns={1} spacing={5} marginBottom={10}>
        <Stack marginBottom={5}>
          <Heading size={"lg"}>Contact Us</Heading>
          <Heading size={"md"} fontWeight={"light"}>
            {`We'd love to hear from you!`}
          </Heading>
        </Stack>

        <Stack>
          <Heading size={"sm"}>Contact</Heading>
          <Heading size={"xs"} fontWeight={"light"}>
            <a href="mailto: aebbradgie@gmail.com">aebraddgie@gmail.com</a>
          </Heading>
        </Stack>

        <Stack>
          <Heading size={"sm"}>Phone</Heading>
          <Heading size={"xs"} fontWeight={"light"}>
            574-329-1315
          </Heading>
        </Stack>

        <Stack>
          <Heading size={"sm"}>Based In</Heading>
          <Heading size={"xs"} fontWeight={"light"}>
            South Bend, IN
          </Heading>
        </Stack>
      </SimpleGrid>

      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Message</FormLabel>
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </FormControl>
        <Button
          type="submit"
          bgColor={"brand.primary"}
          isLoading={isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}
