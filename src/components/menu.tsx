"use client";
import {
  Menu,
  Flex,
  Spacer,
  Box,
  Text,
  IconButton,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import Link from "next/link";
import { useAuth } from "@/utils/useAuth";
import { HamburgerIcon, AddIcon } from "@chakra-ui/icons";
import { AiOutlineUser } from "react-icons/ai";

export function AppMenu() {
  const { user, signIn, auth } = useAuth();

  console.log("user", user);

  return (
    <Flex>
      <Box p="2" fontWeight={"bold"} fontSize={"2xl"}>
        {/* <Link href="/">VRW Alteration</Link> */}
      </Box>
      <Spacer />

      {user !== undefined && (
        <Box p="2">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="ghost"
              fontSize={"2xl"}
            />
            <MenuList>
              {user && <MenuItem disabled>{user.displayName}</MenuItem>}
              <MenuItem
                icon={
                  <Text fontSize={"xl"}>
                    <AiOutlineUser />
                  </Text>
                }
                onClick={() => {
                  if (user) {
                    auth.signOut();
                    return;
                  }

                  signIn();
                }}
              >
                <span>{user ? "Logout" : "Login"}</span>
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      )}
    </Flex>
  );
}
