// app/providers.tsx
"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { useFirebase } from "@/utils/useFirebase";
import { theme } from "@/utils/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  const { app, analytics } = useFirebase();

  console.log("app", {
    app,
    analytics,
  });

  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
