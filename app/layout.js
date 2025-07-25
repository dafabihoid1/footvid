import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallPrompt from "@/components/InstallPrompt";
import { SupabaseProvider } from "@/components/SupabaseProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// export const metadata = {
//     title: "Sv Leiben ",
//     description: "Generated by create next app",
//     manifest: "/manifest.json",
// };

export default function RootLayout({ children }) {
    return (
        <html lang="de" className="dark">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#003d11" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="mobile-web-app-capable" content="yes"></meta>
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <link rel="apple-touch-icon" href="/icons/icon-192.png" />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <SupabaseProvider>
                    <ServiceWorkerRegister />
                    {children}
                    <InstallPrompt />
                </SupabaseProvider>
            </body>
        </html>
    );
}
