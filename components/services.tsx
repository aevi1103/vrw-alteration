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
import { PricesResult } from "@/pages";

export const Services = ({ prices }: { prices: PricesResult }) => {
  console.log({ prices });

  const groupedServices = React.useMemo(() => groupby(services, "name"), []);
  const [isLarge] = useMediaQuery("(min-width: 768px)");

  return (
    <SimpleGrid columns={1} spacing={10} marginTop={isLarge ? 10 : 0}>
      {prices.map((service) => (
        <TableContainer key={service.category}>
          <Heading size={"md"} marginBottom={5} fontWeight={"semibold"}>
            {service.category}
          </Heading>
          <Table variant="simple">
            <Tbody>
              {service.prices.map((p) => (
                <Tr key={p.service}>
                  <Td borderColor={"none"} fontWeight={"medium"}>
                    {p.service}
                  </Td>
                  <Td borderColor={"none"} isNumeric>
                    ${p.price}
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
