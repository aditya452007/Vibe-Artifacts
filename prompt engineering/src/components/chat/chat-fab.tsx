'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquarePlus } from 'lucide-react'
import { ModelSetupModal } from './model-setup-modal'

export function ChatFAB() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-foreground text-background rounded-full shadow-lg shadow-black/10 flex items-center justify-center transition-all hover:shadow-xl"
            >
                <MessageSquarePlus className="w-6 h-6" />
            </motion.button>

            <ModelSetupModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}
