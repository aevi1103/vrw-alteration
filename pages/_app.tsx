import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { theme } from "../lib/utils/theme";
import { useFirebase } from "../lib/utils/useFirebase";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const { app, analytics } = useFirebase();
  console.log("app", {
    app,
    analytics,
  });
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>{pageProps?.title || "VRW Alteration"}</title>
        <meta name="description" content="VRW" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/logo-sm.png" /> */}
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
