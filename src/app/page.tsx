"use client";

import { Grid, GridItem, Container, SimpleGrid } from "@chakra-ui/react";
import { AppMenu, Services, Gallery, About, Logo } from "@/components";
import { useState } from "react";
import useWindowScroll from "beautiful-react-hooks/useWindowScroll";
// import { useState } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const onWindowScroll = useWindowScroll();

  onWindowScroll((event) => {
    if (typeof window !== "undefined") {
      setScrollY(window.scrollY);
    }
  });

  // console.log(scrollY);

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={10}>
      <GridItem
        colSpan={4}
        alignSelf={"start"}
        position={"sticky"}
        top={0}
        zIndex={999}
        // className="bg-pattern"
        backdropFilter={scrollY > 0 ? "blur(5px)" : "blur(0px)"}
        shadow={scrollY > 0 ? "md" : "none"}
      >
        <Container>
          <Logo />
          <AppMenu />
        </Container>
      </GridItem>

      <GridItem colSpan={4}>
        <Container>
          <Services />
        </Container>
      </GridItem>

      <GridItem colSpan={4}>
        <Gallery />
      </GridItem>

      <GridItem colSpan={4}>
        <Container>
          <About />
        </Container>
      </GridItem>
    </Grid>
  );
}
