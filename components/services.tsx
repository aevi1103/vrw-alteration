import React from "react";
import services from "@/data/services.json";
import groupby from "lodash.groupby";
import {
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  SimpleGrid,
  Heading,
  useMediaQuery,
} from "@chakra-ui/react";

export const Services = () => {
  const groupedServices = React.useMemo(() => groupby(services, "name"), []);
  const [isLarge] = useMediaQuery("(min-width: 768px)");

  return (
    <SimpleGrid columns={1} spacing={10} marginTop={isLarge ? 10 : 0}>
      {Object.entries(groupedServices).map(([category, services]) => (
        <TableContainer key={category}>
          <Heading size={"md"} marginBottom={5} fontWeight={"semibold"}>
            {category}
          </Heading>
          <Table variant="simple">
            <Tbody>
              {services.map((service) => (
                <Tr key={service.description}>
                  <Td borderColor={"none"} fontWeight={"medium"}>
                    {service.description}
                  </Td>
                  <Td borderColor={"none"} isNumeric>
                    {service.price}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ))}
    </SimpleGrid>
  );
};
