import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "@/contexts/AuthContext";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
} from "@chakra-ui/react";
import React from "react";
import Image from "next/image";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signOut, name } = useAuth();

  const router = useRouter();

  return (
    <ProtectedRoute>
      <Grid
        templateColumns="repeat(4, 1fr)"
        templateRows={"max-content 1fr"}
        gap={2}
        minHeight={"100vh"}
        maxHeight={"max-content"}
      >
        <GridItem colSpan={4}>
          <Flex
            padding={3}
            alignItems={"center"}
            bgColor={"brand.primary"}
            shadow={"md"}
          >
            <Link
              href={"/"}
              style={{
                cursor: "pointer",
              }}
            >
              <Image
                src="/logo.png"
                alt="Logo"
                style={{
                  objectFit: "contain",
                }}
                height={180}
                width={180}
              />
            </Link>

            <Spacer />
            <Box>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="outline"
                  border={"none"}
                  padding={0}
                  fontSize={"2xl"}
                  _hover={{ bg: "transparent", transform: "scale(1.1)" }}
                  _expanded={{ bg: "transparent", transform: "scale(1.1)" }}
                />
                <MenuList>
                  <MenuItem>Hi {name}!</MenuItem>
                  <MenuItem onClick={() => router.push("/admin/create")}>
                    Create
                  </MenuItem>
                  <MenuItem onClick={() => router.push("/admin")}>
                    History
                  </MenuItem>
                  <MenuItem onClick={() => router.push("/admin/unpaid")}>
                    Report
                  </MenuItem>
                  <MenuItem onClick={() => router.push("/admin/services")}>
                    Services
                  </MenuItem>
                  <MenuItem onClick={() => router.push("/admin/prices")}>
                    Prices
                  </MenuItem>
                  <MenuItem onClick={() => router.push("/admin/images")}>
                    Images
                  </MenuItem>
                  <MenuItem onClick={() => router.push("/admin/about")}>
                    About
                  </MenuItem>
                  <MenuItem onClick={signOut}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Flex>
        </GridItem>

        <GridItem colSpan={4} padding={5}>
          {children}
        </GridItem>
      </Grid>
    </ProtectedRoute>
  );
}
