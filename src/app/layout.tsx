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
        <div className="bg-pattern" id="container">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
