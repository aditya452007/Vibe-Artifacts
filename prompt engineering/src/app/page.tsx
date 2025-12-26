'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowDown, Command } from 'lucide-react'
import { ScrollHeader } from '@/components/layout/scroll-header'
import { ChatFAB } from '@/components/chat/chat-fab'
import { BackgroundGrid } from '@/components/ui/background-grid'
import { useRouter } from 'next/navigation'

// Matrix-style Decoding Text Component
function DecodedText({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) {
  const [display, setDisplay] = useState('')
  const [isDecoded, setIsDecoded] = useState(false)
  const CHARS = 'ABCDEF0123456789$#@%'

  useEffect(() => {
    let iteration = 0
    let interval: NodeJS.Timeout

    const startDecoding = () => {
      interval = setInterval(() => {
        setDisplay(prev =>
          text.split('').map((char, index) => {
            if (index < iteration) return text[index]
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          }).join('')
        )

        if (iteration >= text.length) {
          setIsDecoded(true)
          clearInterval(interval)
        }

        iteration += 1 / 3 // Slow down the reveal
      }, 30)
    }

    const timeout = setTimeout(startDecoding, delay)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [text, delay])

  return (
    <span className={className}>
      {display}
    </span>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen text-foreground font-sans selection:bg-neon-cyan/30">
      <BackgroundGrid />
      <ScrollHeader />
      <ChatFAB />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-20 overflow-hidden">

        {/* Ambient Top Glow - God Ray Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-white/5 blur-[100px] rounded-full pointer-events-none -z-10 mix-blend-screen opacity-50" />

        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} // Apple-style spring/ease
          className="flex flex-col items-center max-w-5xl mx-auto space-y-10"
        >
          {/* Status Badge - Glass Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] group cursor-default transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_50px_rgba(0,255,128,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
            </span>
            <span className="text-xs font-mono text-zinc-300 tracking-[0.2em] font-medium group-hover:text-white transition-colors">SYSTEM OPERATIONAL</span>
          </div>

          {/* Main Title - Equal Footing & Cinematic */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter font-geist-sans leading-[0.9] overflow-hidden">

            <span className="text-transparent bg-clip-text bg-gradient-to-b from-neon-cyan to-blue-500 drop-shadow-2xl relative z-10">
              <DecodedText text="PROMPT" delay={200} />
            </span>

            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-blue-500 to-purple-500 blur-sm absolute inset-0 select-none opacity-50 saturate-150">
                <DecodedText text="ENGINEERING" delay={800} />
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-blue-500 to-purple-500 relative z-10 brightness-125">
                <DecodedText text="ENGINEERING" delay={800} />
              </span>
            </span>
          </div>

          <p className="max-w-xl text-lg md:text-xl text-zinc-400 leading-relaxed font-light tracking-wide text-balance">
            Design intelligent reasoning structures. <br className="hidden md:block" />
            Compile and deploy cognitive architectures in a unified workstation.
          </p>

          {/* CTA - Holo Button */}
          <Link href="/docs" passHref className="pt-4 inline-block relative z-[100]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative group px-12 py-6 bg-white/5 border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:border-white/40 hover:shadow-[0_0_80px_rgba(0,255,255,0.2)] active:scale-95 backdrop-blur-xl cursor-pointer">
                {/* Decorative Gradient - Pointer Events None to prevent hover flickering */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                <div className="relative flex items-center gap-3 text-white font-mono text-base tracking-widest uppercase font-semibold pointer-events-none">
                  <Command className="w-5 h-5 text-neon-cyan group-hover:rotate-12 transition-transform duration-300" />
                  <span className="group-hover:text-neon-cyan transition-colors duration-300">ENTER ARCHIVE</span>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Bottom Status - Enhanced */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 font-mono text-[10px]"
        >
          <span className="tracking-[0.3em] uppercase">System Ready</span>
          <div className="flex gap-1">
            <span className="w-1 h-1 bg-neon-cyan rounded-full animate-pulse" />
            <span className="w-1 h-1 bg-neon-cyan/50 rounded-full animate-pulse delay-75" />
            <span className="w-1 h-1 bg-neon-cyan/20 rounded-full animate-pulse delay-150" />
          </div>
        </motion.div>
      </section>

    </div>
  )
}
