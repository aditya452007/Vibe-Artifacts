'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { ScrollHeader } from '@/components/layout/scroll-header'
import { ChatFAB } from '@/components/chat/chat-fab'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <ScrollHeader />
      <ChatFAB />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-32 overflow-hidden bg-gradient-to-b from-background via-background to-surface/50">

        {/* Apple-style Gradient Blur - Subtle & Ambient */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10 opacity-60" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Apple standard curve
          className="flex flex-col items-center max-w-4xl mx-auto space-y-8"
        >
          {/* Status Badge - Refined Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/50 border border-border/50 backdrop-blur-md shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-system-blue opacity-75 duration-1000"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-system-blue"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wide uppercase text-canvas-subtext">Platform v2.0 Ready</span>
          </motion.div>

          {/* Main Title - Minimalist & Bold */}
          <div className="flex flex-col items-center text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.05] text-balance text-foreground">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Prompt
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Engineering.
            </span>
          </div>

          <p className="max-w-2xl text-xl md:text-2xl text-canvas-subtext leading-relaxed font-normal tracking-wide text-balance">
            Design intelligent reasoning structures. <br className="hidden md:block" />
            Deploy cognitive architectures with precision.
          </p>

          {/* CTA - Apple Style Button */}
          <Link href="/docs" passHref className="pt-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-medium text-lg tracking-tight shadow-lg shadow-foreground/5 hover:shadow-xl transition-all"
            >
              <span>Explore Documentation</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Feature Grid - Clean Cards */}
      <section className="px-6 py-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
            { title: "Cognitive Models", desc: "Advanced reasoning patterns including Chain of Thought and Tree of Thoughts." },
            { title: "Unified Workstation", desc: "A singular environment for drafting, testing, and refining prompts." },
            { title: "Semantic Archive", desc: "Version-controlled knowledge base for your engineering assets." }
         ].map((item, i) => (
             <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="p-8 rounded-3xl bg-surface/30 border border-border/50 backdrop-blur-sm hover:bg-surface/50 transition-colors"
             >
                <h3 className="text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
                <p className="text-canvas-subtext leading-relaxed">{item.desc}</p>
             </motion.div>
         ))}
      </section>

    </div>
  )
}
