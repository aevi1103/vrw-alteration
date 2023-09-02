"use client";
import { Flex, Box, Center, Grid, GridItem } from "@chakra-ui/react";
import Link from "next/link";
import { useAuth } from "@/utils/useAuth";

const LinkWrapper = ({ children }: { children: React.ReactNode }) => (
  <GridItem
    placeSelf={"center"}
    fontWeight="normal"
    position={"relative"}
    _hover={{
      transform: "scale(1.1)",
      "::after": {
        content: "''",
        position: "absolute",
        bottom: "0",
        left: "0",
        width: "100%",
        height: "2px",
        backgroundColor: "black",
      },
    }}
    transition="all 0.5s ease"
  >
    {children}
  </GridItem>
);

export function AppMenu() {
  const { user, signIn, auth } = useAuth();

  return (
    <Box
      position="sticky"
      top="0"
      bg="white" /* Set your desired background color */
      zIndex="10" /* Set an appropriate z-index value */
    >
      <Grid gridTemplateColumns={"repeat(6, minmax(0, 1fr))"}>
        <LinkWrapper>
          <Link href={"/"}>Home</Link>
        </LinkWrapper>

        <LinkWrapper>
          <Link
            href={{
              hash: "#services",
            }}
          >
            Services
          </Link>
        </LinkWrapper>
        <LinkWrapper>
          <Link
            href={{
              hash: "#gallery",
            }}
          >
            Gallery
          </Link>
        </LinkWrapper>
        <LinkWrapper>
          <Link
            href={{
              hash: "#about",
            }}
          >
            About
          </Link>
        </LinkWrapper>
        <LinkWrapper>
          <Link
            href={{
              hash: "#contact",
            }}
          >
            Contact
          </Link>
        </LinkWrapper>
        {user !== undefined && (
          <LinkWrapper>
            <Link
              href={"/"}
              onClick={() => {
                if (user) {
                  auth.signOut();
                } else {
                  signIn();
                }
              }}
            >
              {user ? "Logout" : "Login"}
            </Link>
          </LinkWrapper>
        )}
      </Grid>
    </Box>
  );
}
