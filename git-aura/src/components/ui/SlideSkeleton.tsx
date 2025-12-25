'use client';

import { motion } from 'framer-motion';

export const SlideSkeleton = () => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-[var(--void-bg)] p-8">
            <div className="relative w-full max-w-6xl h-[80vh] grid grid-cols-12 gap-6">

                {/* Glass Card 1 (Main Profile Area) */}
                <div className="col-span-12 lg:col-span-4 h-full">
                    <motion.div
                        className="w-full h-full rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                {/* Glass Card 2 (Stats Area) */}
                <div className="col-span-12 lg:col-span-8 h-full flex flex-col gap-6">
                    <motion.div
                        className="w-full h-64 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="w-full flex-1 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </div>

            {/* Loading Text */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-cyan-500/50 font-mono text-sm tracking-[0.3em] uppercase">
                Establishing Neural Uplink...
            </div>
        </div>
    );
};
