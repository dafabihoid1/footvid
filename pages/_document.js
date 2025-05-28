import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/public/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* <link rel="apple-touch-icon" href="/icons/icon-192.png" /> */}
        <meta name="theme-color" content="#003d11" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
