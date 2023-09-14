// pages/privacy-policy.tsx
import { Box, Center, Container, Heading, Text } from "@chakra-ui/react";
import { NextPage } from "next";

const PrivacyPolicy: NextPage = () => {
  return (
    <Center h="100vh">
      <Container maxW="container.lg" py={10}>
        <Heading as="h1" size="xl" mb={6}>
          Privacy Policy
        </Heading>
        <Box bg="white" p={6} borderRadius="md">
          <Text fontSize="lg">
            At VRW Alteration (&ldquo;we,&rdquo;, &ldquo;our,&rdquo; or
            &ldquo;us&rdquo;), we are committed to protecting your privacy and
            ensuring the security of your personal information. This Privacy
            Policy outlines how we collect, use, and safeguard information when
            you interact with our alteration services and website. By accessing
            or using our services, you consent to the practices described in
            this Privacy Policy.
          </Text>

          <Text fontWeight="bold" mt={4}>
            Information We Collect
          </Text>
          <Text>
            We may collect the following types of information when you use our
            alteration services or visit our website:
          </Text>
          <ul>
            <li>
              Personal information, such as your name, contact details, and
              measurements, which you provide voluntarily.
            </li>
            <li>
              Transaction and billing information for alteration services.
            </li>
            <li>
              Automatically collected information, including your IP address,
              browser type, and usage data, to enhance our websites performance
              and security.
            </li>
          </ul>

          <Text fontWeight="bold" mt={4}>
            How We Use Your Information
          </Text>
          <Text>
            We use the information we collect for various purposes, including:
          </Text>
          <ul>
            <li>
              Providing high-quality alteration services tailored to your
              preferences.
            </li>
            <li>Improving our website and user experience.</li>
            <li>Processing payments and managing your orders.</li>
            <li>
              Communicating with you, including sending updates, appointment
              reminders, and newsletters.
            </li>
          </ul>

          <Text fontWeight="bold" mt={4}>
            Your Rights
          </Text>
          <Text>
            You have certain rights regarding your personal information,
            including the right to access, correct, or delete your data. To
            exercise these rights or if you have any questions or concerns about
            your data, please contact us at [your contact email or phone
            number].
          </Text>

          <Text fontWeight="bold" mt={4}>
            Data Security
          </Text>
          <Text>
            We take data security seriously and employ industry-standard
            measures to protect your information against unauthorized access or
            disclosure.
          </Text>

          <Text fontWeight="bold" mt={4}>
            Changes to This Privacy Policy
          </Text>
          <Text>
            We may update this Privacy Policy to reflect changes in our
            practices, services, or for legal and regulatory reasons. We will
            notify you of any material changes on our website.
          </Text>

          <Text fontWeight="bold" mt={4}>
            Contact Us
          </Text>
          <Text>
            If you have any questions or concerns about our Privacy Policy or
            data practices, please dont hesitate to contact us at [your contact
            email or phone number].
          </Text>
        </Box>
      </Container>
    </Center>
  );
};

export default PrivacyPolicy;
