import React from 'react';
import { motion, Variants } from 'motion/react';
import { ContributionStats } from '@/types/github';
import { MotionNumber } from '../ui/MotionNumber';
import { GitCommit, GitPullRequest, CircleDot, Eye } from 'lucide-react';

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    show: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            bounce: 0.2,
            duration: 0.6
        }
    }
};

// "Apple-Style" Compact Glass Card
const StatCard = ({ title, value, icon: Icon, gradient, delay }: { title: string, value: number, icon: any, gradient: string, delay: number }) => {
    const isZero = value === 0;

    return (
        <motion.div
            variants={item}
            whileHover={!isZero ? { y: -4, scale: 1.02 } : {}}
            className={`relative group overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-300 ${isZero ? 'opacity-60 grayscale' : ''}`}
        >
            {/* Glass Layer */}
            <div className="absolute inset-0 glass-card shadow-lg dark:shadow-[0_4px_20px_0_rgba(0,0,0,0.3)] rounded-2xl" />

            {/* Subtle Gradient Tint - Only if active */}
            {!isZero && <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${gradient}`} />}

            {/* Specular Highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />

            <div className="relative z-10 flex flex-col h-full justify-between gap-3">
                <div className="flex justify-between items-start">
                    {/* Icon Container with Gradient */}
                    <div className={`p-2.5 rounded-xl shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-transform duration-300 ${isZero ? 'bg-gray-200 dark:bg-gray-800 text-gray-400' : `bg-gradient-to-br ${gradient} text-white group-hover:scale-105`}`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className={`text-3xl sm:text-4xl font-bold tracking-tight drop-shadow-sm ${isZero ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                        <MotionNumber value={value} />
                    </span>
                    <span className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mt-1">
                        {title}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export const ContributionsSlide = ({ stats }: { stats: ContributionStats }) => {
    const totalImpact = stats.totalCommits + stats.totalPRs + stats.totalIssues + stats.totalReviews;

    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center bg-[#f5f5f7] dark:bg-[#000000] text-gray-900 dark:text-white p-4 relative overflow-hidden transition-colors duration-700"
            initial="hidden"
            animate="show"
            variants={container}
        >
            {/* Ambient Aurora Background - More Vibrant */}
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/20 dark:bg-indigo-600/15 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none animate-pulse-glow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-400/20 dark:bg-orange-600/15 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none animate-pulse-glow" style={{ animationDelay: '1s' }} />

            {/* Scale Container */}
            <div className="w-full max-w-3xl flex flex-col gap-8 sm:gap-10 relative z-10">

                {/* Hero Section - Compact */}
                <motion.div variants={item} className="text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-[#1c1c1e]/60 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-sm mb-5 transition-transform hover:scale-105 cursor-default">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        </span>
                        <span className="text-[11px] font-bold tracking-widest uppercase text-gray-600 dark:text-gray-300">Lifetime Impact</span>
                    </div>

                    <h2 className="text-6xl sm:text-8xl font-black tracking-tighter text-gray-900 dark:text-white drop-shadow-sm">
                        <MotionNumber value={totalImpact} />
                    </h2>
                    <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mt-2 tracking-wide">
                        Total Contributions
                    </p>
                </motion.div>

                {/* The Compact Grid */}
                <div className="relative z-10 grid grid-cols-2 gap-4 sm:gap-5 w-full px-4 sm:px-0">
                    <StatCard
                        title="Commits"
                        value={stats.totalCommits}
                        icon={GitCommit}
                        gradient="from-orange-400 to-amber-500" // Warm Energy
                        delay={0}
                    />
                    <StatCard
                        title="Pull Requests"
                        value={stats.totalPRs}
                        icon={GitPullRequest}
                        gradient="from-indigo-400 to-violet-500" // Structural/Core
                        delay={0.1}
                    />
                    <StatCard
                        title="Issues"
                        value={stats.totalIssues}
                        icon={CircleDot}
                        gradient="from-cyan-400 to-blue-500" // Communication
                        delay={0.2}
                    />
                    <StatCard
                        title="Reviews"
                        value={stats.totalReviews}
                        icon={Eye}
                        gradient="from-pink-400 to-rose-500" // Human Touch
                        delay={0.3}
                    />
                </div>

            </div>
        </motion.div>
    );
};
