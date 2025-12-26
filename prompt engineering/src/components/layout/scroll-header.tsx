'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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

    // Smooth appearance logic
    const headerY = useTransform(scrollY, [600, 700], [-20, 0])
    const headerOpacity = useTransform(scrollY, [600, 700], [0, 1])

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            setHasScrolled(latest > 600)
        })
        return () => unsubscribe()
    }, [scrollY])

    return (
        <>
            <motion.header
                style={{ y: headerY, opacity: headerOpacity }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-50 origin-top pointer-events-none" // Pointer events none wrapper to avoid blocking clicks around
            >
                {/* 
                  Apple-level Dynamic Island / Pill:
                  - High blur (backdrop-blur-xl)
                  - Subtle border
                  - Smooth shadow
                */}
                <div className="pointer-events-auto bg-surface/70 backdrop-blur-xl rounded-full pl-5 pr-5 py-2.5 flex items-center gap-6 shadow-lg shadow-black/5 border border-border/50 transition-all hover:bg-surface/90">

                    {showHomeButton && (
                        <button onClick={() => router.push('/')} className="text-canvas-subtext hover:text-foreground transition-colors">
                            <Home className="w-4 h-4" />
                        </button>
                    )}

                    <div className="flex items-center gap-2 select-none">
                        <div className="relative flex items-center justify-center">
                            <span className="w-2 h-2 bg-system-blue rounded-full" />
                        </div>
                        <span className="font-sans font-medium text-xs tracking-wide text-foreground">
                            Prompt Ops
                        </span>
                    </div>

                    <div className="h-4 w-[1px] bg-border" />

                    <div className="scale-90">
                        <ThemeToggle />
                    </div>
                </div>
            </motion.header>

            {/* Permanent Header for Workstation */}
            {showHomeButton && !hasScrolled && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40">
                    <div className="bg-surface/80 backdrop-blur-xl rounded-full px-5 py-2.5 flex items-center gap-4 shadow-sm border border-border/50">
                        <button onClick={() => router.push('/')} className="text-canvas-subtext hover:text-foreground transition-colors">
                            <Home className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-medium text-foreground tracking-wide">Workstation</span>
                        <div className="h-4 w-[1px] bg-border" />
                        <ThemeToggle />
                    </div>
                </div>
            )}
        </>
    )
}
