'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { GitHubData } from '@/types/github';
import dynamic from 'next/dynamic';
import { SlideSkeleton } from '@/components/ui/SlideSkeleton';

const IdentitySlide = dynamic(() => import('./slides/IdentitySlide').then(mod => mod.IdentitySlide), {
    loading: () => <SlideSkeleton />
});
const ContributionsSlide = dynamic(() => import('./slides/ContributionsSlide').then(mod => mod.ContributionsSlide), {
    loading: () => <SlideSkeleton />
});
const CalendarSlide = dynamic(() => import('./slides/CalendarSlide').then(mod => mod.CalendarSlide), {
    loading: () => <SlideSkeleton />
});
const ReposSlide = dynamic(() => import('./slides/ReposSlide').then(mod => mod.ReposSlide), {
    loading: () => <SlideSkeleton />
});
const RhythmSlide = dynamic(() => import('./slides/RhythmSlide').then(mod => mod.RhythmSlide), {
    loading: () => <SlideSkeleton />
});
const LegacySlide = dynamic(() => import('./slides/LegacySlide').then(mod => mod.LegacySlide), {
    loading: () => <SlideSkeleton />
});
const PulseSlide = dynamic(() => import('./slides/PulseSlide').then(mod => mod.PulseSlide), {
    loading: () => <SlideSkeleton />
});
const EcosystemSlide = dynamic(() => import('./slides/EcosystemSlide').then(mod => mod.EcosystemSlide), {
    loading: () => <SlideSkeleton />
});
const SummarySlide = dynamic(() => import('./slides/SummarySlide').then(mod => mod.SummarySlide), {
    loading: () => <SlideSkeleton />
});

const SLIDE_COMPONENTS = [
    IdentitySlide,
    ContributionsSlide,
    PulseSlide,
    CalendarSlide,
    ReposSlide,
    EcosystemSlide,
    RhythmSlide,
    LegacySlide,
    SummarySlide
];

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 1 // No scaling for cleaner slide
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 0.95 // Subtle depth effect on exit
    })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

// ... imports ...

export const SlideDeck = ({ data }: { data: GitHubData }) => {
    const [[page, direction], setPage] = useState([0, 0]);
    const [isPaused, setIsPaused] = useState(false);

    // Derived props map for each slide to strictly typed data
    const slideProps = [
        { profile: data.profile },
        { stats: data.contributions },
        { calendar: data.contributions.calendar }, // PulseSlide
        { data: data }, // CalendarSlide (Updated to receive full data for Time Machine)
        { repos: data.repositories },
        { data: data }, // EcosystemSlide (Radar)
        { activity: data.activity, calendar: data.contributions.calendar }, // RhythmSlide (Momentum)
        { data: data }, // LegacySlide (Legacy)
        { data: data }  // SummarySlide
    ];

    const paginate = useCallback((newDirection: number) => {
        const nextPage = page + newDirection;
        if (nextPage >= 0 && nextPage < SLIDE_COMPONENTS.length) {
            setPage([nextPage, newDirection]);
        }
    }, [page]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") paginate(1);
            if (e.key === "ArrowLeft") paginate(-1);
            if (e.key === " ") setIsPaused(prev => !prev); // Spacebar to toggle pause
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [paginate]);


    const ActiveSlide = SLIDE_COMPONENTS[page];
    const activeProps = slideProps[page];

    return (
        <div
            className="relative w-screen h-screen overflow-hidden bg-[var(--void-bg)] text-[var(--foreground)] transition-colors duration-500"
            role="region"
            aria-label="Developer Story Slideshow"
        >

            {/* Progress Bar (WhatsApp Style) */}
            <div
                className="absolute top-4 left-0 w-full flex gap-2 px-4 z-50 pointer-events-none"
                role="progressbar"
                aria-valuenow={page + 1}
                aria-valuemin={1}
                aria-valuemax={SLIDE_COMPONENTS.length}
            >
                {SLIDE_COMPONENTS.map((_, index) => (
                    <div key={index} className="flex-1 h-1 bg-gray-300 dark:bg-white/20 rounded-full overflow-hidden backdrop-blur-md transition-colors duration-300">
                        <motion.div
                            // Force animation reset when state changes between active/inactive OR when paused/unpaused for current slide
                            key={`${index}-${index === page ? (isPaused ? 'paused' : 'playing') : 'inactive'}`}
                            className={`h-full relative z-50 shadow-[0_0_12px_rgba(34,211,238,0.8)] ${isPaused && index === page
                                ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                                : "bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
                                }`}
                            initial={{ width: index < page ? "100%" : "0%" }}
                            animate={{ width: index < page ? "100%" : index === page ? (isPaused ? "0%" : "100%") : "0%" }}
                            transition={{ duration: index === page && !isPaused ? 5 : 0.3, ease: "linear" }}
                            onAnimationComplete={() => {
                                if (index === page && !isPaused && page < SLIDE_COMPONENTS.length - 1) {
                                    paginate(1);
                                }
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Pause/Play Button */}
            <button
                onClick={() => setIsPaused(!isPaused)}
                className="absolute top-8 right-20 z-50 p-2 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 hover:shadow-lg transition-all duration-300"
                aria-label={isPaused ? "Resume Slideshow" : "Pause Slideshow"}
            >
                {isPaused ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" fillOpacity="0.2" />
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="6" y="4" width="4" height="16" fill="currentColor" fillOpacity="0.2" />
                        <rect x="14" y="4" width="4" height="16" fill="currentColor" fillOpacity="0.2" />
                    </svg>
                )}
            </button>

            {/* Home Button (Top Right) */}
            <Link
                href="/"
                className="absolute top-8 right-6 z-50 p-2 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all duration-300"
                aria-label="Return to Home"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            </Link>

            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={page}
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
                        opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    style={{ willChange: "transform" }}
                    aria-live="polite"
                >
                    {/* Render active slide with correct props */}
                    <ActiveSlide {...(activeProps as any)} />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons (Centered, Premium Glass/Neon) */}

            {/* PREV BUTTON */}
            <AnimatePresence>
                {page > 0 && (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(125,125,125,0.15)", boxShadow: "0 0 25px rgba(0,243,255,0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => paginate(-1)}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-black dark:text-white transition-all duration-300 group"
                        aria-label="Previous Slide"
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-cyan-600 dark:group-hover:stroke-cyan-400 transition-colors">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* NEXT BUTTON */}
            <AnimatePresence>
                {page < SLIDE_COMPONENTS.length - 1 && (
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(125,125,125,0.15)", boxShadow: "0 0 25px rgba(0,243,255,0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => paginate(1)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-black dark:text-white transition-all duration-300 group"
                        aria-label="Next Slide"
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-cyan-600 dark:group-hover:stroke-cyan-400 transition-colors">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Mobile Touch hint (Optional, very subtle) */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-black/20 dark:text-white/20 text-xs uppercase tracking-[0.3em] pointer-events-none sm:hidden">
                Swipe to Navigate
            </div>
        </div>
    );
};
