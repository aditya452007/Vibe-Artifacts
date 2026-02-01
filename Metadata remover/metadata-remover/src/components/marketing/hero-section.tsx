"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StoryboardCanvas } from "./storyboard-canvas";
import { motion, AnimatePresence } from "framer-motion";
import TextType, { TextSegment } from "@/components/ui/text-type";
import { cn } from "@/lib/utils";

const narrativeSegments: TextSegment[][] = [
    [
        { text: "You upload an " },
        { text: "image", className: "text-[#D4AF37]" }
    ],
    [
        { text: "Hidden metadata", className: "text-[#D4AF37]" },
        { text: " travels with it" }
    ],
    [
        { text: "Your data becomes " },
        { text: "exposed", className: "text-[#D4AF37]" }
    ],
    [
        { text: "We " },
        { text: "remove", className: "text-[#D4AF37]" },
        { text: " what shouldn't be shared" }
    ],
    [
        { text: "Now you can " },
        { text: "share safely", className: "text-[#D4AF37]" }
    ]
];

const taglines = [
    "Every photo carries hidden information.",
    "Location, device, and personal details move silently.",
    "Anyone can access what you never meant to share.",
    "Metadata stripped. Privacy restored.",
    "Your image. Your control."
];

export function HeroSection({ onStartApp }: { onStartApp: () => void }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [textTypeResetKey, setTextTypeResetKey] = useState(0);

    const handleStepChange = (index: number) => {
        setCurrentStep(index);
    };

    const handleManualStepChange = (index: number) => {
        setCurrentStep(index);
        // Force TextType to restart/reset to the new index immediately
        setTextTypeResetKey(prev => prev + 1);
    };

    const PremiumCursor = (
        <span className="inline-block w-[3px] h-[0.9em] bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.6)] rounded-sm align-middle mb-1" />
    );

    return (
        <section className="relative w-screen h-screen overflow-hidden bg-[#FAFAF9] dark:bg-[#050505] transition-colors duration-500">
            <div className="container mx-auto h-full px-6 md:px-12">
                {/* 35/65 Split Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[3.5fr_6.5fr] h-full items-center gap-8 lg:gap-16">

                    {/* LEFT SIDE: Content (35%) */}
                    <div className="flex flex-col justify-center space-y-6 lg:space-y-8 z-10 w-full order-2 lg:order-1 relative">
                        <div className="space-y-4 min-h-[160px]">
                            {/* TextType Animation for Heading */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1] text-[#1A1A1A] dark:text-[#F5F5F5]">
                                <TextType
                                    key={textTypeResetKey}
                                    text={narrativeSegments}
                                    startIndex={currentStep}
                                    typingSpeed={50}
                                    deletingSpeed={30}
                                    pauseDuration={3000}
                                    onStepChange={handleStepChange}
                                    paused={isPaused}
                                    loop={true}
                                    cursorClassName="ml-1"
                                    cursorCharacter={PremiumCursor}
                                    eraseOnComplete={false}
                                />
                            </h1>

                            {/* Tagline Animation */}
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={currentStep}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-lg md:text-xl text-[#52525B] dark:text-[#A1A1AA] font-medium max-w-md"
                                >
                                    {taglines[currentStep]}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start">
                            <Button
                                size="lg"
                                className="text-lg px-10 py-7 rounded-full bg-[#1A1A1A] hover:bg-black text-white dark:bg-[#D4AF37] dark:hover:bg-[#C5A028] dark:text-black border-none shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                                onClick={onStartApp}
                            >
                                Clean Your Images Now
                            </Button>

                            {/* Step Indicator & Pause */}
                            <div className="flex items-center gap-4 mt-4 sm:mt-0 h-14">
                                <div className="flex items-center gap-2 px-2 bg-black/5 dark:bg-white/5 rounded-full p-1.5 backdrop-blur-sm border border-black/5 dark:border-white/5 transition-colors">
                                    {narrativeSegments.map((_, i) => (
                                        <div
                                            key={i}
                                            onClick={() => handleManualStepChange(i)}
                                            className={cn(
                                                "h-1.5 rounded-full transition-all duration-500 cursor-pointer",
                                                currentStep === i ? "w-8 bg-[#D4AF37]" : "w-3 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                                            )}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => setIsPaused(!isPaused)}
                                    className="group w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm text-[#1A1A1A] dark:text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-black transition-all shadow-sm hover:scale-110 active:scale-95"
                                    aria-label={isPaused ? "Play Animation" : "Pause Animation"}
                                >
                                    {isPaused ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: 3D Animation Storyboard (65%) */}
                    <div className="relative w-full h-[50vh] lg:h-full order-1 lg:order-2 flex items-center justify-center">
                        <StoryboardCanvas currentStep={currentStep} className="w-full h-full" />
                    </div>
                </div>
            </div>

            {/* Background Texture/Noise */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </section>
    );
}
