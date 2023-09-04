"use client";

import {
  Grid,
  GridItem,
  Container,
  SimpleGrid,
  Flex,
  Spacer,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { AppMenu, Services, Gallery, About, Logo } from "@/components";
import { useEffect, useState } from "react";
import useWindowScroll from "beautiful-react-hooks/useWindowScroll";
import { HamburgerIcon } from "@chakra-ui/icons";
import Image from "next/image";
import React from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const onWindowScroll = useWindowScroll();
  const [isLarge] = useMediaQuery("(min-width: 768px)");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const scroll = localStorage.getItem("scrollY");
      if (scroll) {
        setScrollY(parseInt(scroll));
      }
    }
  }, []);

  onWindowScroll((event) => {
    if (typeof window !== "undefined") {
      const scroll = window.scrollY;
      setScrollY(scroll);
      localStorage.setItem("scrollY", scroll.toString());
    }
  });

  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)">
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
            {scrollY > 0 ? (
              <Flex padding={2} alignItems={"center"}>
                <Image
                  src="/logo.png"
                  alt="Logo"
                  objectFit="contain"
                  height={200}
                  width={200}
                />
                <Spacer />
                <HamburgerIcon
                  width={8}
                  height={8}
                  onClick={onOpen}
                  cursor={"pointer"}
                />
              </Flex>
            ) : (
              <>
                <Logo />
                {isLarge && <AppMenu />}
              </>
            )}
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
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"xs"}>
        <DrawerOverlay />
        <DrawerContent backgroundColor={"brand.primary"}>
          <DrawerCloseButton />
          <DrawerHeader />
          <DrawerBody>
            <AppMenu isVertical />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
