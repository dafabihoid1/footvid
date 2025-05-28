// app/layout.js  — Server Component
import "./globals.css";
import { Providers } from "./Providers";

export const metadata = {
  title: "Footvid",
  description: "…",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
