/** @format */

import type React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";

import "./globals.css";
import SessionProviderWrapper from "@/components/session-provider";
import { LanguageProvider } from "@/contexts/language-context";
import QueryProvider from "@/components/query-provider";
import { ConfirmDialogProvider } from "@/components/shared/confirm-dialog-provider";
import FcmInitializer from "@/components/fcm-initializer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Multi-Tenant Dashboard",
  description: "Dashboard untuk Vendor, Koperasi, UMKM, dan BUMDes",
  generator: "Next.js Dashboard",
};

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={geist.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body>
        <SessionProviderWrapper>
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <LanguageProvider>
                <ConfirmDialogProvider>
                  <FcmInitializer />
                  <Toaster position="top-right" richColors closeButton />
                  {children}
                </ConfirmDialogProvider>
              </LanguageProvider>
            </ThemeProvider>
          </QueryProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
