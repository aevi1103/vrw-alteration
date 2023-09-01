import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `'Roboto', sans-serif`,
    body: `'Roboto', sans-serif`,
  },
  colors: {
    brand: {
      primary: "#ffcb18",
      secondary: "#426b7b",
      accent1: "#627b6b",
      accent2: "#818b5a",
      accent3: "#a19b4a",
    },
  },
});

export { theme };
