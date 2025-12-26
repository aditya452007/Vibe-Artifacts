import React from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '@/types/github';
import { MotionNumber } from '../ui/MotionNumber';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export const IdentitySlide = ({ profile }: { profile: UserProfile }) => {
    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[var(--void-bg)] to-black/90 dark:from-slate-900 dark:to-black text-[var(--foreground)] p-8 relative overflow-hidden transition-colors duration-500"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* Background Texture */}
            <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

            {/* Ambient Glow - Adaptive */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-slate-200/40 dark:bg-slate-800/20 blur-[100px] rounded-full pointer-events-none transition-colors duration-500" />

            <motion.div variants={item} className="relative z-10 border-4 border-gray-200 dark:border-slate-700/50 rounded-full p-2 mb-8 shadow-2xl backdrop-blur-sm transition-colors duration-500">
                <img
                    src={profile.avatarUrl}
                    alt={profile.username}
                    className="w-48 h-48 rounded-full"
                />
            </motion.div>

            <motion.h1 variants={item} className="relative z-10 text-6xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-600 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-500">
                {profile.username}
            </motion.h1>

            <motion.p variants={item} className="relative z-10 text-xl text-gray-700 dark:text-gray-200 max-w-2xl text-center mb-8 font-normal drop-shadow-md transition-colors duration-500">
                {profile.bio || "No bio data detected."}
            </motion.p>

            <motion.div variants={item} className="relative z-10 grid grid-cols-2 gap-8 text-center">
                <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-colors duration-500">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"><MotionNumber value={profile.followers} /></div>
                    <div className="text-xs text-cyan-500 dark:text-cyan-400 tracking-[0.2em] font-bold font-mono mt-1 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">FOLLOWERS</div>
                </div>
                <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-purple-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-colors duration-500">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"><MotionNumber value={profile.following} /></div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 tracking-[0.2em] font-bold font-mono mt-1 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]">FOLLOWING</div>
                </div>
            </motion.div>
        </motion.div>
    );
};
