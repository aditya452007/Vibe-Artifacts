import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LenisProvider } from "@/components/lenis-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MetaClear | Secure Image Metadata Remover",
  description: "Protect your privacy by stripping hidden metadata (EXIF, GPS, device info) from your photos instantly. Client-side processing ensures your data never leaves your device.",
  keywords: ["metadata remover", "exif cleaner", "privacy tool", "image security", "gps remover"],
  authors: [{ name: "MetaClear Team" }],
  openGraph: {
    title: "MetaClear | Secure Image Metadata Remover",
    description: "Protect your privacy by stripping hidden metadata from your photos instantly.",
    type: "website",
    locale: "en_US",
    siteName: "MetaClear",
  },
  twitter: {
    card: "summary_large_image",
    title: "MetaClear | Secure Image Metadata Remover",
    description: "Protect your privacy by stripping hidden metadata from your photos instantly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LenisProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
