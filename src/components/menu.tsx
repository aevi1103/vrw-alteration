"use client";
import { Flex, Box, Center } from "@chakra-ui/react";
import Link from "next/link";
import { useAuth } from "@/utils/useAuth";

const LinkWrapper = ({ children }: { children: React.ReactNode }) => (
  <Box
    _hover={{
      textDecoration: "none",
      color: "brand.secondary",
      transition: "all 0.5s ease-out",
    }}
  >
    {children}
  </Box>
);

export function AppMenu() {
  const { user, signIn, auth } = useAuth();

  return (
    <Flex
      gap={6}
      marginTop={5}
      align={"center"}
      justify="center"
      fontWeight={"medium"}
      bg="brand.primary"
      p={4}
      boxShadow="lg"
      position="static"
      top="0"
      zIndex="999"
      borderRadius={"md"}
    >
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
    </Flex>
  );
}
