import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GitHubData } from '@/types/github';
import { MotionNumber } from '../ui/MotionNumber';
import { fetchYear } from '@/lib/data-service';
import { Calendar, ChevronDown, Clock, Activity, Zap } from 'lucide-react';

// --- Helper Components ---
const DayBlock = ({ level }: { level: number }) => {
    // 0 = #161b22 (void), 1 = #0e4429, 2 = #006d32, 3 = #26a641, 4 = #39d353
    // "Maniac" Neon Palette - High Visibility Mode
    const colors = [
        "bg-[#161b22] border-[#30363d]", // 0 (Distinct Dark Block)
        "bg-emerald-900/80 border-emerald-800", // 1
        "bg-emerald-700/90 border-emerald-600", // 2
        "bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]", // 3
        "bg-[#39d353] border-[#39d353] shadow-[0_0_12px_rgba(57,211,83,0.8)]" // 4
    ];

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] rounded-[3px] border ${colors[level] || colors[0]} transition-all duration-300`}
        />
    );
};

// Compute streak for a specific calendar
const calculateYearStats = (calendar: any) => {
    let maxStreak = 0;
    let activeDays = 0;

    if (!calendar || !calendar.weeks) return { maxStreak: 0, activeDays: 0, total: 0 };

    const days = calendar.weeks.flatMap((w: any) => w.contributionDays);

    let temp = 0;
    days.forEach((d: any) => {
        if (d.contributionCount > 0) {
            temp++;
            activeDays++;
            maxStreak = Math.max(maxStreak, temp);
        } else {
            temp = 0;
        }
    });

    return { maxStreak, activeDays, total: calendar.totalContributions };
};


export const CalendarSlide = ({ data }: { data: GitHubData }) => {
    const username = data.profile.username;
    // Initial history (preloaded 3 years)
    const [history, setHistory] = useState(data.contributions.history || []);
    // Full list of available years (e.g., 2015-2025)
    // If years is missing (backward compat), fallback to just valid history years or current
    const availableYears = data.contributions.years && data.contributions.years.length > 0
        ? data.contributions.years
        : history.map(h => h.year);

    const [selectedYear, setSelectedYear] = useState(availableYears[0] || new Date().getFullYear());
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Get Data for Selected Year
    const currentData = useMemo(() => {
        return history.find(y => y.year === selectedYear);
    }, [selectedYear, history]);

    const stats = useMemo(() => calculateYearStats(currentData ? currentData.calendar : null), [currentData]);

    // Handle Time Travel
    const handleYearSelect = async (year: number) => {
        setIsDropdownOpen(false);
        if (year === selectedYear) return;

        setSelectedYear(year);

        // If data exists, do nothing
        if (history.find(h => h.year === year)) return;

        // Fetch lazy
        setIsLoading(true);
        try {
            const newYearData = await fetchYear(username, year);
            if (newYearData) {
                setHistory(prev => [...prev, newYearData]);
            }
        } catch (e) {
            console.error("Time Machine Malfunction", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-[#02040a] text-white">

            {/* Header Area */}
            <motion.div
                className="w-full max-w-6xl flex flex-col gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex flex-col sm:flex-row justify-between items-end border-b border-[#30363d] pb-6 gap-4">
                    {/* Left: Title */}
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2 ml-1">
                            Contribution Graph
                        </h2>

                        {/* Stats Row */}
                        <div className="flex gap-6 text-xs sm:text-sm font-mono text-gray-400">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                <span className="text-white font-bold"><MotionNumber value={stats.total} /></span> Contributions
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-500" />
                                <span className="text-white font-bold"><MotionNumber value={stats.activeDays} /></span> Active Days
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                <span className="text-white font-bold"><MotionNumber value={stats.maxStreak} /></span> Day Streak
                            </div>
                        </div>
                    </div>

                    {/* Right: Time Capsule Button */}
                    <div className="relative z-50">
                        <motion.button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 px-5 py-3 bg-[#161b22] border border-[#30363d] hover:border-gray-500 rounded-xl text-white font-mono text-sm font-bold shadow-lg transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{selectedYear}</span>
                            <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }}>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </motion.div>
                        </motion.button>

                        {/* Dropdown */}
                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-64 max-h-80 overflow-y-auto bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl p-2 custom-scrollbar"
                                >
                                    <div className="flex flex-col gap-1">
                                        {availableYears.map(year => (
                                            <button
                                                key={year}
                                                onClick={() => handleYearSelect(year)}
                                                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-mono transition-colors ${selectedYear === year
                                                        ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/50'
                                                        : 'text-gray-400 hover:bg-[#21262d] hover:text-white'
                                                    }`}
                                            >
                                                <span>{year}</span>
                                                {selectedYear === year && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Calendar Container - VISUAL ISOLATION */}
                <div className="relative group rounded-2xl p-[1px] bg-gradient-to-br from-[#30363d] to-[#161b22] shadow-2xl">
                    <div className="absolute inset-0 bg-emerald-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative bg-[#0d1117] rounded-2xl p-6 sm:p-8 overflow-hidden border border-[#30363d]">
                        {isLoading ? (
                            <div className="h-[200px] flex flex-col items-center justify-center gap-4 text-emerald-500">
                                <div className="w-10 h-10 border-4 border-emerald-900 border-t-emerald-500 rounded-full animate-spin" />
                                <span className="text-xs font-mono tracking-widest opacity-80">RETRIEVING ARCHIVES...</span>
                            </div>
                        ) : (
                            <div className="overflow-x-auto pb-2 custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedYear}
                                        initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                                        transition={{ duration: 0.4 }}
                                        className="flex gap-[3px] sm:gap-1 min-w-[max-content]"
                                    >
                                        {currentData && currentData.calendar.weeks.map((week: any, wIndex: number) => (
                                            <div key={wIndex} className="flex flex-col gap-[3px] sm:gap-1">
                                                {week.contributionDays.map((day: any, dIndex: number) => {
                                                    let level = 0;
                                                    if (day.contributionCount > 0) level = 1;
                                                    if (day.contributionCount >= 4) level = 2;
                                                    if (day.contributionCount >= 8) level = 3;
                                                    if (day.contributionCount >= 12) level = 4;

                                                    return <DayBlock key={`${wIndex}-${dIndex}`} level={level} />;
                                                })}
                                            </div>
                                        ))}
                                        {!currentData && (
                                            <div className="text-red-500 font-mono text-sm py-10">
                                                DATA CORRUPTION DETECTED FOR {selectedYear}.
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Footer Scale */}
                        <div className="mt-6 flex items-center justify-between text-xs text-gray-500 font-mono border-t border-[#30363d] pt-4">
                            <span>{username || 'USER'}@{selectedYear}</span>
                            <div className="flex items-center gap-2">
                                <span>Less</span>
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 rounded-[2px] bg-[#161b22] border border-[#30363d]" />
                                    <div className="w-3 h-3 rounded-[2px] bg-emerald-900/80 border border-emerald-800" />
                                    <div className="w-3 h-3 rounded-[2px] bg-emerald-500 border border-emerald-400" />
                                    <div className="w-3 h-3 rounded-[2px] bg-[#39d353] border-[#39d353]" />
                                </div>
                                <span>More</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
