import { Logo } from "@/components";
import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "@/contexts/AuthContext";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import GoogleButton from "react-google-button";

export default function Admin() {
  const { signOut } = useAuth();
  console.log("admin page");
  return (
    <ProtectedRoute>
      <Grid templateColumns="repeat(4, 1fr)">
        <GridItem colSpan={4}>
          <Logo showMenu={false} />
        </GridItem>
      </Grid>
      <Box padding={5}>
        <GoogleButton onClick={signOut} label="Logout" />
      </Box>
    </ProtectedRoute>
  );
}
