import { Grid } from "@chakra-ui/layout";
import React, { ReactNode } from "react";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Grid
      templateColumns="repeat(4, 1fr)"
      className="bg-pattern"
      id="container"
      minHeight={"100vh"}
      maxHeight={"max-content"}
    >
      {children}
    </Grid>
  );
};
