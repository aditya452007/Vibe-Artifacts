"use client";

import ScrollReveal from "@/components/ui/scroll-reveal";
import { useRef } from "react";

export function MissionSection() {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section ref={sectionRef} className="relative min-h-screen bg-background flex items-center justify-center py-32 px-4 overflow-hidden">
            {/* Animated Background Element - "The void filler" */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
                <svg
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[150vmax] h-[150vmax] animate-[spin_60s_linear_infinite]"
                >
                    <path
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="0.5"
                        d="M42.7,-72.8C56.3,-66.3,68.8,-57.8,78.6,-47.3C88.4,-36.8,95.5,-24.3,95.7,-11.7C95.9,0.9,89.1,13.6,81.1,24.8C73.1,36,63.9,45.7,53.2,53.2C42.4,60.7,30.1,66.1,17.4,68.9C4.7,71.7,-8.4,71.9,-20.9,69.2C-33.4,66.5,-45.3,60.9,-55.4,52.5C-65.5,44.1,-73.8,32.9,-78.4,20.4C-83,7.9,-83.9,-5.9,-78.8,-17.8C-73.7,-29.7,-62.6,-39.7,-51.1,-46.8C-39.6,-53.9,-27.7,-58.1,-15.8,-63.3C-3.9,-68.5,8,-74.7,21.1,-75.6C34.2,-76.5,48.5,-72.1,42.7,-72.8Z"
                        transform="translate(100 100)"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--primary)" />
                            <stop offset="100%" stopColor="var(--accent)" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                <ScrollReveal
                    scrollContainerRef={sectionRef} // Bind trigger to this section
                    baseOpacity={0.0}
                    enableBlur={true}
                    baseRotation={3} // Keep refined rotation for character
                    blurStrength={12}
                    textClassName="text-foreground text-5xl md:text-7xl font-bold tracking-tight leading-tight"
                    // Use viewport-relative triggers that ensure completion before bottom
                    rotationEnd="bottom bottom+=100"
                    wordAnimationEnd="bottom bottom+=100"
                >
                    Our mission is to give you back control over your digital privacy. Every photo shares a story you didn't intend to tell. We simply rewrite it.
                </ScrollReveal>
            </div>
        </section>
    );
}
