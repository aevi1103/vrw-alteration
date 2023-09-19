import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `'Roboto', sans-serif`,
    body: `'Roboto', sans-serif`,
  },
  colors: {
    brand: {
      100: "#426b7b",
      200: "#ffcb18",
      300: "#627b6b",
      400: "#818b5a",
      500: "#a19b4a",
      primary: "#ffcb18",
      secondary: "#426b7b",
      accent1: "#627b6b",
      accent2: "#818b5a",
      accent3: "#a19b4a",
    },
  },
  components: {
    Button: {
      variants: {
        brand: {
          bg: "#426b7b",
          color: "white",
          transition: "all 0.2s",
          _hover: {
            // transform: "scale(1.1)",
            bg: `rgba(66, 107, 123, .8)`,
          },
        },
      },
    },
  },
});

export { theme };
