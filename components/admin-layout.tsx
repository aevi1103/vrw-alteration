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
        backgroundColor={"gray.50"}
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
            <Image
              src="/logo.png"
              alt="Logo"
              style={{
                objectFit: "contain",
              }}
              height={180}
              width={180}
            />
            <Spacer />
            <Box>
              <Menu>
                <MenuButton
                  px={4}
                  py={2}
                  transition="all 0.2s"
                  borderRadius="md"
                  // _hover={{ bg: "brand.secondary", color: "white" }}
                  // _expanded={{ bg: "brand.secondary", color: "white" }}
                >
                  Hi {name}!
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={signOut}>Logout</MenuItem>
                  <MenuItem onClick={() => router.push("/")}>Home</MenuItem>
                </MenuList>
              </Menu>
            </Box>
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
                  <MenuItem onClick={() => router.push("/admin/create")}>
                    Create
                  </MenuItem>
                  <MenuItem onClick={() => router.push("/admin")}>
                    History
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
                </MenuList>
              </Menu>
            </Box>
          </Flex>
        </GridItem>

        <GridItem colSpan={4} padding={3}>
          {children}
        </GridItem>
      </Grid>
    </ProtectedRoute>
  );
}
