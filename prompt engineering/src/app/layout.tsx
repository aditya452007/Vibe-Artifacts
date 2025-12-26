import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"], // Optimize for Apple cleanliness
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Prompt Engineering Platform",
  description: "A professional workstation for cognitive architectures.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn(inter.variable, jetbrainsMono.variable)} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground selection:bg-system-blue/20 selection:text-system-blue">
        <Providers>
          <main className="relative z-10 w-full">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
