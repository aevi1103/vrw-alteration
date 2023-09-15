import { Box, Flex, Spacer, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import Image from "next/image";
import { HamburgerIcon } from "@chakra-ui/icons";
import { AppMenu } from "./menu";
import { useScrollY } from "@/hooks/useScrollY";
import { useMenuHeaderStore } from "@/store/useMenuHeaderStore";

export const Logo = ({
  height = 20,
  showMenu = true,
}: {
  height?: number;
  showMenu?: boolean;
}) => {
  const { scrollY } = useScrollY();
  const [isLarge] = useMediaQuery("(min-width: 768px)");
  const { toggleMenu } = useMenuHeaderStore();

  if (scrollY > 0) {
    return (
      <Flex padding={2} alignItems={"center"}>
        <Image
          src="/logo.png"
          alt="Logo"
          style={{
            objectFit: "contain",
          }}
          height={200}
          width={200}
        />
        {showMenu && (
          <>
            <Spacer />
            <HamburgerIcon
              width={8}
              height={8}
              onClick={toggleMenu}
              cursor={"pointer"}
            />
          </>
        )}
      </Flex>
    );
  }

  return (
    <>
      <Box
        height={height}
        position={"relative"}
        className="animate__animated animate__fadeInDown"
        marginTop={10}
        marginBottom={10}
      >
        <Image
          src="/logo.png"
          alt="Logo"
          fill
          priority
          style={{
            objectFit: "contain",
          }}
        />
      </Box>
      {isLarge && showMenu && <AppMenu />}
    </>
  );
};
