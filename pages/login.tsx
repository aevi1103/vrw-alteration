import { Center, GridItem } from "@chakra-ui/react";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import GoogleButton from "react-google-button";
import { Layout, Logo } from "@/components";

export default function Login() {
  const { user, signIn, signOut } = useAuth();

  return (
    <Layout>
      <GridItem colSpan={4}>
        <Logo showMenu={false} />
      </GridItem>
      <GridItem colSpan={4}>
        <Center>
          {user ? (
            <GoogleButton onClick={signOut} label="Logout" />
          ) : (
            <GoogleButton onClick={signIn} />
          )}
        </Center>
      </GridItem>
    </Layout>
  );
}
