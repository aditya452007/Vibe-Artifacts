import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { CommitActivity, ContributionCalendar } from '@/types/github';
import { MotionNumber } from '../ui/MotionNumber';

export const RhythmSlide = ({ activity, calendar }: { activity: CommitActivity, calendar: ContributionCalendar }) => {

    const totalActiveDays = useMemo(() => {
        return calendar.weeks.reduce((acc, week) => {
            return acc + week.contributionDays.filter(d => d.contributionCount > 0).length;
        }, 0);
    }, [calendar]);

    const activeRatio = Math.round((totalActiveDays / 365) * 100);

    // Logic: User requested to ONLY show highest streak and NEVER show zero.
    // "Do not show zero in the highest streak but remove that from there... Only show the highest streak number"
    const displayStreak = Math.max(1, activity.maxStreak);

    // Status Logic - Driven by Max Streak (The "Potential" or "Record")
    let status = "Sparking";
    let baseColor = "from-yellow-500 to-orange-600";
    let flameHeight = 1; // Scale factor

    if (displayStreak > 3) { status = "Ignited"; baseColor = "from-orange-500 to-red-600"; flameHeight = 1.2; }
    if (displayStreak > 14) { status = "Blazing"; baseColor = "from-red-500 to-rose-600"; flameHeight = 1.5; }
    if (displayStreak > 30) { status = "Inferno"; baseColor = "from-rose-600 to-purple-600"; flameHeight = 1.8; }
    if (displayStreak > 60) { status = "Supernova"; baseColor = "from-purple-600 to-blue-600"; flameHeight = 2.0; }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--void-bg)] dark:bg-[#050000] text-[var(--foreground)] dark:text-white p-8 relative overflow-hidden transition-colors duration-500">
            {/* Dark Ambient Void */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900 to-black pointer-events-none" />

            <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-5 gap-8 items-center h-full max-h-[600px]">

                {/* LEFT: Stats Column (Integrated cleaner) */}
                <div className="hidden md:flex flex-col justify-center h-full gap-12 text-right">
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-sm"
                    >
                        <div className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em] mb-1">Active Days</div>
                        <div className="text-4xl font-black text-gray-900 dark:text-white"><MotionNumber value={activeRatio} />%</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-1">OF THIS YEAR</div>
                    </motion.div>

                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="p-4 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-sm"
                    >
                        {/* REPLACED: Longest Streak -> Total Contributions (Since Streak is now center) */}
                        <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-[0.2em] mb-1">Total Impact</div>
                        <div className="text-4xl font-black text-gray-900 dark:text-white"><MotionNumber value={calendar.totalContributions} /></div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-1">CONTRIBUTIONS</div>
                    </motion.div>
                </div>

                {/* CENTER: The Magma Reactor */}
                <div className="col-span-3 flex flex-col items-center justify-center h-full relative">

                    <div className="relative w-[500px] h-[500px] flex items-center justify-center">

                        {/* Ambient Heat Haze */}
                        <motion.div
                            className={`absolute inset-0 rounded-full bg-gradient-to-r ${baseColor} opacity-10 dark:opacity-20 blur-[100px]`}
                            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.1, 0.3, 0.1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />

                        {/* Reactor Rings (Tech Fire) */}
                        {/* Outer Slow Ring */}
                        <motion.div
                            className="absolute inset-0 rounded-full border border-orange-500/20 dark:border-orange-500/30 border-dashed"
                            style={{ borderSpacing: "20px" }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Middle Energy Ring */}
                        <motion.div
                            className="absolute inset-12 rounded-full border-2 border-t-red-500 border-r-transparent border-b-orange-500 border-l-transparent opacity-60 dark:opacity-80"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Inner High-Speed Ring */}
                        <motion.div
                            className="absolute inset-24 rounded-full border-4 border-t-transparent border-r-gray-900/20 dark:border-r-white/20 border-b-transparent border-l-gray-900/20 dark:border-l-white/20"
                            animate={{ rotate: 180 }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Core Label */}
                        <div className="relative z-20 flex flex-col items-center">
                            <motion.h1
                                className="text-[160px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-600 via-orange-500 to-red-600 dark:from-white dark:via-orange-100 dark:to-orange-500 drop-shadow-2xl filter saturate-150"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                            >
                                <MotionNumber value={displayStreak} />
                            </motion.h1>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-4 flex flex-col items-center"
                            >
                                <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-400 dark:via-orange-500 to-transparent mb-2 opacity-50" />
                                <span className={`text-xl font-bold uppercase tracking-[0.5em] text-transparent bg-clip-text bg-gradient-to-r ${baseColor}`}>
                                    {status}
                                </span>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Context (Quote/Will) */}
                <div className="hidden md:flex flex-col justify-center h-full text-left pl-8 border-l border-white/5">
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="max-w-[150px]"
                    >
                        <p className="text-xs font-bold text-gray-500 uppercase leading-relaxed tracking-widest">
                            "The flame that burns twice as bright burns half as long."
                        </p>
                        <p className="mt-4 text-[10px] text-orange-500/60 font-mono">
                            - DR. {activity.isWeekendWarrior ? 'AGASA' : 'VEGAPUNK'}
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
