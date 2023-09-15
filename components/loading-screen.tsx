import { Center, GridItem } from "@chakra-ui/layout";
import React from "react";
import { Layout } from "./layout";
import { Logo } from "./logo";
import { Spinner } from "@chakra-ui/spinner";

export const LoadingScreen = () => {
  return (
    <Layout>
      <GridItem colSpan={4}>
        <Logo showMenu={false} />
      </GridItem>
      <GridItem colSpan={4}>
        <Center>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Center>
      </GridItem>
    </Layout>
  );
};
