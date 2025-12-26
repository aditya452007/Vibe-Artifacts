import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { GitHubData } from '@/types/github';

// Helper to calculate polygon points
const getPoint = (value: number, index: number, total: number, radius: number, center: { x: number, y: number }) => {
    const angle = (Math.PI * 2 * index) / total - (Math.PI / 2); // Start at top
    return {
        x: center.x + Math.cos(angle) * radius * value,
        y: center.y + Math.sin(angle) * radius * value
    };
};

export const EcosystemSlide = ({ data }: { data: GitHubData }) => {

    // --- 1. Calculate Aura Stats (Normalized 0-1) ---
    const stats = useMemo(() => {
        const caps = {
            velocity: 1000,   // Commits/yr
            impact: 50,       // Stars
            tenacity: 30,     // Max Streak Days
            versatility: 6,   // Languages
            community: 50     // Followers
        };

        const totalStars = data.repositories.reduce((acc, r) => acc + r.stars, 0);
        const uniqueLangs = new Set(data.repositories.map(r => r.language)).size;

        return [
            { label: "Velocity", value: Math.min(data.contributions.totalCommits / caps.velocity, 1), raw: data.contributions.totalCommits },
            { label: "Impact", value: Math.min(totalStars / caps.impact, 1), raw: totalStars },
            { label: "Tenacity", value: Math.min(data.activity.maxStreak / caps.tenacity, 1), raw: data.activity.maxStreak },
            { label: "Versatility", value: Math.min(uniqueLangs / caps.versatility, 1), raw: uniqueLangs },
            { label: "Community", value: Math.min(data.profile.followers / caps.community, 1), raw: data.profile.followers }
        ];
    }, [data]);

    // --- 2. Chart Config ---
    const size = 300; // SVG viewBox size
    const center = { x: size / 2, y: size / 2 };
    const radius = 100; // Chart radius

    // Generate Polygon Path
    const pathData = stats.map((stat, i) => {
        const p = getPoint(stat.value, i, stats.length, radius, center);
        return `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`;
    }).join(' ') + ' Z';

    // Generate Background Grid (Concentric Pentagons)
    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

    return (
        <div className="w-full h-full flex items-center justify-center bg-[var(--void-bg)] dark:bg-[#050505] text-[var(--foreground)] dark:text-white overflow-hidden relative transition-colors duration-500">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-white dark:from-[#050505] dark:to-[#0a0a0a]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {/* Left: Explanation */}
                <div className="text-left space-y-6">
                    <div>
                        <motion.h2
                            className="text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 mb-2"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Aura Signature
                        </motion.h2>
                        <p className="text-gray-500 dark:text-gray-400 font-mono text-sm tracking-widest uppercase">
                            Multi-Dimensional Developer Analysis
                        </p>
                    </div>

                    <div className="space-y-4">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                                className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/5 backdrop-blur-sm"
                            >
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase">{stat.label}</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-cyan-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.value * 100}%` }}
                                            transition={{ duration: 1, delay: 1 }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono w-8 text-right bg-black/5 dark:bg-black/20 p-1 rounded">{stat.raw}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right: The Radar Chart */}
                <div className="relative flex items-center justify-center">
                    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[400px] h-auto drop-shadow-2xl overflow-visible">
                        {/* Background Grid */}
                        {gridLevels.map((level, lvlIdx) => {
                            const gridPath = stats.map((_, i) => {
                                const p = getPoint(level, i, stats.length, radius, center);
                                return `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`;
                            }).join(' ') + ' Z';

                            return (
                                <motion.path
                                    key={lvlIdx}
                                    d={gridPath}
                                    fill="none"
                                    stroke="var(--foreground)"
                                    strokeOpacity="0.1"
                                    strokeWidth="1"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: lvlIdx * 0.1 }}
                                />
                            );
                        })}

                        {/* Axes Lines */}
                        {stats.map((_, i) => {
                            const p = getPoint(1, i, stats.length, radius, center);
                            return (
                                <motion.line
                                    key={`axis-${i}`}
                                    x1={center.x} y1={center.y}
                                    x2={p.x} y2={p.y}
                                    stroke="var(--foreground)"
                                    strokeOpacity="0.1"
                                    strokeWidth="1"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1 }}
                                />
                            );
                        })}

                        {/* The Data Polygon */}
                        <motion.path
                            d={pathData}
                            fill="rgba(6, 182, 212, 0.2)" // Cyan-500 with opacity
                            stroke="#06b6d4" // Cyan-500
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0, scale: 0 }}
                            animate={{ pathLength: 1, opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, type: "spring" }}
                            className="drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                        />

                        {/* Points */}
                        {stats.map((stat, i) => {
                            const p = getPoint(stat.value, i, stats.length, radius, center);
                            return (
                                <motion.circle
                                    key={`dot-${i}`}
                                    cx={p.x} cy={p.y}
                                    r={4}
                                    className="fill-white stroke-cyan-500 stroke-2"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.5 + (i * 0.1) }}
                                />
                            );
                        })}

                        {/* Labels */}
                        {stats.map((stat, i) => {
                            // Push labels out slightly further than radius
                            const p = getPoint(1.15, i, stats.length, radius, center);
                            return (
                                <motion.text
                                    key={`label-${i}`}
                                    x={p.x} y={p.y + 4} // Optical adjustment
                                    textAnchor="middle"
                                    className="text-[10px] font-bold uppercase fill-gray-500 dark:fill-gray-400 font-mono tracking-widest"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                >
                                    {stat.label}
                                </motion.text>
                            );
                        })}
                    </svg>

                    {/* Floating Core Label purely decorative */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-[50px] pointer-events-none" />
                </div>
            </motion.div>
        </div>
    );
};
