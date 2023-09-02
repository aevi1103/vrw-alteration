"use client";

import { Grid, GridItem, Container, SimpleGrid } from "@chakra-ui/react";
import { AppMenu, Services, Gallery, About, Logo } from "@/components";
// import useWindowScroll from "beautiful-react-hooks/useWindowScroll";
// import { useState } from "react";

export default function Home() {
  // const [scrollY, setScrollY] = useState(window.scrollY);
  // const onWindowScroll = useWindowScroll();

  // onWindowScroll((event) => {
  //   setScrollY(window.scrollY);
  // });

  // console.log(scrollY);

  return (
    <SimpleGrid columns={1} spacing={20}>
      <Container>
        <Grid templateColumns="repeat(5, 1fr)" gap={2} paddingTop={3}>
          <GridItem colSpan={5}>
            <Logo />
          </GridItem>
          <GridItem colSpan={5}>
            <AppMenu />
          </GridItem>
          <GridItem colSpan={5}>
            <Services />
          </GridItem>
        </Grid>
      </Container>

      <Gallery />

      <Container>
        <About />
      </Container>
    </SimpleGrid>
  );
}
