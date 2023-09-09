import {
  Grid,
  GridItem,
  Container,
  Flex,
  Spacer,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import {
  AppMenu,
  Services,
  Gallery,
  About,
  Logo,
  ContactForm,
} from "@/components";
import { useEffect, useState } from "react";
import useWindowScroll from "beautiful-react-hooks/useWindowScroll";
import { HamburgerIcon } from "@chakra-ui/icons";
import Image from "next/image";
import React from "react";
import { supabase } from "@/lib/supabase-client";
import { DbResult } from "@/database.types";
import { AnimatedComponent } from "@/components/animated-component";

export default function Home({ prices }: { prices: any }) {
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

        <GridItem colSpan={4} id="services">
          <Container>
            <AnimatedComponent animatedName="fadeInLeft">
              <Services prices={prices} />
            </AnimatedComponent>
          </Container>
        </GridItem>

        <GridItem colSpan={4} id="gallery">
          <AnimatedComponent animatedName="fadeInRight">
            <Container>
              <Gallery tag="machine" title="Machine" />
              <Gallery tag="alterations" title="Alterations" />
              <Gallery tag="workspace" title="Workspace" />
            </Container>
          </AnimatedComponent>
        </GridItem>

        <GridItem colSpan={4} id="about">
          <Container>
            <About />
          </Container>
        </GridItem>

        <GridItem colSpan={4} id="contact">
          <Container>
            <ContactForm />
          </Container>
        </GridItem>
      </Grid>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"xs"}>
        <DrawerOverlay />
        <DrawerContent backgroundColor={"brand.primary"}>
          <DrawerCloseButton />
          <DrawerHeader />
          <DrawerBody>
            <AppMenu isVertical onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export async function getServerSideProps() {
  const prices = await getPrices();
  return {
    props: {
      prices: prices,
    },
  };
}

async function getPrices() {
  const query = supabase
    .from("categories")
    .select("*, prices(id, price, service))");

  const prices: DbResult<typeof query> = await query;
  return prices.data;
}
