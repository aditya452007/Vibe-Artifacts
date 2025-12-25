import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ContributionCalendar } from '@/types/github';
import { MotionNumber } from '../ui/MotionNumber';

const PULSE_HEIGHT = 200;
const PULSE_WIDTH = 800;

export const PulseSlide = ({ calendar }: { calendar: ContributionCalendar }) => {

    // 1. Process Data: Extract weekly totals to create the waveform
    // We limit to the last 20 weeks for a clear, zoomed-in "Heartbeat" view, 
    // or we can do all 52. Let's do all 52 but smoothed.
    // Actually, a "Pulse" looks better with fewer points. Let's do last 24 weeks.
    const weeklyData = useMemo(() => {
        const weeks = calendar.weeks.slice(-30); // Last 30 weeks
        return weeks.map(week => {
            const total = week.contributionDays.reduce((acc, day) => acc + day.contributionCount, 0);
            return total;
        });
    }, [calendar]);

    // 2. Generate Path for SVG
    const maxVal = Math.max(...weeklyData, 5); // Avoid div by zero
    const points = weeklyData.map((val, i) => {
        const x = (i / (weeklyData.length - 1)) * PULSE_WIDTH;
        // Invert Y because SVG 0 is top. 
        // We want 0 val at HEIGHT, max Val at 0 (or padded).
        const normalizedH = (val / maxVal) * (PULSE_HEIGHT - 40);
        const y = PULSE_HEIGHT - normalizedH - 20; // 20px padding bottom
        return `${x},${y}`;
    }).join(' ');

    const lastPoint = weeklyData.length - 1;
    const endX = PULSE_WIDTH;
    const endY = PULSE_HEIGHT;
    const startX = 0;
    const startY = PULSE_HEIGHT;

    // 3. Generate X-Axis Labels (Months)
    // We want to show month names roughly where they start in the 30-week window
    const monthLabels = useMemo(() => {
        const labels: { x: number; text: string }[] = [];
        let lastMonth = '';

        // Iterate only strictly every ~4 weeks to avoid clutter, or check month change
        const weeks = calendar.weeks.slice(-30);
        weeks.forEach((week, i) => {
            const date = new Date(week.contributionDays[0].date);
            const month = date.toLocaleString('default', { month: 'short' });
            if (month !== lastMonth) {
                // If it's a new month, add a label at this index
                // Only if index is > 2 to avoid edge clipping start
                if (i > 1 && i < weeks.length - 2) {
                    const x = (i / (weeklyData.length - 1)) * PULSE_WIDTH;
                    labels.push({ x, text: month });
                }
                lastMonth = month;
            }
        });
        return labels;
    }, [calendar, weeklyData]);

    // Closed path for fill area (gradient)
    const areaPath = `0,${PULSE_HEIGHT} ${points} ${PULSE_WIDTH},${PULSE_HEIGHT}`;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--void-bg)] dark:bg-black text-[var(--foreground)] dark:text-white p-8 relative overflow-hidden transition-colors duration-500">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(100,100,100,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(100,100,100,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-5xl flex flex-col items-center"
            >
                <div className="text-center mb-8">
                    <h2 className="text-6xl font-black mb-2 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-600 dark:from-teal-300 dark:to-cyan-400 drop-shadow-lg">
                        Productivity Pulse
                    </h2>
                    <p className="text-lg font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        Weekly Contribution Velocity (Last 30 Weeks)
                    </p>
                </div>

                <div className="relative w-full aspect-[3/1] bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl p-8 flex items-center justify-center overflow-visible">

                    {/* SVG Container */}
                    <svg viewBox={`0 0 ${PULSE_WIDTH} ${PULSE_HEIGHT}`} className="w-full h-full overflow-visible">

                        {/* Gradient Definitions */}
                        <defs>
                            <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--cyber-blue)" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="var(--cyber-blue)" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Area Fill */}
                        <motion.path
                            d={`M${areaPath}Z`}
                            fill="url(#pulseGradient)"
                            stroke="none"
                            initial={{ opacity: 0, pathLength: 0 }}
                            animate={{ opacity: 1, pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />

                        {/* Baseline */}
                        <line x1="0" y1={PULSE_HEIGHT} x2={PULSE_WIDTH} y2={PULSE_HEIGHT} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />

                        {/* X-Axis Labels (Months) */}
                        {monthLabels.map((lbl, idx) => (
                            <text
                                key={idx}
                                x={lbl.x}
                                y={PULSE_HEIGHT + 25}
                                textAnchor="middle"
                                className="fill-gray-500 dark:fill-gray-400 text-xs font-mono uppercase font-bold"
                                style={{ fontSize: '12px' }}
                            >
                                {lbl.text}
                            </text>
                        ))}


                        {/* The Line */}
                        <motion.polyline
                            points={points}
                            fill="none"
                            stroke="var(--foreground)" // Adaptive stroke
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="stroke-black dark:stroke-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                        />

                        {/* Dots on peak weeks */}
                        {weeklyData.map((val, i) => {
                            if (val < maxVal * 0.5) return null; // Only show significant dots
                            const x = (i / (weeklyData.length - 1)) * PULSE_WIDTH;
                            const normalizedH = (val / maxVal) * (PULSE_HEIGHT - 40);
                            const y = PULSE_HEIGHT - normalizedH - 20;

                            return (
                                <motion.circle
                                    key={i}
                                    cx={x}
                                    cy={y}
                                    r={4}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.5 + (i * 0.05) }}
                                    className="fill-white stroke-cyan-600 dark:stroke-cyan-400 stroke-[3px]"
                                />
                            );
                        })}

                    </svg>

                    {/* Stats overlay */}
                    <div className="absolute top-6 right-8 text-right bg-white/80 dark:bg-black/50 p-4 rounded-xl backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-xl">
                        <div className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Weekly Peak</div>
                        <div className="text-3xl font-black text-black dark:text-white flex items-center gap-2 justify-end">
                            <span className="text-cyan-500">▲</span>
                            <MotionNumber value={maxVal} />
                        </div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">Commits / Week</div>
                    </div>
                </div>

                <div className="mt-12 max-w-2xl bg-black/5 dark:bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/5 backdrop-blur-sm">
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed font-medium">
                        This chart visualizes your coding consistency.
                        A <span className="text-cyan-600 dark:text-cyan-400 font-bold">consistent pulse</span> indicates a disciplined workflow,
                        while <span className="text-teal-600 dark:text-teal-400 font-bold">high peaks</span> represent intense sprint periods.
                    </p>
                </div>

            </motion.div>
        </div>
    );
};
