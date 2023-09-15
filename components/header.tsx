import { Container, GridItem } from "@chakra-ui/layout";
import React from "react";
import { Logo } from "./logo";
import { useScrollY } from "@/hooks/useScrollY";
import { useHeaderStore } from "@/store/useHeaderSTORE";

export const Header = () => {
  const { scrollY } = useScrollY();

  return (
    <GridItem
      colSpan={4}
      alignSelf={"start"}
      position={"sticky"}
      top={0}
      zIndex={999}
      backdropFilter={scrollY > 0 ? "blur(10px)" : "blur(0px)"}
      shadow={scrollY > 0 ? "md" : "none"}
    >
      <Container>
        <Logo />
      </Container>
    </GridItem>
  );
};
