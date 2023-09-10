import React from "react";
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

export const Services = ({ prices }: { prices: any }) => {
  const [isLarge] = useMediaQuery("(min-width: 768px)");

  const tableCellStyle = {
    whiteSpace: isLarge ? "nowrap" : "normal", // Use nowrap for larger screens and normal for smaller screens
    wordWrap: "break-word", // Allow word wrap within cells
  };

  return (
    <SimpleGrid columns={1} spacing={10} marginTop={isLarge ? 10 : 0}>
      {prices.map((service: any) => (
        <TableContainer key={service.category}>
          <Heading size={"md"} marginBottom={5} fontWeight={"semibold"}>
            {service.category}
          </Heading>
          <Table
            variant="simple"
            size={isLarge ? "md" : "sm"}
            marginBottom={2}
            sx={{
              tableLayout: "fixed",
            }}
          >
            <Tbody>
              {service.prices.map((p: any, index: number) => (
                <Tr key={p.service}>
                  <Td
                    borderColor={"none"}
                    border={index === service.prices.length - 1 ? 0 : undefined}
                    fontWeight={"medium"}
                    sx={tableCellStyle}
                  >
                    {p.service}
                  </Td>
                  <Td
                    borderColor={"none"}
                    border={index === service.prices.length - 1 ? 0 : undefined}
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
