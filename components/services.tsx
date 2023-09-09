import React, { useEffect } from "react";
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
  const [prices, setPrices] = React.useState<any>([]);

  useEffect(() => {
    const getPrices = async () => {
      const res = await fetch("/api/prices");
      const prices = await res.json();
      setPrices(prices);
    };

    getPrices();
  }, []);

  const [isLarge] = useMediaQuery("(min-width: 768px)");

  return (
    <SimpleGrid columns={1} spacing={10} marginTop={isLarge ? 10 : 0}>
      {prices.map((service: any) => (
        <TableContainer key={service.category}>
          <Heading size={"md"} marginBottom={5} fontWeight={"semibold"}>
            {service.category}
          </Heading>
          <Table variant="simple" size={isLarge ? "md" : "sm"}>
            <Tbody>
              {service.prices.map((p: any) => (
                <Tr key={p.service}>
                  <Td borderColor={"none"} border={0} fontWeight={"medium"}>
                    {p.service}
                  </Td>
                  <Td
                    borderColor={"none"}
                    border={0}
                    isNumeric
                    fontWeight={"semibold"}
                  >
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
