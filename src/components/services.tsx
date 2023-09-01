import React from "react";
import services from "@/data/services.json";
import groupby from "lodash.groupby";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  SimpleGrid,
  Heading,
} from "@chakra-ui/react";

export const Services = () => {
  const groupedServices = React.useMemo(() => groupby(services, "name"), []);

  console.log("groupedServices", groupedServices);

  return (
    <SimpleGrid columns={1} spacing={10} marginTop={10}>
      {Object.entries(groupedServices).map(([category, services]) => (
        <TableContainer key={category}>
          <Heading size={"md"} marginBottom={5} fontWeight={"semibold"}>
            {category}
          </Heading>
          <Table variant="simple">
            <Tbody>
              {services.map((service) => (
                <Tr key={service.description} fontSize={"xl"}>
                  <Td borderColor={"none"} fontWeight={"light"}>
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
