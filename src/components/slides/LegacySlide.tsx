import React from 'react';
import { motion } from 'framer-motion';
import { GitHubData } from '@/types/github';
import { MotionNumber } from '../ui/MotionNumber';

export const LegacySlide = ({ data }: { data: GitHubData }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--void-bg)] dark:bg-black text-[var(--foreground)] dark:text-white p-8 relative overflow-hidden transition-colors duration-500">
            {/* Prestige Gold Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.15),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />

            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative z-10 text-4xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-600 to-amber-700 dark:from-yellow-200 dark:via-yellow-400 dark:to-amber-500 tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
            >
                Legacy Acquired
            </motion.h2>

            <div className="relative z-10 flex flex-col gap-6 w-full max-w-2xl">
                {data.languages.map((lang, index) => (
                    <div key={lang.name} className="flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                            <span className="font-mono font-bold text-lg text-yellow-700 dark:text-yellow-50">{lang.name}</span>
                            <span className="font-mono text-yellow-600 dark:text-yellow-400 font-bold">{lang.percentage}%</span>
                        </div>
                        <div className="w-full h-1 bg-yellow-200/40 dark:bg-yellow-950/40 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-yellow-400 to-amber-600 dark:from-yellow-300 dark:to-amber-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${lang.percentage}%` }}
                                transition={{ delay: 0.5 + (index * 0.1), duration: 1, ease: "circOut" }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, border: "1px solid rgba(161, 98, 7, 0)" }}
                animate={{ opacity: 1, scale: 1, border: "1px solid rgba(161, 98, 7, 0.3)" }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="relative z-10 mt-20 p-10 bg-gradient-to-b from-yellow-50/50 to-white/50 dark:from-[#140d00] dark:to-black backdrop-blur-md rounded-sm shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-colors duration-500"
            >
                <div className="text-center font-mono text-yellow-700 dark:text-yellow-600 font-bold text-xs mb-2 tracking-[0.2em]">TEMPORAL EXISTENCE TO DATE</div>
                <div className="text-center text-5xl font-black text-yellow-600 dark:text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                    <MotionNumber value={new Date().getFullYear() - new Date(data.profile.createdAt).getFullYear()} />.0 YEARS
                </div>
            </motion.div>
        </div>
    );
};
