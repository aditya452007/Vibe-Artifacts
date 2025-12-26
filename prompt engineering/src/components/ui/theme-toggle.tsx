'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')

    useEffect(() => {
        // Check system preference or local storage on mount
        const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
        if (saved) {
            setTheme(saved)
            document.documentElement.setAttribute('data-theme', saved)
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
        localStorage.setItem('theme', newTheme)
    }

    return (
        <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "relative p-3 rounded-full overflow-hidden transition-all duration-500",
                theme === 'dark' ? "bg-white/5 text-yellow-300" : "bg-black/5 text-indigo-600"
            )}
        >
            <div className="relative z-10">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
            <motion.div
                className="absolute inset-0 bg-current opacity-10"
                layoutId="theme-pill"
            />
        </motion.button>
    )
}
