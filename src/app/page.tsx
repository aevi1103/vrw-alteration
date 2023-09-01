"use client";

import {
  Grid,
  GridItem,
  Container,
  Box,
  Flex,
  Spacer,
  Center,
  SimpleGrid,
} from "@chakra-ui/react";
import { AppMenu, Services, Gallery, About } from "@/components";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <SimpleGrid columns={1} spacing={20}>
      <Container>
        <Grid templateColumns="repeat(5, 1fr)" gap={2} paddingTop={3}>
          <GridItem colSpan={5}>
            <Box
              height={250}
              position={"relative"}
              className="animate__animated animate__fadeInDown"
              marginY={20}
            >
              <Image
                src="/logo.png"
                alt="Logo"
                layout="fill"
                objectFit="contain"
              />
            </Box>
          </GridItem>
          <GridItem colSpan={5}>
            <Center>
              <Flex
                gap={5}
                marginTop={8}
                fontSize={"xl"}
                fontWeight={"light"}
                className="animate__animated animate__backInDown"
              >
                <Box>
                  <Link href={"/"}>Home</Link>
                </Box>
                <Box>
                  <Link
                    href={{
                      hash: "#services",
                    }}
                  >
                    Services
                  </Link>
                </Box>
                <Box>
                  <Link
                    href={{
                      hash: "#gallery",
                    }}
                  >
                    Gallery
                  </Link>
                </Box>
                <Box>
                  <Link
                    href={{
                      hash: "#about",
                    }}
                  >
                    About
                  </Link>
                </Box>
                <Box>
                  <Link
                    href={{
                      hash: "#contact",
                    }}
                  >
                    Contact
                  </Link>
                </Box>
              </Flex>
            </Center>
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
