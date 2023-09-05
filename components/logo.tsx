import { Box } from "@chakra-ui/react";
import React from "react";
import Image from "next/image";

export const Logo = ({ height = 20 }: { height?: number }) => {
  return (
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
        style={{
          objectFit: "contain",
        }}
      />
    </Box>
  );
};
