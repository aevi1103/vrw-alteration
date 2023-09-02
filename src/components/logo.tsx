import { Box } from "@chakra-ui/react";
import React from "react";
import Image from "next/image";

export const Logo = () => {
  return (
    <Box
      height={200}
      position={"relative"}
      className="animate__animated animate__fadeInDown"
      marginTop={10}
      marginBottom={10}
    >
      <Image src="/logo.png" alt="Logo" layout="fill" objectFit="contain" />
    </Box>
  );
};
