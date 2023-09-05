import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-pattern" id="container">
        {/* <ColorModeScript initialColorMode={theme.config.initialColorMode} /> */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
