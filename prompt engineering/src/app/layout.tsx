import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { MouseTracker } from "@/components/ui/mouse-tracker"
import { cn } from "@/lib/utils"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Prompt Engineering Platform",
  description: "High-performance, aesthetically Cyberpunk/Neon Prompt Engineering Platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn(inter.variable, jetbrainsMono.variable)}>
      <body className="antialiased min-h-screen bg-void text-foreground selection:bg-neon-cyan/20 selection:text-neon-cyan">
        <Providers>
          <MouseTracker />

          {/* Ambient Background Layer */}
          <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f1729_1px,transparent_1px),linear-gradient(to_bottom,#0f1729_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

            {/* Reactive Glow Cursor Follower */}
            <div
              className="absolute inset-0 transition-opacity duration-300 opacity-100"
              style={{
                background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 255, 0.05), transparent 40%)`
              }}
            />
          </div>

          <main className="relative z-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
