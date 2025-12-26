'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useRouter } from 'next/navigation'
import { Home } from 'lucide-react'

// Pass `showHomeButton` prop for Workstation usage
export function ScrollHeader({
    showHomeButton = false
}: {
    showHomeButton?: boolean
}) {
    const { scrollY } = useScroll()
    const router = useRouter()
    const [hasScrolled, setHasScrolled] = useState(false)

    // Use MotionValues for smooth transform
    // At scrollY=0: Opacity 0, Y -100
    // Header should appear ONLY after passing the Hero section (approx 800px)
    // "Comes little faster" -> Short transition range
    const headerY = useTransform(scrollY, [750, 850], [-50, 0])
    const headerOpacity = useTransform(scrollY, [750, 850], [0, 1])

    // Track scroll state for React condition rendering if needed, though useTransform is better for performance
    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            setHasScrolled(latest > 750)
        })
        return () => unsubscribe()
    }, [scrollY])

    return (
        <>
            <motion.header
                style={{ y: headerY, opacity: headerOpacity }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="fixed top-8 left-1/2 -translate-x-1/2 z-50 origin-top"
            >
                {/* 
                  Apple-level Glass 2.0: 
                  - Ultra-High Blur (backdrop-blur-3xl)
                  - Translucent dark surface (bg-black/40)
                  - Specular border (border-white/10)
                  - Ambient shadow glow
                */}
                <div className="bg-black/40 backdrop-blur-3xl rounded-full pl-6 pr-6 py-3 flex items-center gap-8 shadow-[0_0_40px_rgba(0,0,0,0.2)] border border-white/5 hover:border-white/20 transition-all duration-500 hover:bg-black/50 hover:shadow-[0_0_60px_rgba(34,213,94,0.05)]">

                    {showHomeButton && (
                        <button onClick={() => router.push('/')} className="text-zinc-500 hover:text-white transition-colors duration-300">
                            <Home className="w-4 h-4" />
                        </button>
                    )}

                    <div className="flex items-center gap-3 select-none">
                        <div className="relative flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse z-10" />
                            <div className="absolute w-3 h-3 bg-green-500/20 rounded-full blur-[1px]" />
                        </div>
                        <span className="font-geist-sans font-medium text-xs tracking-[0.2em] text-zinc-300">
                            PROMPT OPS
                        </span>
                    </div>

                    <div className="h-3 w-[1px] bg-white/5" />

                    <div className="scale-90">
                        <ThemeToggle />
                    </div>
                </div>
            </motion.header>

            {/* Fallback for pages that always need a header (like Workstation) */}
            {showHomeButton && !hasScrolled && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40">
                    <div className="bg-void-surface/70 glass-heavy rounded-full px-6 py-3 flex items-center gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <button onClick={() => router.push('/')} className="text-gray-400 hover:text-neon-cyan transition-colors">
                            <Home className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2 font-mono text-sm tracking-widest text-white">
                            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
                            <span>WORKSTATION</span>
                        </div>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <ThemeToggle />
                    </div>
                </div>
            )}
        </>
    )
}
