import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { theme } from "../lib/utils/theme";
import "@/styles/globals.css";
import { FirebaseProvider } from "@/contexts/FirebaseContext";

export default function App({ Component, pageProps }: AppProps) {
  console.log({ pageProps });
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>{pageProps?.title || "VRW Alteration"}</title>
        <meta name="description" content="VRW" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/logo-sm.png" /> */}
      </Head>
      <FirebaseProvider>
        <Component {...pageProps} />
      </FirebaseProvider>
    </ChakraProvider>
  );
}

// export async function getServerSideProps() {
//   const firebaseConfig = {
//     apiKey: process.env.FIREBASE_API_KEY,
//     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   };

//   return {
//     props: {
//       firebaseConfig,
//     },
//   };
// }
