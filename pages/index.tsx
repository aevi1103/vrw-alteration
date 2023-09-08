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
import { Prisma } from "@prisma/client";
import { getPrices } from "@/lib/data/services";

export default function Home({
  prices,
  error,
}: {
  prices: PricesResult;
  error: any;
}) {
  console.log({ prices, error });

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
            <Services prices={prices} />
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

        <GridItem colSpan={4}>
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
            <AppMenu isVertical />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const prices = await getPrices();
    return {
      props: {
        prices,
      },
    };
  } catch (error: any) {
    console.log(error);
    return {
      props: {
        prices: [],
        error: error.message,
      },
    };
  }
}

export type PricesResult = Prisma.PromiseReturnType<typeof getPrices>;