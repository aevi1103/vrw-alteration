import { Box, Button } from "@chakra-ui/react";
import React from "react";
import supabase from "@/lib/supabase-client";
import { useSupabase } from "@/contexts/AuthContext";

export default function Login() {
  const { user } = useSupabase();

  console.log("user", user);

  const onSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  return (
    <Box margin={5}>
      {user?.data?.user ? (
        <Button onClick={() => supabase.auth.signOut()}>Logout</Button>
      ) : (
        <Button onClick={onSignIn}>Login with Google</Button>
      )}
    </Box>
  );
}
