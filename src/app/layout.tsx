import "./globals.css";
import { Providers } from "./providers";
import "animate.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="bg-container">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
