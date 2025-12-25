'use client';

import { motion } from 'motion/react';
import { generateStoryAction } from '@/lib/actions';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px var(--neon-rust)" }}
            whileTap={{ scale: 0.98 }}
            disabled={pending}
            className="w-full bg-black text-white dark:bg-[#ededed] dark:text-black font-bold text-lg py-4 rounded-lg uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed z-20 relative"
            suppressHydrationWarning
        >
            {pending ? "INITIALIZING..." : "GENERATE STORY"}
        </motion.button>
    );
}

export default function VisualizerInput() {
    return (
        <motion.div
            layoutId="visualizer-container"
            className="w-full relative group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
        >
            <form action={generateStoryAction as any} className="flex flex-col gap-8">
                {/* Input Container */}
                <div className="relative overflow-hidden rounded-xl p-[2px]">

                    {/* The Electric Qi Pulse (Rotating Gradient) */}
                    <motion.div
                        className="absolute -inset-[100%]"
                        style={{
                            background: "conic-gradient(from 90deg, transparent 0%, var(--cyber-blue) 50%, transparent 100%)"
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner Void Mask - Adaptive Background */}
                    <div className="relative bg-[var(--void-bg)] border border-white/10 dark:border-transparent rounded-lg z-10 p-1">
                        <input
                            name="username"
                            type="text"
                            placeholder="github_username"
                            required
                            className="w-full bg-transparent text-[var(--foreground)] px-8 py-5 text-xl font-mono focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-700 text-center tracking-widest z-20 relative transition-colors duration-300"
                            autoComplete="off"
                            suppressHydrationWarning
                        // LOGIC FIX: No uppercase transform, raw input allowed (GitHub is mixed case safe usually, but UI should reflect user input)
                        />
                    </div>
                </div>

                <SubmitButton />
            </form>
        </motion.div>
    );
}


