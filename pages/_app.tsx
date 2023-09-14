import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { theme } from "../lib/utils/theme";
import "@/styles/globals.css";
// import { FirebaseProvider } from "@/contexts/FirebaseContext";
import "animate.css";
import { SupabaseProvider } from "@/contexts/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>{pageProps?.title || "VRW Alteration"}</title>
        <meta name="description" content="VRW" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <SupabaseProvider>
        <Component {...pageProps} />
      </SupabaseProvider>
    </ChakraProvider>
  );
}
