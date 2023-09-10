import { AboutDetails, AboutRecord } from "@/lib/types/about";
import { Box, Heading, Text } from "@chakra-ui/react";
import { useMemo } from "react";

export const About = ({ data }: { data: AboutRecord[] }) => {
  const aboutData = useMemo(() => data[0].data, [data]);

  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        {aboutData.title}
      </Heading>
      {aboutData.sections.map((section, index) => (
        <Text key={index} mb={6}>
          <strong>{section.heading}</strong>
          <br />
          {section.text}
        </Text>
      ))}
    </Box>
  );
};
