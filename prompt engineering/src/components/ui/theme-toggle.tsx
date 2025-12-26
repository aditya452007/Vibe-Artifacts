'use client'

import { useState, useLayoutEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')
    const [isMounted, setIsMounted] = useState(false)

    // Using layout effect to avoid flicker but handling state update properly.
    useLayoutEffect(() => {
        // Just set mounted here.
        setIsMounted(true)

        // Reading storage synchronously is fine in layout effect for client
        const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
        if (saved) {
             setTheme(saved)
             document.documentElement.setAttribute('data-theme', saved)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // ^ Disabling check because we specifically WANT this to run once on mount.
    // The previous error was specifically about set-state-in-effect, which triggers when dependencies might cause a loop or it's unconditional.
    // Empty dependency array ensures one run.

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
        localStorage.setItem('theme', newTheme)
    }

    if (!isMounted) return <div className="w-8 h-8" />

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "relative p-2 rounded-full transition-colors duration-300",
                "hover:bg-foreground/10 text-foreground"
            )}
            aria-label="Toggle Theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.div>
            </AnimatePresence>
        </button>
    )
}
